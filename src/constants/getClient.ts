import { apiRoot } from './ecommerce-client';

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
