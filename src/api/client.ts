import { getClient } from './BuildClient';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

// Create apiRoot from the imported ClientBuilder and include your Project key

// Example call to return Project information
// This code has the same effect as sending a GET request to the commercetools Composable Commerce API without any endpoints.

export const getProject = async (email: string, password: string) => {
  try {
    const apiRoot = createApiBuilderFromCtpClient(getClient(email, password)).withProjectKey({ projectKey: 'ecommerce-finaltask' });

    apiRoot
      .get()
      .execute()
      .then((x) => {
        return x;
      });
  } catch (error) {
    return error;
  }
};
// Retrieve Project information and output the result to the log
