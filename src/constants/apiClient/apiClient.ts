import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { IeCommerceEnv } from '../ecommerce.env';
import { QueryParam } from '@commercetools/sdk-client-v2';
import { CustomerDraft, MyCustomerSetFirstNameAction, MyCustomerSignin, MyCustomerUpdate } from '@commercetools/platform-sdk';
import { HTTPResponseCode } from '../types';
import {
  ICategory,
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
  private authApi: ByProjectKeyRequestBuilder;
  private passwordApi: ByProjectKeyRequestBuilder | null = null; // Can't initialize without password
  private anonApi: ByProjectKeyRequestBuilder;
  private tokenApi: ByProjectKeyRequestBuilder | null = null; // Can't initialize without password
  // Token API
  private _categories: ICategory | null = null;

  constructor(env: IeCommerceEnv) {
    super(env);
    this.authApi = this.createApi({ auth: this.authMiddleware });
    this.anonApi = this.createApi({ anon: this.anonymousMiddleware });

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
    const res = await this.authApi
      .customers()
      .post({
        body: customer,
      })
      .execute();
    return res;
  };

  public loginCustomer = async (email: string, password: string) => {
    this.user = { username: email, password: password };
    this.passwordMiddleware = this.createAuthPasswordMiddlewareOptions(this.user);
    this.passwordApi = this.createApi({ password: this.passwordMiddleware });
    const signIn: MyCustomerSignin = {
      email,
      password,
    };

    const res = await this.passwordApi
      .me()
      .login()
      .post({
        body: signIn,
      })
      .execute();
    if (res.statusCode === HTTPResponseCode.logged) {
      this.userData = {
        isLogged: true,
        id: res.body.customer.id,
        token: this.token.myChache.token,
        refreshToken: this.token.myChache.refreshToken?.split(':')[1] || '',
      };
    }
    return res;
  };

  protected isUserLogged = () => {
    const id = window.localStorage.getItem(LSKeys.id);
    const token = window.localStorage.getItem(LSKeys.token);
    const refreshToken = window.localStorage.getItem(LSKeys.refreshToken) || '';
    if (id && token) {
      this._userData.id = id;
      this._userData.token = token;
      this._userData.isLogged = true;
      this._userData.refreshToken = refreshToken;
      this.tokenApi = this.createApi({ token: this.existingTokenMiddleware, authorization: `Bearer ${this._userData.token}` });
    }
  };

  public logOutCustomer = async () => {
    this.user = { username: '', password: '' };
    this.userData = { isLogged: false, id: '', token: '', refreshToken: '' };
    this.passwordMiddleware = null;
    this.passwordApi = null;
    this.token.myChache.token = '';
    this.token.myChache.expirationTime = 0;
    window.localStorage.removeItem(LSKeys.id);
    window.localStorage.removeItem(LSKeys.token);
    window.localStorage.removeItem(LSKeys.refreshToken);
  };

  public getAvalibleApi = () => {
    // Get avalible api:
    // Password => Token => Anonymus => Error
    let api = null;
    if (this.passwordApi) {
      api = this.passwordApi;
    } else if (this.tokenApi) {
      api = this.tokenApi;
    } else if (this.anonApi) {
      api = this.anonApi;
    }

    if (!api) throw Error('No avalible API');

    return api;
  };

  public getProducts = async (queryArgs: Partial<IProductsQuery> = {}) => {
    const api = this.getAvalibleApi();
    return await api
      .products()
      .get({
        queryArgs,
      })
      .execute();
  };

  public getProduct = async (param: IKey | IId) => {
    const api = this.getAvalibleApi();
    let result: MyProjectKeyRequestBuilder = api.products();
    if ('id' in param) {
      result = result.withId({ ID: param.id });
    } else if ('key' in param) {
      result = result.withKey({ key: param.key });
    }
    return await result.get().execute();
  };

  private getCategories = async () => {
    const api = this.getAvalibleApi();
    const res = await api.categories().get().execute();
    this._categories = res.body.results.reduce<ICategory>((acc, { key, id }) => {
      if (key) acc[key] = id;
      return acc;
    }, {});
  };

  public getProductFiltered = async (queryArgs: Partial<IProductsQuery> = {}, queryFilter: Partial<IProductFilter> = {}) => {
    const api = this.getAvalibleApi();
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
    const api = this.getAvalibleApi();
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
    const api = this.getAvalibleApi();
    return await api.me().get().execute();
  };

  private getCustomerVersion = async () => {
    const customer = await this.getCustomerInfo();
    return customer.body.version;
  };

  public editCustomer = async (customer: Partial<CustomerDraft>) => {
    const api = this.getAvalibleApi();
    const version = await this.getCustomerVersion();

    const changeNameAction: MyCustomerSetFirstNameAction = {
      action: 'setFirstName',
      firstName: 'ROMAN1',
    };

    const customerUpdate: MyCustomerUpdate = {
      version: version,
      actions: [changeNameAction],
    };

    return api
      .me()
      .post({
        body: customerUpdate,
      })
      .execute();
  };
}
