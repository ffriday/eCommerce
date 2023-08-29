import ApiClient from './apiClient';
import { eCommerceEnv } from './ecommerce.env';
import { language } from './types';
import { GetPrice } from './types';
import { ClientResponse, Product } from '@commercetools/platform-sdk';
import { ICardApiData } from './types';
const api = new ApiClient(eCommerceEnv);

const getPrice: GetPrice = (centAmount, fractionDigits) => {
  if (centAmount && fractionDigits) {
    return centAmount / 10 ** fractionDigits;
  }
  return '';
};
interface IGetProductsData {
  catalogKey?: string;
  productId?: string;
  productKey?: string;
}

const getProductCardData = (data: Product): ICardApiData => {
  const image: string | undefined = data.masterData.current.masterVariant.images?.[0]?.url;
  const name: string = data.masterData.current.name[language.ru];
  const description: string | undefined = data.masterData.current.description?.[language.ru];
  let price: number | '' = '';
  const priceData = data.masterData.current.masterVariant.prices;
  if (priceData && priceData.length > 0) {
    const centAmount: number | undefined = data.masterData.current.masterVariant.prices[0]?.value.centAmount;
    const fractionDigits: number | undefined = data.masterData.current.masterVariant.prices[0]?.value.fractionDigits;
    price = getPrice(centAmount, fractionDigits);
  }
  return {
    image: image,
    name: name,
    description: description,
    price: price,
  };
};

// depending on the parameter (catalog key, product key or product id) returns either an array of objects with information for the product card or just an object
export const getProductsData = async (productsQueryParams: IGetProductsData): Promise<ICardApiData[] | ICardApiData> => {
  try {
    if (productsQueryParams.catalogKey) {
      const res = await api.getProducts({ key: eCommerceEnv.CTP_PROJECT_KEY });
      if (res.statusCode !== 200) {
        throw new Error(`Failed to load catalog. Status code: ${res.statusCode}`);
      }
      return res.body.results.map((data) => getProductCardData(data));
    } else if (productsQueryParams.productKey) {
      const res = (await api.getProduct({ key: productsQueryParams.productKey })) as ClientResponse<Product>;
      if (res.statusCode !== 200) {
        throw new Error(`Failed to load product with key. Status code: ${res.statusCode}`);
      }
      const data = res.body;
      return getProductCardData(data);
    } else if (productsQueryParams.productId) {
      const res = (await api.getProduct({ id: productsQueryParams.productId })) as ClientResponse<Product>;
      if (res.statusCode !== 200) {
        throw new Error(`Failed to load product with ID. Status code: ${res.statusCode}`);
      }
      const data = res.body;
      return getProductCardData(data);
    }
    return { image: '', name: '', description: '', price: '' };
  } catch (error) {
    const typedError = error as Error;
    throw typedError.message;
  }
};
