import ApiClient from './apiClient/apiClient';
import { language } from './types';
import { GetPrice } from './types';
import { ClientResponse, Product } from '@commercetools/platform-sdk';
import { ICardApiData } from './types';
import { ICatalogApiData } from './types';
import { IProductsQuery } from './apiClient/apiClientTypes';

interface IGetProductData {
  productVariant?: number;
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
  private getProductCardData = (data: Product, productVariant = 0): ICardApiData => {
    const id = data.id;
    const image: string | undefined = data.masterData.current.masterVariant.images?.[productVariant]?.url;
    const name: string = data.masterData.current.name[language.ru];
    const description: string | undefined = data.masterData.current.description?.[language.ru];
    let price = '';
    const priceData = data.masterData.current.masterVariant.prices;
    if (priceData && priceData.length > 0) {
      const centAmount: number | undefined = data.masterData.current.masterVariant.prices[productVariant]?.value.centAmount;
      const fractionDigits: number | undefined = data.masterData.current.masterVariant.prices[productVariant]?.value.fractionDigits;
      price = this.getPrice(centAmount, fractionDigits);
    }
    return {
      id: id,
      image: image,
      name: name,
      description: description,
      price: price,
    };
  };

  public getCatalog = async (productsQueryParams: IProductsQuery, productVariant = 0): Promise<ICatalogApiData> => {
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

  public getProductByKey = async ({ key, productVariant = 0 }: IGetProductDataByKey): Promise<ICardApiData> => {
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

  public getProductById = async ({ id, productVariant = 0 }: IGetProductDataById): Promise<ICardApiData> => {
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
