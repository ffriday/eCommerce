import { IeCommerceEnv } from '../ecommerce.env';
import { QueryParam } from '@commercetools/sdk-client-v2';
import {
  BaseAddress,
  Cart,
  ClientResponse,
  CustomerDraft,
  MyCartAddDiscountCodeAction,
  MyCartAddLineItemAction,
  MyCartRecalculateAction,
  MyCartRemoveDiscountCodeAction,
  MyCartRemoveLineItemAction,
  MyCartUpdateAction,
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
      activeCartSignInMode: 'MergeWithExistingCustomerCart',
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
      try {
        this.api.tokenApi = this.api.createApi({ token: this.api.existingTokenMiddleware, authorization: `Bearer ${this.api.userData.token}` });
      } catch (error) {
        this.logOutCustomer();
      }
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
    const priceCurrency: { [key: string]: QueryParam } = {};
    if (queryFilter.discount !== undefined) {
      filter.push(`variants.scopedPriceDiscounted:${queryFilter.discount}`);
      priceCurrency['priceCurrency'] = queryFilter.currency;
    }
    if (queryFilter.sortName) sort.push(`name.${lang} ${queryFilter.sortName}`);
    if (queryFilter.sortPrice) sort.push(`price ${queryFilter.sortPrice}`);
    return await api
      .productProjections()
      .search()
      .get({
        queryArgs: {
          ...priceCurrency,
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

  public getCustomerAddresses = async () => {
    const customer = await this.getCustomerInfo();
    return customer.body.addresses;
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

  public changePassword = async (oldPassword: string, newPassword: string) => {
    const api = this.api.getAvalibleApi();
    const version = await this.getCustomerVersion();

    return api
      .me()
      .password()
      .post({
        body: {
          version: version,
          currentPassword: oldPassword,
          newPassword: newPassword,
        },
      })
      .execute();
  };

  public addAddress = async (address: BaseAddress) => {
    const api = this.api.getAvalibleApi();
    const version = await this.getCustomerVersion();

    const action: MyCustomerUpdateAction = { action: 'addAddress', address: address };

    const customerUpdate: MyCustomerUpdate = {
      version: version,
      actions: [action],
    };

    return api
      .me()
      .post({
        body: customerUpdate,
      })
      .execute();
  };

  public changeAddress = async (address: BaseAddress, addressId: string) => {
    const api = this.api.getAvalibleApi();
    const version = await this.getCustomerVersion();

    const action: MyCustomerUpdateAction = { action: 'changeAddress', address: address, addressId: addressId };

    const customerUpdate: MyCustomerUpdate = {
      version: version,
      actions: [action],
    };

    return api
      .me()
      .post({
        body: customerUpdate,
      })
      .execute();
  };

  public changeAddressParams = async (
    addressId: string,
    shipment?: boolean,
    billing?: boolean,
    defaultShipment?: boolean,
    defaultBilling?: boolean,
  ) => {
    const api = this.api.getAvalibleApi();
    const version = await this.getCustomerVersion();
    const actions: MyCustomerUpdateAction[] = [];

    if (defaultShipment) actions.push({ action: 'setDefaultShippingAddress', addressId: addressId });
    if (defaultBilling) actions.push({ action: 'setDefaultBillingAddress', addressId: addressId });
    if (shipment) actions.push({ action: 'addShippingAddressId', addressId: addressId });
    if (billing) actions.push({ action: 'addBillingAddressId', addressId: addressId });

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

  public removeAddress = async (addressId: string, removeFromShipment?: boolean, removeFromBilling?: boolean, remove?: boolean) => {
    const api = this.api.getAvalibleApi();
    const version = await this.getCustomerVersion();
    const actions: MyCustomerUpdateAction[] = [];

    if (remove) actions.push({ action: 'removeAddress', addressId: addressId });
    if (removeFromShipment) actions.push({ action: 'removeShippingAddressId', addressId: addressId });
    if (removeFromBilling) actions.push({ action: 'removeBillingAddressId', addressId: addressId });

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

  // Cart

  private createCart = (currency: string) => {
    const api = this.api.getAvalibleApi();

    return api
      .me()
      .carts()
      .post({
        body: {
          currency,
        },
      })
      .execute();
  };

  private getActiveCart = () => {
    const api = this.api.getAvalibleApi();
    return api.me().activeCart().get().execute();
  };

  public getCart = async (currency: string = SortParams.USD) => {
    let cart: ClientResponse<Cart> | null = null;
    try {
      cart = await this.getActiveCart();
    } catch (error) {
      try {
        cart = await this.createCart(currency);
      } catch (error) {
        throw new Error('No CART');
      }
    }
    return cart;
  };

  private cartAction = async (action: MyCartUpdateAction[]) => {
    const api = this.api.getAvalibleApi();
    const cart = await this.getCart();
    let version = 0;
    if (cart.statusCode === HTTPResponseCode.ok) version = cart.body.version;

    return api
      .me()
      .carts()
      .withId({ ID: cart.body.id })
      .post({
        body: {
          version,
          actions: action,
        },
      })
      .execute();
  };

  public addProductToCart = async (productId: string, variantId = 1, quantity = 1) => {
    const action: MyCartAddLineItemAction = {
      action: 'addLineItem',
      productId: productId,
      variantId,
      quantity,
    };
    return this.cartAction([action]);
  };

  public removeProductFromCart = async (productId: string, quantity = 1) => {
    const action: MyCartRemoveLineItemAction = {
      action: 'removeLineItem',
      lineItemId: productId,
      quantity,
    };
    return this.cartAction([action]);
  };

  public clearCart = async () => {
    const cart = await this.getCart();

    if (cart.statusCode === HTTPResponseCode.ok) {
      if (cart.body.lineItems.length > 0) {
        const actions: MyCartRemoveLineItemAction[] = cart.body.lineItems.map((lineItem) => ({
          action: 'removeLineItem',
          lineItemId: lineItem.id,
          quantity: Number(lineItem.quantity),
        }));
        await this.cartAction(actions);
      }
    }
  };

  public recalculateCart = async () => {
    const action: MyCartRecalculateAction = {
      action: 'recalculate',
      updateProductData: true,
    };
    return this.cartAction([action]);
  };

  public getCartDiscounts = async () => {
    const api = this.api.getAvalibleApi();

    return api.cartDiscounts().get().execute();
  };

  public addPromoCode = async (promo: string) => {
    const action: MyCartAddDiscountCodeAction = {
      action: 'addDiscountCode',
      code: promo,
    };
    return this.cartAction([action]);
  };

  public removePromoCode = async (promoId: string) => {
    const action: MyCartRemoveDiscountCodeAction = {
      action: 'removeDiscountCode',
      discountCode: {
        typeId: 'discount-code',
        id: promoId,
      },
    };
    return this.cartAction([action]);
  };

  public getDiscount = async (id: string) => {
    const api = this.api.getAvalibleApi();

    return api.cartDiscounts().withId({ ID: id }).get().execute();
  };
}
