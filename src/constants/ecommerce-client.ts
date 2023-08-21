// import fetch from 'node-fetch';
import { eCommerceEnv as ENV } from './ecommerce.env';
import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';

const projectKey = ENV.CTP_PROJECT_KEY;
const scopes = [ENV.CTP_SCOPES];

// Configure authMiddlewareOptions
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

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: ENV.CTP_API_URL,
  fetch: fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

// import { ctpClient } from './BuildClient';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

// Create apiRoot from the imported ClientBuilder and include your Project key
export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: ENV.CTP_PROJECT_KEY });