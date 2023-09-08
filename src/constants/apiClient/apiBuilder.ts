import { IeCommerceEnv } from './../ecommerce.env';
import {
  AnonymousAuthMiddlewareOptions,
  AuthMiddlewareOptions,
  ClientBuilder,
  ExistingTokenMiddlewareOptions,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
  UserAuthOptions,
} from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { IMiddleware, IUserData, LSKeys } from './apiClientTypes';
import MyTokenChache from './myTokenChache';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

export default class Api {
  private ENV: IeCommerceEnv;
  public authApi: ByProjectKeyRequestBuilder;
  public passwordApi: ByProjectKeyRequestBuilder | null = null; // Can't initialize without password
  public anonApi: ByProjectKeyRequestBuilder;
  public tokenApi: ByProjectKeyRequestBuilder | null = null; // Can't initialize without password

  protected _userData: IUserData = {
    isLogged: false,
    id: '',
    token: '',
    refreshToken: '',
  };

  public token: MyTokenChache = new MyTokenChache(); // Epmty token object for registred
  public tokenAnon: MyTokenChache = new MyTokenChache(); // Epmty token object for anonymus
  // Middleware
  private httpMiddleware: HttpMiddlewareOptions;
  public authMiddleware: AuthMiddlewareOptions;
  public passwordMiddleware: PasswordAuthMiddlewareOptions | null = null; // Can't initialize without password
  public anonymousMiddleware: AnonymousAuthMiddlewareOptions;
  public refreshTokenMiddleware: RefreshAuthMiddlewareOptions;
  public existingTokenMiddleware: ExistingTokenMiddlewareOptions;

  constructor(env: IeCommerceEnv) {
    this.ENV = env;
    // Init middleware options
    this.httpMiddleware = this.createHttpMiddlewareOptions();
    this.authMiddleware = this.createAuthMiddlewareOptions();
    this.anonymousMiddleware = this.createAnonymousMiddlewareOptions();
    this.refreshTokenMiddleware = this.createRefreshTokenMiddlewareOptions();
    this.existingTokenMiddleware = this.createExistingTokenMiddlewareOptions();
    // Init API
    this.authApi = this.createApi({ auth: this.authMiddleware });
    this.anonApi = this.createApi({ anon: this.anonymousMiddleware });
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

  public createAuthPasswordMiddlewareOptions = (user: UserAuthOptions): PasswordAuthMiddlewareOptions => {
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

  public createAnonymousMiddlewareOptions = (): AnonymousAuthMiddlewareOptions => {
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

  public createRefreshTokenMiddlewareOptions = (): RefreshAuthMiddlewareOptions => {
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

  public createExistingTokenMiddlewareOptions = (): ExistingTokenMiddlewareOptions => {
    return {
      force: true,
    };
  };

  public createApi = (middleware: Partial<IMiddleware>, log = true) => {
    let client = new ClientBuilder().withHttpMiddleware(this.httpMiddleware);
    client = log ? client.withLoggerMiddleware() : client; // Logging
    client = middleware.auth ? client.withClientCredentialsFlow(middleware.auth) : client;
    client = middleware.password ? client.withPasswordFlow(middleware.password) : client;
    client = middleware.anon ? client.withAnonymousSessionFlow(middleware.anon) : client;
    client = middleware.token && middleware.authorization ? client.withExistingTokenFlow(middleware.authorization, middleware.token) : client;
    return createApiBuilderFromCtpClient(client.build()).withProjectKey({ projectKey: this.ENV.CTP_PROJECT_KEY });
  };

  public set userData(data: IUserData) {
    this._userData = data;
    window.localStorage.setItem(LSKeys.id, this._userData.id);
    window.localStorage.setItem(LSKeys.token, this._userData.token);
    window.localStorage.setItem(LSKeys.refreshToken, this._userData.refreshToken);
  }

  public get userData(): IUserData {
    return this._userData;
  }

  public getAvalibleApi = () => {
    // Get avalible api:
    // Password => Token => Anonymus => Error
    let api = null;
    if (this.passwordApi) {
      api = this.passwordApi;
    } else if (this.tokenApi) {
      api = this.tokenApi;
    } else if (this.anonApi) {
      api = this.anonApi;
    }

    if (!api) throw Error('No avalible API');

    return api;
  };
}
