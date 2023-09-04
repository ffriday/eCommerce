import ApiClient from './apiClient/apiClient';
import { language } from './types';
import { GetPrice } from './types';
import { ClientResponse, Product } from '@commercetools/platform-sdk';
import { ICardApiData } from './types';
import { ICatalogApiData } from './types';
import { IProductsQuery } from './apiClient/apiClientTypes';

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

  public getCatalog = async (productsQueryParams: IProductsQuery, productVariant = false): Promise<ICatalogApiData> => {
    try {
      const res = await this.api.getProducts(productsQueryParams);
      if (res.statusCode !== 200) {
        throw new Error(`Failed to load catalog. Status code: ${res.statusCode}`);
      }
      const totalCount: number | undefined = res.body.total;
      const products = res.body.results.map((data) => this.getProductCardData(data, productVariant));
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
