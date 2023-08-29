import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { IeCommerceEnv } from './ecommerce.env';
import {
  AnonymousAuthMiddlewareOptions,
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  QueryParam,
  TokenCache,
  TokenStore,
  UserAuthOptions,
} from '@commercetools/sdk-client-v2';
import { CustomerDraft, MyCustomerSetFirstNameAction, MyCustomerSignin, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { HTTPResponseCode } from './types';
import { ByProjectKeyProductsRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-request-builder';
import { ByProjectKeyProductsByIDRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-by-id-request-builder';
import { ByProjectKeyProductsKeyByKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/products/by-project-key-products-key-by-key-request-builder';

enum LSKeys {
  id = 'customerId',
  token = 'token',
  refreshToken = 'refreshToken',
}

interface IMiddleware {
  auth: AuthMiddlewareOptions;
  password: PasswordAuthMiddlewareOptions;
  anon: AnonymousAuthMiddlewareOptions;
  // token: ExistingTokenMiddlewareOptions;
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
  // Middleware
  private httpMiddleware: HttpMiddlewareOptions;
  protected authMiddleware: AuthMiddlewareOptions;
  protected passwordMiddleware: PasswordAuthMiddlewareOptions | null = null; // Can't initialize without password
  protected anonymousMiddleware: AnonymousAuthMiddlewareOptions;

  constructor(env: IeCommerceEnv) {
    this.ENV = env;
    // Init middleware options
    this.httpMiddleware = this.createHttpMiddlewareOptions();
    this.authMiddleware = this.createAuthMiddlewareOptions();
    this.anonymousMiddleware = this.createAnonymousMiddlewareOptions();
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
      tokenCache: this.token,
      scopes: [this.ENV.CTP_SCOPES],
      fetch: fetch,
    };
  };

  // TODO: Create token middleware

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
}

export default class ApiClient extends ApiBase {
  private authApi: ByProjectKeyRequestBuilder;
  private passwordApi: ByProjectKeyRequestBuilder | null = null; // Can't initialize without password
  private anonApi: ByProjectKeyRequestBuilder;
  // Token API
  private _categories: ICategory[] | null = null;

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
    this.passwordApi = this.createApi({ password: this.passwordMiddleware });
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
    } else if (this.anonApi) {
      api = this.anonApi;
    }

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
    this._categories = res.body.results.reduce<ICategory[]>((acc, { key, id }) => {
      if (key) acc.push({ [key]: id });
      return acc;
    }, []);
  };

  public test = async () => {
    const api = this.getAvalibleApi();
    // return await api.productTypes().get().execute();
    return await api.categories().get().execute();
    // return await api.productTypes().withKey({key: 'shirts'}).get().execute();
    // return await api.productProjections().search().get({
    //   queryArgs: {
    //     // limit: 5,
    //     // offset: 0,
    //     // filter: 'categories.id:"66ce170c-bfbd-4fe0-b0c7-9826d8aba68e"',
    //     filter: 'categories.key:"flowers"',
    //     // markMatchingVariants: true
    //   }
    // }).execute();
  };
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
