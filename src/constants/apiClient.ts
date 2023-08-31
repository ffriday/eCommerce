import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
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
import { CustomerDraft, MyCustomerSignin, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { HTTPResponseCode } from './types';
import { ByProjectKeyProductsRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-request-builder';
import { ByProjectKeyProductsByIDRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-by-id-request-builder';
import { ByProjectKeyProductsKeyByKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-key-by-key-request-builder';

enum LSKeys {
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

interface IMiddleware {
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

interface IFilterPattern {
  param: string | string[] | boolean | IPriceFilter;
}

interface ISearchPattern {
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

abstract class ApiBase {
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

export default class ApiClient extends ApiBase {
  private authApi: ByProjectKeyRequestBuilder;
  private passwordApi: ByProjectKeyRequestBuilder | null = null; // Can't initialize without password
  private anonApi: ByProjectKeyRequestBuilder;
  // Token API
  private _categories: ICategory | null = null;

  constructor(env: IeCommerceEnv) {
    super(env);
    this.authApi = this.createApi({ auth: this.authMiddleware });
    this.anonApi = this.createApi({ anon: this.anonymousMiddleware });

    this.getCategories();
  }

  get categories() {
    if (this._categories) {
      return this._categories;
    } else {
      throw new Error('Categories not found');
    }
  }

  public registerCusomer = async (customer: CustomerDraft) => {
    const res = await this.authApi
      .customers()
      .post({
        body: customer,
      })
      .execute();
    return res;
  };

  public loginCustomer = async (email: string, password: string) => {
    this.user = { username: email, password: password };
    this.passwordMiddleware = this.createAuthPasswordMiddlewareOptions(this.user);
    console.log('1', this.token);
    this.passwordApi = this.createApi({ password: this.passwordMiddleware });
    console.log('2', this.token);
    const signIn: MyCustomerSignin = {
      email,
      password,
    };

    const res = await this.passwordApi
      .me()
      .login()
      .post({
        body: signIn,
      })
      .execute();
    if (res.statusCode === HTTPResponseCode.logged) {
      this.userData = {
        isLogged: true,
        id: res.body.customer.id,
        token: this.token.myChache.token,
        refreshToken: this.token.myChache.refreshToken || '',
      };
    }
    return res;
  };

  public logOutCustomer = async () => {
    this.user = { username: '', password: '' };
    this.userData = { isLogged: false, id: '', token: '', refreshToken: '' };
    this.passwordMiddleware = null;
    this.passwordApi = null;
    this.token.myChache.token = '';
    this.token.myChache.expirationTime = 0;
    window.localStorage.removeItem(LSKeys.id);
    window.localStorage.removeItem(LSKeys.token);
    window.localStorage.removeItem(LSKeys.refreshToken);
  };

  private getAvalibleApi = () => {
    // Get avalible api:
    // Password => Token => Anonymus => Error
    let api = null;
    if (this.passwordApi) {
      api = this.passwordApi;
      console.log('password');
    } else if (this.anonApi) {
      api = this.anonApi;
      console.log('anon');
    }
    console.log('PSSWD', this.passwordApi);

    if (!api) throw Error('No avalible API');

    return api;
  };

  public getProducts = async (queryArgs: Partial<IProductsQuery> = {}) => {
    const api = this.getAvalibleApi();
    return await api
      .products()
      .get({
        queryArgs,
      })
      .execute();
  };

  public getProduct = async (param: IKey | IId) => {
    const api = this.getAvalibleApi();
    let result: MyProjectKeyRequestBuilder = api.products();
    if ('id' in param) {
      result = result.withId({ ID: param.id });
    } else if ('key' in param) {
      result = result.withKey({ key: param.key });
    }
    return await result.get().execute();
  };

  private getCategories = async () => {
    const api = this.getAvalibleApi();
    const res = await api.categories().get().execute();
    this._categories = res.body.results.reduce<ICategory>((acc, { key, id }) => {
      if (key) acc[key] = id;
      return acc;
    }, {});
  };

  public getProductFiltered = async (queryArgs: Partial<IProductsQuery> = {}, queryFilter: Partial<IProductFilter> = {}) => {
    const api = this.getAvalibleApi();
    const filter = ApiClient.makeFilter(queryFilter);
    const lang = queryFilter.lang || SortParams.sortEN;
    const sort: string[] = [];
    const dicsount: { [key: string]: QueryParam } = {};
    if (queryFilter.discount !== undefined) dicsount['variants.scopedPriceDiscounted'] = queryFilter.discount;
    if (queryFilter.sortName) sort.push(`name.${lang} ${queryFilter.sortName}`);
    if (queryFilter.sortPrice) sort.push(`price ${queryFilter.sortPrice}`);
    return await api
      .productProjections()
      .search()
      .get({
        queryArgs: {
          ...dicsount,
          limit: queryArgs.limit,
          offset: queryArgs.offset,
          filter: filter,
          sort: sort,
          // markMatchingVariants: true,
        },
      })
      .execute();
  };

  public getProductSearch = async (queryArgs: Partial<IProductsQuery> = {}, querySearch: Partial<IProductSearch> = {}) => {
    const api = this.getAvalibleApi();
    const lang = querySearch.lang || SortParams.searchEN;
    const searchKey = `searchKeywords.${lang}`;
    querySearch.keyword = querySearch.keyword || '';
    const res = await api
      .productProjections()
      .suggest()
      .get({
        queryArgs: {
          [searchKey]: [querySearch.keyword],
          fuzzy: true,
          limit: queryArgs.limit,
          offset: queryArgs.offset,
        },
      })
      .execute();
    let keywords: string[] = [];
    if (res.body && res.body[`searchKeywords.${lang}`]) keywords = res.body[`searchKeywords.${lang}`].map((val) => val.text);
    return keywords;
  };

  // public getProductSearchT = async (queryArgs: Partial<IProductsQuery> = {}, querySearch: Partial<IProductSearch> = {}) => {
  //   const api = this.getAvalibleApi();
  //   const lang = querySearch.lang || SortParams.searchEN;
  //   const searchKey = `text.${lang}`;
  //   querySearch.keyword = querySearch.keyword || '';
  //   return await api
  //     .productProjections()
  //     .search()
  //     .get({
  //       queryArgs: {
  //         [searchKey]: [querySearch.keyword],
  //         fuzzy: true,
  //         limit: queryArgs.limit,
  //         offset: queryArgs.offset,
  //       },
  //     })
  //     .execute();
  // };
}

class MyTokenChache implements TokenCache {
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
