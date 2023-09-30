export interface IeCommerceEnv {
  CTP_PROJECT_KEY: string;
  CTP_CLIENT_SECRET: string;
  CTP_CLIENT_ID: string;
  CTP_AUTH_URL: string;
  CTP_API_URL: string;
  CTP_SCOPES: string;
}

export const eCommerceEnv: IeCommerceEnv = {
  CTP_PROJECT_KEY: 'bugbusters',
  CTP_CLIENT_SECRET: '2VPI-ncmimrZ9Xr-eY5OUf9Z5E-oWSUo',
  CTP_CLIENT_ID: 'HLPfCeH7ERnXcu4Hyhsm6P4g',
  CTP_AUTH_URL: 'https://auth.europe-west1.gcp.commercetools.com',
  CTP_API_URL: 'https://api.europe-west1.gcp.commercetools.com',
  CTP_SCOPES: 'manage_project:bugbusters',
};
