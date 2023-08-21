import SdkAuth from '@commercetools/sdk-auth';
import fetch from 'node-fetch';
import { apiRoot } from './ecommerce-client';
import { eCommerceEnv as ENV } from './ecommerce.env';

const authClient = new SdkAuth({
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: ENV.CTP_PROJECT_KEY,
  disableRefreshToken: false,
  credentials: {
    clientId: ENV.CTP_CLIENT_ID,
    clientSecret: ENV.CTP_CLIENT_SECRET,
  },
  scopes: ENV.CTP_SCOPES,
  fetch,
});

export const getCustomerToken = async (email: string, password: string) => {
  return await authClient.customerPasswordFlow(
    {
      username: email,
      password: password,
    },
    {
      disableRefreshToken: false,
    },
  );
};

export const checkUserExist = (customerEmail: string) => {
  return apiRoot
    .customers()
    .get({
      queryArgs: {
        where: `email="${customerEmail}"`,
      },
    })
    .execute();
};
