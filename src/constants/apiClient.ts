import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { IeCommerceEnv } from './ecommerce.env';
import {
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  TokenCache,
  TokenStore,
  UserAuthOptions,
} from '@commercetools/sdk-client-v2';
import { CustomerDraft, MyCustomerSignin, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { HTTPResponseCode } from './types';

enum LSKeys {
  id = 'customerId',
  token = 'token',
}

interface IMiddleware {
  auth: AuthMiddlewareOptions;
  password: PasswordAuthMiddlewareOptions;
  // token: ExistingTokenMiddlewareOptions;
  // anon: AnonymousAuthMiddlewareOptions;
}

interface IUserData {
  isLogged: boolean;
  id: string;
  token: string;
}

abstract class ApiBase {
  private ENV: IeCommerceEnv;
  protected user: UserAuthOptions | null = null;
  private _userData: IUserData = {
    isLogged: false,
    id: '',
    token: '',
  };
  protected token: MyTokenChache = new MyTokenChache(); // Epmty token object
  // Middleware
  private httpMiddleware: HttpMiddlewareOptions;
  protected authMiddleware: AuthMiddlewareOptions;
  protected passwordMiddleware: PasswordAuthMiddlewareOptions | null = null; // Can't initialize without password

  constructor(env: IeCommerceEnv) {
    this.ENV = env;
    // Init middleware options
    this.httpMiddleware = this.createHttpMiddlewareOptions();
    this.authMiddleware = this.createAuthMiddlewareOptions();
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

  // TODO: Create anonymus middleware

  // TODO: Create token middleware

  protected createApi = (middleware: Partial<IMiddleware>, log = true) => {
    let client = new ClientBuilder().withHttpMiddleware(this.httpMiddleware);
    client = log ? client.withLoggerMiddleware() : client; // Logging
    client = middleware.auth ? client.withClientCredentialsFlow(middleware.auth) : client;
    client = middleware.password ? client.withPasswordFlow(middleware.password) : client;
    // TODO add toketn
    // TODO add anonymus
    return createApiBuilderFromCtpClient(client.build()).withProjectKey({ projectKey: this.ENV.CTP_PROJECT_KEY });
  };

  protected isUserLogged = () => {
    const id = window.localStorage.getItem(LSKeys.id);
    const token = window.localStorage.getItem(LSKeys.token);
    if (id && token) {
      this._userData.id = id;
      this._userData.token = token;
      this._userData.isLogged = true;
    }
  };

  protected set userData(data: IUserData) {
    this._userData = data;
    window.localStorage.setItem(LSKeys.id, this._userData.id);
    window.localStorage.setItem(LSKeys.token, this._userData.token);
  }

  public get userData(): IUserData {
    return this._userData;
  }
}

export default class ApiClient extends ApiBase {
  private authApi: ByProjectKeyRequestBuilder;
  private passwordApi: ByProjectKeyRequestBuilder | null = null; // Can't initialize without password

  constructor(env: IeCommerceEnv) {
    super(env);
    this.authApi = this.createApi({ auth: this.authMiddleware });
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
      this.userData = { isLogged: true, id: res.body.customer.id, token: this.token.myChache.token };
    }
    return res;
  };

  public logOutCustomer = async () => {
    this.user = { username: '', password: '' };
    this.userData = { isLogged: false, id: '', token: '' };
    this.passwordMiddleware = null;
    this.passwordApi = null;
    this.token.myChache.token = '';
    this.token.myChache.expirationTime = 0;
    window.localStorage.removeItem(LSKeys.id);
    window.localStorage.removeItem(LSKeys.token);
  };
}

class MyTokenChache implements TokenCache {
  myChache: TokenStore = {
    token: '',
    expirationTime: 0,
  };
  get(): TokenStore {
    return this.myChache;
  }
  set(cache: TokenStore): void {
    this.myChache = cache;
  }
}