import { IeCommerceEnv } from './ecommerce.env';
import {
  AnonymousAuthMiddlewareOptions,
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  QueryParam,
  RefreshAuthMiddlewareOptions,
  TokenCache,
  TokenStore,
  UserAuthOptions,
} from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyProductsRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-request-builder';
import { ByProjectKeyProductsByIDRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-by-id-request-builder';
import { ByProjectKeyProductsKeyByKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-key-by-key-request-builder';

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
}

export interface IMiddleware {
  auth: AuthMiddlewareOptions;
  password: PasswordAuthMiddlewareOptions;
  anon: AnonymousAuthMiddlewareOptions;
  token: RefreshAuthMiddlewareOptions;
}

export interface IUserData {
  isLogged: boolean;
  id: string;
  token: string;
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

export type MyProjectKeyRequestBuilder =
  | ByProjectKeyProductsRequestBuilder
  | ByProjectKeyProductsByIDRequestBuilder
  | ByProjectKeyProductsKeyByKeyRequestBuilder;

export abstract class ApiBase {
  private ENV: IeCommerceEnv;
  protected user: UserAuthOptions | null = null;
  private _userData: IUserData = {
    isLogged: false,
    id: '',
    token: '',
    refreshToken: '',
  };
  protected token: MyTokenChache = new MyTokenChache(); // Epmty token object
  protected tokenAnon: MyTokenChache = new MyTokenChache(); // Epmty token object
  // Middleware
  private httpMiddleware: HttpMiddlewareOptions;
  protected authMiddleware: AuthMiddlewareOptions;
  protected passwordMiddleware: PasswordAuthMiddlewareOptions | null = null; // Can't initialize without password
  protected anonymousMiddleware: AnonymousAuthMiddlewareOptions;
  protected refreshTokenMiddleware: RefreshAuthMiddlewareOptions;

  constructor(env: IeCommerceEnv) {
    this.ENV = env;
    // Init middleware options
    this.httpMiddleware = this.createHttpMiddlewareOptions();
    this.authMiddleware = this.createAuthMiddlewareOptions();
    this.anonymousMiddleware = this.createAnonymousMiddlewareOptions();
    this.refreshTokenMiddleware = this.createRefreshTokenMiddlewareOptions();
    this.isUserLogged(); // Check if user has id and token in LocalStorage and load it touserData
  }

  private createHttpMiddlewareOptions = (): HttpMiddlewareOptions => {
    return {
      host: this.ENV.CTP_API_URL,
      fetch: fetch,
    };
  };

  private createAuthMiddlewareOptions = (): AuthMiddlewareOptions => {
    return {
      host: this.ENV.CTP_AUTH_URL,
      projectKey: this.ENV.CTP_PROJECT_KEY,
      credentials: {
        clientId: this.ENV.CTP_CLIENT_ID,
        clientSecret: this.ENV.CTP_CLIENT_SECRET,
      },
      scopes: [this.ENV.CTP_SCOPES],
      fetch: fetch,
    };
  };

  protected createAuthPasswordMiddlewareOptions = (user: UserAuthOptions): PasswordAuthMiddlewareOptions => {
    return {
      host: this.ENV.CTP_AUTH_URL,
      projectKey: this.ENV.CTP_PROJECT_KEY,
      credentials: {
        clientId: this.ENV.CTP_CLIENT_ID,
        clientSecret: this.ENV.CTP_CLIENT_SECRET,
        user: user,
      },
      tokenCache: this.token,
      scopes: [this.ENV.CTP_SCOPES],
      fetch: fetch,
    };
  };

  protected createAnonymousMiddlewareOptions = (): AnonymousAuthMiddlewareOptions => {
    return {
      host: this.ENV.CTP_AUTH_URL,
      projectKey: this.ENV.CTP_PROJECT_KEY,
      credentials: {
        clientId: this.ENV.CTP_CLIENT_ID,
        clientSecret: this.ENV.CTP_CLIENT_SECRET,
        // anonymousId: process.env.CTP_ANONYMOUS_ID, // a unique id
      },
      tokenCache: this.tokenAnon,
      scopes: [this.ENV.CTP_SCOPES],
      fetch: fetch,
    };
  };

  protected createRefreshTokenMiddlewareOptions = (): RefreshAuthMiddlewareOptions => {
    return {
      host: this.ENV.CTP_AUTH_URL,
      projectKey: this.ENV.CTP_PROJECT_KEY,
      credentials: {
        clientId: this.ENV.CTP_CLIENT_ID,
        clientSecret: this.ENV.CTP_CLIENT_SECRET,
      },
      refreshToken: 'bXvTyxc5yuebdvwTwyXn==',
      tokenCache: this.token,
      fetch: fetch,
    };
  };

  protected createApi = (middleware: Partial<IMiddleware>, log = true) => {
    let client = new ClientBuilder().withHttpMiddleware(this.httpMiddleware);
    client = log ? client.withLoggerMiddleware() : client; // Logging
    client = middleware.auth ? client.withClientCredentialsFlow(middleware.auth) : client;
    client = middleware.password ? client.withPasswordFlow(middleware.password) : client;
    client = middleware.anon ? client.withAnonymousSessionFlow(middleware.anon) : client;
    // TODO add toketn
    return createApiBuilderFromCtpClient(client.build()).withProjectKey({ projectKey: this.ENV.CTP_PROJECT_KEY });
  };

  protected isUserLogged = () => {
    const id = window.localStorage.getItem(LSKeys.id);
    const token = window.localStorage.getItem(LSKeys.token);
    const refreshToken = window.localStorage.getItem(LSKeys.refreshToken) || '';
    if (id && token) {
      this._userData.id = id;
      this._userData.token = token;
      this._userData.isLogged = true;
      this._userData.refreshToken = refreshToken;
    }
  };

  protected set userData(data: IUserData) {
    this._userData = data;
    window.localStorage.setItem(LSKeys.id, this._userData.id);
    window.localStorage.setItem(LSKeys.token, this._userData.token);
    window.localStorage.setItem(LSKeys.refreshToken, this._userData.refreshToken);
  }

  public get userData(): IUserData {
    return this._userData;
  }

  protected static makeFilter = (filter: Partial<IProductFilter>) => {
    const pattern: ISearchPattern = {
      // Add patterns for filtering here:
      categoryId: ({ param }: IFilterPattern): string[] => [`categories.id:"${param}"`],
      searchKeywords: ({ param }: IFilterPattern): string[] => {
        let res: string[] = [];
        if (Array.isArray(param)) {
          res = param.map((val) => `searchKeywords.${SortParams.searchEN}.text:"${val}"`);
        }
        return res;
      },
      price: ({ param }: IFilterPattern): string[] => {
        let from = '*';
        let to = '*';
        if (typeof param === 'object' && !Array.isArray(param)) {
          if (param.from && param.from > 0) from = param.from.toString();
          if (param.to && param.to > 0) to = param.to.toString();
        }
        return [`variants.price.centAmount:range (${from} to ${to})`];
      },
    };
    return Object.entries(filter)
      .reduce<string[][]>((acc, [key, val]) => {
        if (key in pattern) acc.push(pattern[key]({ param: val }));
        return acc;
      }, [])
      .flat();
  };
}

export class MyTokenChache implements TokenCache {
  myChache: TokenStore = {
    token: '',
    refreshToken: '',
    expirationTime: 0,
  };
  get(): TokenStore {
    return this.myChache;
  }
  set(cache: TokenStore): void {
    this.myChache = cache;
  }
}
