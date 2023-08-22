import { ClientResponse, CustomerCreateEmailToken, CustomerToken, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { AuthMiddlewareOptions, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

// admin scopes
const projectKey = 'PROJ';
const baseHost = '';
const authHost = '';
const clientId = '';
const clientSecret = '';
const scopes = ['manage_project:PROJ'];

const customerId = '';

const token: CustomerCreateEmailToken = {
  id: customerId,
  ttlMinutes: 5,
};

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authHost,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes,
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: baseHost,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendEmailToken(): Promise<ClientResponse<CustomerToken>> {
  const answer = await apiRoot.customers().emailToken().post({ body: token }).execute();
  return answer;
}
