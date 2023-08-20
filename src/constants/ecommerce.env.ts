export interface IeCommerceEnv {
  CTP_PROJECT_KEY: string;
  CTP_CLIENT_SECRET: string;
  CTP_CLIENT_ID: string;
  CTP_AUTH_URL: string;
  CTP_API_URL: string;
  CTP_SCOPES: string;
}

export const eCommerceEnv: IeCommerceEnv = {
  CTP_PROJECT_KEY: 'ecommerce-finaltask',
  CTP_CLIENT_SECRET: '1o0NUqz7udbH9z0JonsglScks49B1GiG',
  CTP_CLIENT_ID: '5Sat6yVrcoZRuyCZBPlBC-nd',
  CTP_AUTH_URL: 'https://auth.europe-west1.gcp.commercetools.com',
  CTP_API_URL: 'https://api.europe-west1.gcp.commercetools.com',
  CTP_SCOPES: 'manage_project:ecommerce-finaltask',
};
