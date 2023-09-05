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
  private getProductCardData = (data: Product, productVariant = false): ICardApiData => {
    console.log(data);
    const id = data.id;
    const key = data.key;
    const image: string | undefined = productVariant
      ? data.masterData.current.variants[0].images?.[0].url
      : data.masterData.current.masterVariant.images?.[0].url;
    console.log(image);
    if (!image) {
      console.log('no image');
    }
    const name: string = data.masterData.current.name[language.ru];
    const description: string | undefined = data.masterData.current.description?.[language.ru];
    let price = '';
    const priceData = data.masterData.current.masterVariant.prices;
    if (priceData && priceData.length > 0) {
      const centAmount: number | undefined = data.masterData.current.masterVariant.prices[0]?.value.centAmount;
      const fractionDigits: number | undefined = data.masterData.current.masterVariant.prices[0]?.value.fractionDigits;
      price = this.getPrice(centAmount, fractionDigits);
    }
    const varPriceData = data.masterData.current.variants[0]?.prices;
    if (productVariant && varPriceData && varPriceData.length > 0) {
      const centAmount: number | undefined = varPriceData[0]?.value.centAmount;
      const fractionDigits: number | undefined = varPriceData[0]?.value.fractionDigits;
      price = this.getPrice(centAmount, fractionDigits);
    }
    return {
      id: id,
      key: key,
      image: image,
      name: name,
      description: description,
      price: price,
    };
  };
  private getCatalogData = (data: ProductProjectionPagedSearchResponse, productVariant = 0): ICardApiData[] => {
    const id = data.results.map((product) => product.id);
    const key = data.results.map((product) => product.key);
    const image = data.results.map((product) => product.masterVariant.images?.[productVariant]?.url);
    const name = data.results.map((product) => product.name[language.ru]);
    const description = data.results.map((product) => product.description?.[language.ru]);
    const priceData = data.results.map((product) => product.masterVariant.prices);
    const prices: string[] = [];
    if (priceData && priceData.length > 0) {
      const centAmount = data.results.map((product) => product.masterVariant.prices?.[productVariant]?.value.centAmount);
      const fractionDigits = data.results.map((product) => product.masterVariant.prices?.[productVariant]?.value.fractionDigits);
      for (let i = 0; i < centAmount.length; i++) {
        const price = this.getPrice(centAmount[i], fractionDigits[i]);
        prices.push(price);
      }
    }
    const catalog: ICardApiData[] = id.map((item, index) => {
      return {
        id: item[index],
        key: key[index],
        image: image[index],
        name: name[index],
        description: description[index],
        price: prices[index],
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

  public getProductByKey = async ({ key, productVariant = false }: IGetProductDataByKey): Promise<ICardApiData> => {
    try {
      const res = (await this.api.getProduct({ key: key })) as ClientResponse<Product>;

      if (res.statusCode !== 200) {
        throw new Error(`Failed to load product with key. Status code: ${res.statusCode}`);
      }
      const data = res.body;
      return this.getProductCardData(data, productVariant);
    } catch (error) {
      const typedError = error as Error;
      throw typedError.message;
    }
  };

  public getProductById = async ({ id, productVariant = false }: IGetProductDataById): Promise<ICardApiData> => {
    try {
      const res = (await this.api.getProduct({ id: id })) as ClientResponse<Product>;
      if (res.statusCode !== 200) {
        throw new Error(`Failed to load product with ID. Status code: ${res.statusCode}`);
      }
      const data = res.body;
      return this.getProductCardData(data, productVariant);
    } catch (error) {
      const typedError = error as Error;
      throw typedError.message;
    }
  };
}
