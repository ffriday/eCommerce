import { IeCommerceEnv } from '../ecommerce.env';
import { QueryParam } from '@commercetools/sdk-client-v2';
import {
  CustomerDraft,
  MyCustomerSetFirstNameAction,
  MyCustomerSignin,
  MyCustomerUpdate,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { HTTPResponseCode } from '../types';
import {
  ICategory,
  IChangeCustomer,
  IId,
  IKey,
  IProductFilter,
  IProductSearch,
  IProductsQuery,
  LSKeys,
  MyProjectKeyRequestBuilder,
  SortParams,
} from './apiClientTypes';
import { ApiBase } from './apiClientBase';

export default class ApiClient extends ApiBase {
  private _categories: ICategory | null = null;

  constructor(env: IeCommerceEnv) {
    super(env);

    this.isUserLogged(); // Check if user has id and token in LocalStorage and load it touserData
    this.getCategories();
  }

  get categories() {
    if (this._categories) {
      return this._categories;
    } else {
      throw new Error('Categories not found'); // change to empty value
    }
  }

  public registerCusomer = async (customer: CustomerDraft) => {
    const res = await this.api.authApi
      .customers()
      .post({
        body: customer,
      })
      .execute();
    return res;
  };

  public loginCustomer = async (email: string, password: string) => {
    this.user = { username: email, password: password };
    this.api.passwordMiddleware = this.api.createAuthPasswordMiddlewareOptions(this.user);
    this.api.passwordApi = this.api.createApi({ password: this.api.passwordMiddleware });
    const signIn: MyCustomerSignin = {
      email,
      password,
    };

    const res = await this.api.passwordApi
      .me()
      .login()
      .post({
        body: signIn,
      })
      .execute();
    if (res.statusCode === HTTPResponseCode.logged) {
      this.api.userData = {
        isLogged: true,
        id: res.body.customer.id,
        token: this.api.token.myChache.token,
        refreshToken: this.api.token.myChache.refreshToken?.split(':')[1] || '',
      };
    }
    return res;
  };

  protected isUserLogged = () => {
    const id = window.localStorage.getItem(LSKeys.id);
    const token = window.localStorage.getItem(LSKeys.token);
    const refreshToken = window.localStorage.getItem(LSKeys.refreshToken) || '';
    if (id && token) {
      this.api.userData.id = id;
      this.api.userData.token = token;
      this.api.userData.isLogged = true;
      this.api.userData.refreshToken = refreshToken;
      this.api.tokenApi = this.api.createApi({ token: this.api.existingTokenMiddleware, authorization: `Bearer ${this.api.userData.token}` });
    }
  };

  public logOutCustomer = async () => {
    this.user = { username: '', password: '' };
    this.api.userData = { isLogged: false, id: '', token: '', refreshToken: '' };
    this.api.passwordMiddleware = null;
    this.api.passwordApi = null;
    this.api.token.myChache.token = '';
    this.api.token.myChache.expirationTime = 0;
    window.localStorage.removeItem(LSKeys.id);
    window.localStorage.removeItem(LSKeys.token);
    window.localStorage.removeItem(LSKeys.refreshToken);
  };

  public getProducts = async (queryArgs: Partial<IProductsQuery> = {}) => {
    const api = this.api.getAvalibleApi();
    return await api
      .products()
      .get({
        queryArgs,
      })
      .execute();
  };

  public getProduct = async (param: IKey | IId) => {
    const api = this.api.getAvalibleApi();
    let result: MyProjectKeyRequestBuilder = api.products();
    if ('id' in param) {
      result = result.withId({ ID: param.id });
    } else if ('key' in param) {
      result = result.withKey({ key: param.key });
    }
    return await result.get().execute();
  };

  private getCategories = async () => {
    const api = this.api.getAvalibleApi();
    const res = await api.categories().get().execute();
    this._categories = res.body.results.reduce<ICategory>((acc, { key, id }) => {
      if (key) acc[key] = id;
      return acc;
    }, {});
  };

  public getProductFiltered = async (queryArgs: Partial<IProductsQuery> = {}, queryFilter: Partial<IProductFilter> = {}) => {
    const api = this.api.getAvalibleApi();
    const filter = ApiClient.makeFilter(queryFilter);
    const lang = queryFilter.lang || SortParams.sortEN;
    const sort: string[] = [];
    const dicsount: { [key: string]: QueryParam } = {};
    if (queryFilter.discount !== undefined) dicsount['variants.scopedPriceDiscounted'] = queryFilter.discount;
    if (queryFilter.sortName) sort.push(`name.${lang} ${queryFilter.sortName}`);
    if (queryFilter.sortPrice) sort.push(`price ${queryFilter.sortPrice}`);
    return await api
      .productProjections()
      .search()
      .get({
        queryArgs: {
          ...dicsount,
          limit: queryArgs.limit,
          offset: queryArgs.offset,
          filter: filter,
          sort: sort,
          // markMatchingVariants: true,
        },
      })
      .execute();
  };

  public getProductSearch = async (queryArgs: Partial<IProductsQuery> = {}, querySearch: Partial<IProductSearch> = {}) => {
    const api = this.api.getAvalibleApi();
    const lang = querySearch.lang || SortParams.searchEN;
    const searchKey = `searchKeywords.${lang}`;
    querySearch.keyword = querySearch.keyword || '';
    const res = await api
      .productProjections()
      .suggest()
      .get({
        queryArgs: {
          [searchKey]: [querySearch.keyword],
          fuzzy: true,
          limit: queryArgs.limit,
          offset: queryArgs.offset,
        },
      })
      .execute();
    let keywords: string[] = [];
    if (res.body && res.body[`searchKeywords.${lang}`]) keywords = res.body[`searchKeywords.${lang}`].map((val) => val.text);
    return keywords;
  };

  public getCustomerInfo = async () => {
    const api = this.api.getAvalibleApi();
    return await api.me().get().execute();
  };

  private getCustomerVersion = async () => {
    const customer = await this.getCustomerInfo();
    return customer.body.version;
  };

  public editCustomer = async ({ name, surename, email, birthDate }: Partial<IChangeCustomer>) => {
    const api = this.api.getAvalibleApi();
    const version = await this.getCustomerVersion();
    const actions: MyCustomerUpdateAction[] = [];

    if (name) actions.push({ action: 'setFirstName', firstName: name });
    if (surename) actions.push({ action: 'setLastName', lastName: surename });
    if (email) actions.push({ action: 'changeEmail', email: email });
    if (birthDate) actions.push({ action: 'setDateOfBirth', dateOfBirth: birthDate });

    const customerUpdate: MyCustomerUpdate = {
      version: version,
      actions: actions,
    };

    return api
      .me()
      .post({
        body: customerUpdate,
      })
      .execute();
  };
}
