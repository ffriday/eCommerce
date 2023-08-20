import SdkAuth from '@commercetools/sdk-auth';
import fetch from 'node-fetch';

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

export const getProject = async (email: string, password: string) => {
  // try {
  const response = await authClient.customerPasswordFlow(
    {
      username: email,
      password: password,
    },
    {
      disableRefreshToken: false,
    },
  );

  return response;
  // } catch (error) {
  //   // Выбрасываем ошибку дальше
  //   throw error;
  // }
};
// Retrieve Project information and output the result to the log
