import ApiClient from './apiClient/apiClient';
import { language } from './types';
import { GetPrice } from './types';
import { ClientResponse, Product, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { ICardApiData } from './types';
import { ICatalogApiData } from './types';
import { IProductsQuery } from './apiClient/apiClientTypes';
import { IProductFilter } from './apiClient/apiClientTypes';

interface IGetProductData {
  productVariant?: boolean;
}
interface IGetProductDataById extends IGetProductData {
  id: string;
}
interface IGetProductDataByKey extends IGetProductData {
  key: string;
}

export default class ProductAdapter {
  private api: ApiClient;
  constructor(api: ApiClient) {
    this.api = api;
  }
  private getPrice: GetPrice = (centAmount, fractionDigits) => {
    if (centAmount && fractionDigits) {
      const price: number = centAmount / 10 ** fractionDigits;
      return price.toString();
    }
    return '';
  };
  private getProductCardData = (data: Product): ICardApiData[] => {
    const id = data.id;
    const key = data.key;
    const image1: string | undefined = data.masterData.current.variants[0].images?.[0].url;
    const image2: string | undefined = data.masterData.current.masterVariant.images?.[0].url;
    if (!image1 && !image2) {
      console.log('no image');
    }
    const name: string = data.masterData.current.name[language.ru];
    const description: string | undefined = data.masterData.current.description?.[language.ru];

    let price1 = '';
    let discPrice1 = '';
    let isDiscounted1: boolean = false;
    let price2 = '';
    let discPrice2 = '';
    let isDiscounted2: boolean = false;
    const priceData = data.masterData.current.masterVariant.prices;
    if (priceData && priceData.length > 0) {
      isDiscounted1 = Boolean(data.masterData.current.masterVariant.prices[0]?.discounted?.discount.id);
      const centAmount: number | undefined = data.masterData.current.masterVariant.prices[0]?.value.centAmount;
      const fractionDigits: number | undefined = data.masterData.current.masterVariant.prices[0]?.value.fractionDigits;
      price1 = this.getPrice(centAmount, fractionDigits);
      const discCentAmount: number | undefined = data.masterData.current.masterVariant.prices[0]?.discounted?.value.centAmount;
      const discFractionDigits: number | undefined = data.masterData.current.masterVariant.prices[0]?.discounted?.value.fractionDigits;
      discPrice1 = this.getPrice(discCentAmount, discFractionDigits);
    }
    const varPriceData = data.masterData.current.variants[0]?.prices;
    if (varPriceData && varPriceData.length > 0) {
      isDiscounted2 = Boolean(varPriceData[0]?.discounted?.discount.id);
      const centAmount: number | undefined = varPriceData[0]?.value.centAmount;
      const fractionDigits: number | undefined = varPriceData[0]?.value.fractionDigits;
      price2 = this.getPrice(centAmount, fractionDigits);
      const discCentAmount: number | undefined = varPriceData[0]?.discounted?.value.centAmount;
      const discFractionDigits: number | undefined = varPriceData[0]?.discounted?.value.fractionDigits;
      discPrice2 = this.getPrice(discCentAmount, discFractionDigits);
    }
    return [
      {
        id: id,
        key: key,
        image: image1,
        name: name,
        description: description,
        price: price1,
        isDiscounted: isDiscounted1,
        discPrice: discPrice1,
      },
      {
        id: id,
        key: key,
        image: image2,
        name: name,
        description: description,
        price: price2,
        isDiscounted: isDiscounted2,
        discPrice: discPrice2,
      },
    ];
  };
  private getCatalogData = (data: ProductProjectionPagedSearchResponse, productVariant = 0): ICardApiData[] => {
    const id = data.results.map((product) => product.id);
    const key = data.results.map((product) => product.key);
    const image = data.results.map((product) => product.masterVariant.images?.[productVariant]?.url);
    const name = data.results.map((product) => product.name[language.ru]);
    const description = data.results.map((product) => product.description?.[language.ru]);
    const isDiscountedList: boolean[] = data.results.map((product) =>
      Boolean(product.masterVariant.prices?.[productVariant].discounted?.discount.id),
    );
    const priceData = data.results.map((product) => product.masterVariant.prices);
    const prices: string[] = [];
    const discontPrices: string[] = [];
    if (priceData && priceData.length > 0) {
      const centAmount = data.results.map((product) => product.masterVariant.prices?.[productVariant]?.value.centAmount);
      const fractionDigits = data.results.map((product) => product.masterVariant.prices?.[productVariant]?.value.fractionDigits);
      const discCentAmount = data.results.map((product) => product.masterVariant.prices?.[productVariant]?.discounted?.value.centAmount);
      const discFractionDigits = data.results.map((product) => product.masterVariant.prices?.[productVariant]?.discounted?.value.fractionDigits);
      for (let i = 0; i < centAmount.length; i++) {
        const price = this.getPrice(centAmount[i], fractionDigits[i]);
        prices.push(price);
        if (discCentAmount && discFractionDigits) {
          const discontPrice = this.getPrice(discCentAmount[i], discFractionDigits[i]);
          discontPrices.push(discontPrice);
        } else {
          discontPrices.push('');
        }
      }
    }
    const catalog: ICardApiData[] = id.map((item, index) => {
      return {
        id: id[index],
        key: key[index],
        image: image[index],
        name: name[index],
        description: description[index],
        price: prices[index],
        isDiscounted: isDiscountedList[index],
        discPrice: discontPrices[index],
      };
    });
    return catalog;
  };
  public getCatalog = async (
    queryArgs?: Partial<IProductsQuery>,
    queryFilter?: Partial<IProductFilter>,
    productVariant = 0,
  ): Promise<ICatalogApiData> => {
    try {
      const res = await this.api.getProductFiltered(queryArgs, queryFilter);
      if (res.statusCode !== 200) {
        throw new Error(`Failed to load catalog. Status code: ${res.statusCode}`);
      }
      const totalCount: number | undefined = res.body.total;
      const products = this.getCatalogData(res.body, productVariant);
      return { products, totalCount };
    } catch (error) {
      const typedError = error as Error;
      throw typedError.message;
    }
  };

  public getProductByKey = async ({ key }: IGetProductDataByKey): Promise<ICardApiData[]> => {
    try {
      const res = (await this.api.getProduct({ key: key })) as ClientResponse<Product>;

      if (res.statusCode !== 200) {
        throw new Error(`Failed to load product with key. Status code: ${res.statusCode}`);
      }
      const data = res.body;
      return this.getProductCardData(data);
    } catch (error) {
      const typedError = error as Error;
      throw typedError.message;
    }
  };

  public getProductById = async ({ id }: IGetProductDataById): Promise<ICardApiData[]> => {
    try {
      const res = (await this.api.getProduct({ id: id })) as ClientResponse<Product>;
      if (res.statusCode !== 200) {
        throw new Error(`Failed to load product with ID. Status code: ${res.statusCode}`);
      }
      const data = res.body;
      return this.getProductCardData(data);
    } catch (error) {
      const typedError = error as Error;
      throw typedError.message;
    }
  };
}
