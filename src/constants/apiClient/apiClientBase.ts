import { IeCommerceEnv } from './../ecommerce.env';
import {
  AnonymousAuthMiddlewareOptions,
  AuthMiddlewareOptions,
  ClientBuilder,
  ExistingTokenMiddlewareOptions,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
  TokenCache,
  TokenStore,
  UserAuthOptions,
} from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { IFilterPattern, IMiddleware, IProductFilter, ISearchPattern, IUserData, LSKeys, SortParams } from './apiClientTypes';

export abstract class ApiBase {
  private ENV: IeCommerceEnv;
  protected user: UserAuthOptions | null = null;
  protected _userData: IUserData = {
    isLogged: false,
    id: '',
    token: '',
    refreshToken: '',
  };
  protected token: MyTokenChache = new MyTokenChache(); // Epmty token object for registred
  protected tokenAnon: MyTokenChache = new MyTokenChache(); // Epmty token object for anonymus
  // Middleware
  private httpMiddleware: HttpMiddlewareOptions;
  protected authMiddleware: AuthMiddlewareOptions;
  protected passwordMiddleware: PasswordAuthMiddlewareOptions | null = null; // Can't initialize without password
  protected anonymousMiddleware: AnonymousAuthMiddlewareOptions;
  protected refreshTokenMiddleware: RefreshAuthMiddlewareOptions;
  protected existingTokenMiddleware: ExistingTokenMiddlewareOptions;

  constructor(env: IeCommerceEnv) {
    this.ENV = env;
    // Init middleware options
    this.httpMiddleware = this.createHttpMiddlewareOptions();
    this.authMiddleware = this.createAuthMiddlewareOptions();
    this.anonymousMiddleware = this.createAnonymousMiddlewareOptions();
    this.refreshTokenMiddleware = this.createRefreshTokenMiddlewareOptions();
    this.existingTokenMiddleware = this.createExistingTokenMiddlewareOptions();
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
      refreshToken: this._userData.refreshToken,
      tokenCache: this.token,
      fetch: fetch,
    };
  };

  protected createExistingTokenMiddlewareOptions = (): ExistingTokenMiddlewareOptions => {
    return {
      force: true,
    };
  };

  protected createApi = (middleware: Partial<IMiddleware>, log = true) => {
    let client = new ClientBuilder().withHttpMiddleware(this.httpMiddleware);
    client = log ? client.withLoggerMiddleware() : client; // Logging
    client = middleware.auth ? client.withClientCredentialsFlow(middleware.auth) : client;
    client = middleware.password ? client.withPasswordFlow(middleware.password) : client;
    client = middleware.anon ? client.withAnonymousSessionFlow(middleware.anon) : client;
    console.log(middleware.authorization, middleware.token);
    client = middleware.token && middleware.authorization ? client.withExistingTokenFlow(middleware.authorization, middleware.token) : client;
    return createApiBuilderFromCtpClient(client.build()).withProjectKey({ projectKey: this.ENV.CTP_PROJECT_KEY });
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
          res = param.map((val) => `searchKeywords.${filter.searchLanguage || SortParams.searchEN}.text:"${val}"`);
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

  // protected static createChangeActions = () => {

  // }
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
