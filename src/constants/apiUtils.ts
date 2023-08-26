import { CustomerSignInResult, MyCustomerChangePassword } from '@commercetools/platform-sdk';
import { CustomerSignin, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { eCommerceEnv as ENV } from './ecommerce.env';
import {
  ClientBuilder,
  UserAuthOptions,
  type HttpMiddlewareOptions,
  type PasswordAuthMiddlewareOptions,
  TokenCache,
  TokenCacheOptions,
  TokenStore,
  ClientResponse, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

export class MyTokenChache implements TokenCache {
  myChache: TokenStore = {
    token: '',
    expirationTime: 0,
  };

  get(tokenCacheOptions?: TokenCacheOptions | undefined): TokenStore {
    return this.myChache;
  }

  set(cache: TokenStore, tokenCacheOptions?: TokenCacheOptions | undefined): void {
    this.myChache = cache;
  }
}

export const createPasswordFlowApi = (email: string, password: string, token: TokenCache) => {
  const projectKey = ENV.CTP_PROJECT_KEY;
  const scopes = [ENV.CTP_SCOPES];
  const user: UserAuthOptions = {
    username: email,
    password,
  };

  const authPasswordMiddlewareOptions: PasswordAuthMiddlewareOptions = {
    host: ENV.CTP_AUTH_URL,
    projectKey: projectKey,
    credentials: {
      clientId: ENV.CTP_CLIENT_ID,
      clientSecret: ENV.CTP_CLIENT_SECRET,
      user: user,
    },
    tokenCache: token,
    scopes,
    fetch: fetch,
  };

  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: ENV.CTP_API_URL,
    fetch: fetch,
  };

  const ctpClient = new ClientBuilder()
    .withClientCredentialsFlow(authPasswordMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware() // Include middleware for logging
    .build();

  // Create api from the imported ClientBuilder and include your Project key
  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: ENV.CTP_PROJECT_KEY });
};

// Functions
export const customerLogin = async (api: ByProjectKeyRequestBuilder, email: string, password: string) => {
  const signIn: CustomerSignin = {
    email,
    password,
  };

  return api
    .me()
    .login()
    .post({
      body: signIn,
    })
    .execute();
};

export const loginWithToken = async (email: string, password: string) => {
  const token = new MyTokenChache(); // Token containing object
  const api = createPasswordFlowApi(email, password, token);
  const customer = await customerLogin(api, email, password);
  return { customer, token };
};

export const changePassword = (api: ByProjectKeyRequestBuilder, oldPassword: string, newPassword: string) => {
  const changePasswordData: MyCustomerChangePassword = {
    version: 0,
    currentPassword: oldPassword,
    newPassword: newPassword,
  };

  return api
    .me()
    .password()
    .post({
      body: changePasswordData,
    })
    .execute();
};
