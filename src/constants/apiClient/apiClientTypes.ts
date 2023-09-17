import { QueryParam } from '@commercetools/platform-sdk';
import { ByProjectKeyProductsByIDRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-by-id-request-builder';
import { ByProjectKeyProductsKeyByKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-key-by-key-request-builder';
import { ByProjectKeyProductsRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-request-builder';
import {
  AnonymousAuthMiddlewareOptions,
  AuthMiddlewareOptions,
  ExistingTokenMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

export enum LSKeys {
  id = 'customerId',
  token = 'token',
  refreshToken = 'refreshToken',
}

export enum SortParams {
  sortEN = 'en-us',
  sortRU = 'ru-by',
  searchEN = 'en-US',
  searchRU = 'ru-BY',
  ascending = 'asc',
  descending = 'desc',
  USD = 'USD',
}

export interface IMiddleware {
  auth: AuthMiddlewareOptions;
  password: PasswordAuthMiddlewareOptions;
  anon: AnonymousAuthMiddlewareOptions;
  token: ExistingTokenMiddlewareOptions;
  // token: RefreshAuthMiddlewareOptions;
  authorization?: string;
}

export interface IUserData {
  isLogged: boolean;
  id: string;
  token: string;
  tokenExpires: number;
  refreshToken: string;
}

export interface IProductsQuery {
  [key: string]: QueryParam;
  limit: number;
  offset: number;
}

export interface IFilterPattern {
  param: string | string[] | boolean | IPriceFilter;
}

export interface ISearchPattern {
  [key: string]: (param: IFilterPattern) => string[];
}

export interface IPriceFilter {
  from?: number;
  to?: number;
}

export interface IBaseFilter {
  lang: string;
}

export interface IProductFilter extends IBaseFilter {
  categoryId: string;
  price: IPriceFilter;
  sortName: string;
  sortPrice: string;
  discount: boolean;
  searchKeywords: string[];
  searchLanguage: string;
  currency: string;
}

export interface IProductSearch extends IBaseFilter {
  keyword: string;
}

export interface IKey {
  key: string;
}

export interface IId {
  id: string;
}

export interface ICategory {
  [key: string]: string;
}

export interface IChangeCustomer {
  name: string;
  surename: string;
  email: string;
  birthDate: string;
}

export type MyProjectKeyRequestBuilder =
  | ByProjectKeyProductsRequestBuilder
  | ByProjectKeyProductsByIDRequestBuilder
  | ByProjectKeyProductsKeyByKeyRequestBuilder;
