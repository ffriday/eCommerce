import SdkAuth from '@commercetools/sdk-auth';
import fetch from 'node-fetch';
import { apiRoot } from './getClient';

const authClient = new SdkAuth({
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: 'ecommerce-finaltask',
  disableRefreshToken: false,
  credentials: {
    clientId: '5Sat6yVrcoZRuyCZBPlBC-nd',
    clientSecret: '1o0NUqz7udbH9z0JonsglScks49B1GiG',
  },
  scopes: ['manage_project:ecommerce-finaltask'],
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
