import fetch from 'node-fetch';
import { ClientBuilder, type PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
export const getClient = (email: string, password: string) => {
  // Configure authMiddlewareOptions
  const options: PasswordAuthMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: 'ecommerce-finaltask',
    credentials: {
      clientId: 'bRoBJdUqxXuTazPFW-UUIWLj',
      clientSecret: 'ZxReyqnt_kFkVK7H17IP568_TgWAlhLw',
      user: {
        username: email,
        password: password,
      },
    },

    scopes: ['manage_project:ecommerce-finaltask'],
    fetch,
  };

  // Export the ClientBuilder
  const ctpClient = new ClientBuilder().withPasswordFlow(options).build();
  return ctpClient;
};
