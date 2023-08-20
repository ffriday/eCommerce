import { ctpClient } from './BuildClient';
import { ApiRoot, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: 'ecommerce-finaltask' });

// Example call to return Project information
// This code has the same effect as sending a GET request to the commercetools Composable Commerce API without any endpoints.

// Retrieve Project information and output the result to the log
export const test = (customerEmail: string) => {
  return apiRoot
    .customers()
    .get({
      queryArgs: {
        where: `email="${customerEmail}"`,
      },
    })
    .execute();
};
