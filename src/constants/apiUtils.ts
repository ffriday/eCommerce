import { MyCustomerChangePassword, MyCustomerSetFirstNameAction, MyCustomerUpdate, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
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
  AuthMiddlewareOptions,
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

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: ENV.CTP_API_URL,
  fetch: fetch,
};

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

  const ctpClient = new ClientBuilder()
    .withPasswordFlow(authPasswordMiddlewareOptions)
    // .withClientCredentialsFlow(authPasswordMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware() // Include middleware for logging
    .build();

  // Create api from the imported ClientBuilder and include your Project key
  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: ENV.CTP_PROJECT_KEY });
};

export const createTokenFlowApi = (token: string) => {
  type ExistingTokenMiddlewareOptions = {
    force?: boolean;
  };

  const authorization = `Bearer ${token}`;
  const options: ExistingTokenMiddlewareOptions = {
    force: true,
  };

  const projectKey = ENV.CTP_PROJECT_KEY;
  const scopes = [ENV.CTP_SCOPES];

  const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: ENV.CTP_AUTH_URL,
    projectKey: projectKey,
    credentials: {
      clientId: ENV.CTP_CLIENT_ID,
      clientSecret: ENV.CTP_CLIENT_SECRET,
    },
    scopes,
    fetch: fetch,
  };

  const ctpClient = new ClientBuilder()
    .withExistingTokenFlow(authorization, options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware() // Include middleware for logging
    .build();

  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: ENV.CTP_PROJECT_KEY });
};

// Functions

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

export const changeCustomer = (api: ByProjectKeyRequestBuilder, token: string) => {
  const changeNameAction: MyCustomerSetFirstNameAction = {
    action: 'setFirstName',
    firstName: 'TESTNAME22345',
  };

  const customerUpdate: MyCustomerUpdate = {
    version: 28,
    actions: [changeNameAction],
  };

  return (
    api
      // .customers()
      // .withId({ID: '135dd938-5c22-4322-9a21-c6a4c65a7555'})
      .me()
      .post({
        // headers: {
        //   'Authorization': `Bearer ${token}`,
        //   'Content-Type': 'application/json',
        // },
        body: customerUpdate,
      })
      .execute()
  );
};

// TODO: Remove this module after adding methods to apiClient
