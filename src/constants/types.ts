import { CartDiscount } from '@commercetools/platform-sdk';

export interface IRoute {
  title: string;
  href: string;
  classNames: IRouteClasses;
  onClickHandle?: () => void;
}
export interface IRouteDropDown {
  title: string;
  href: string;
  classNames: IRouteClasses;
}

export interface IRouteClasses {
  container: string;
  link?: string;
}

export interface IMenuLink extends IRoute {
  alt: string;
  icon: string;
}

export type IInputhandler = (event: React.FormEvent<HTMLInputElement>) => void;
export type IMouthhandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

export interface IUser {
  val: string;
}

export interface IValueStatus extends IUser {
  err: string;
  className?: string;
}

export interface IAddress<T> {
  country: T;
  city: T;
  street: T;
  postal: T;
  building: T;
  apart: T;
}

export interface IUserValidate<T> {
  email: T;
  password: T;
  passwordCheck: T;
  name: T;
  surename: T;
  birthDate: T;
  shipment: IAddress<T>;
  bill: IAddress<T>;
}

export enum RoutePath {
  account = 'account',
  login = 'login',
  register = 'registration',
  catalog = 'catalog',
  basket = 'basket',
  about = 'about',
  contacts = 'contacts',
  shares = 'shares',
  novelties = 'novelties',
  product = 'catalog/:key',
  arrangmentcategory = 'catalog/flowerarrangements',
  bouquetscategory = 'catalog/bouquets',
  giftbasketcategory = 'catalog/categorygiftbasket',
  arrangmentcategoryprod = 'catalog/flowerarrangements/:key',
  bouquetscategoryprod = 'catalog/bouquets/:key',
  giftbasketcategoryprod = 'catalog/categorygiftbasket/:key',
}

export enum EmailErrors {
  leadingTrailingSpace = 'Не должно быть начальных или конечных пробелов',
  notInLatin = 'Email должен быть на латинице',
  missing = 'Введите email',
  invalidFormat = 'Неверный формат',
  noTopLevelDomain = 'Отсутствует домен вернего уровня (например: "@xxx.xx")',
  shortDomain = 'Слишком короткое имя домена',
  notCorrect = 'введите корректный email',
  noAccount = 'Нет пользователя с введенным логином и паролем',
}

export enum PasswordErrors {
  notInLatin = 'Пароль должен быть на латинице',
  missing = 'Пароль не введен',
  tooShort = 'Слишком короткий пароль',
  missingLetter = 'Пароль не содержит букв и символов',
  missingUppercase = 'Отсутствует заглавная буква',
  missingLowercase = 'Отсутствует строчная буква',
  missingDigit = 'Отсутствует цифра',
  missingSpecialChar = 'Рекомендуется использовать специальный символ',
  leadingTrailingSpace = 'Не должно быть начальных или конечных пробелов',
  notMatch = 'Пароли не совпадают',
  noAccount = 'Нет пользователя с введенным логином и паролем',
}

export enum NameErrors {
  tooShort = 'Имя слишком короткое',
  specialSymbols = 'Имя не должно содержать специальных символов',
}

export enum DateErrors {
  tooYang = 'Возраст должен быть более 13 лет',
}

export enum AddressErrors {
  tooShort = 'Название слишком короткое',
  specialSymbols = 'Не должен содержать специальных символов',
  postalFormat = 'Неверный формат почтового кода',
  countryFromList = 'Выберите страну из списка',
  noNumber = 'Введите номер',
  specialSymbolsApart = 'Неверный номер',
}

export enum RegiserInputNames {
  email = 'email',
  password = 'password',
  name = 'name',
  surename = 'surename',
  birthDate = 'birthDate',
  shipment = 'shipment',
  bill = 'bill',
}

export enum HTTPResponseCode {
  logged = 200,
  registerd = 201,
  ok = 200,
}

export interface ICardApiData {
  id: string;
  key: string | undefined;
  image: string | undefined;
  name: string;
  description: string | undefined;
  price: string;
  isDiscounted: boolean;
  discPrice: string;
}

export enum language {
  en = 'en-US',
  ru = 'ru-BY',
}

export type GetPrice = (centAmount?: number, fractionDigits?: number) => string;

export type IShowError = (error: string) => void;

export interface ICatalogApiData {
  products: ICardApiData[];
  totalCount: number | undefined;
}
// =====================================================
export interface Pagination {
  nextPageHandler: () => void;
  prevPageHandler: () => void;
  navigation?: {
    current: number;
    total: number;
  };
  disable: {
    left: boolean;
    right: boolean;
  };
}

export enum ButtonCodes {
  update = 'account__update',
  remove = 'account__remove',
  add = 'account__add',
}

export interface ICheckbox {
  id: string;
  handler: (value?: boolean) => void;
  title: string;
  className?: string;
  classNameWrapper?: string;
  link?: {
    path: string;
    text: string;
  };
  checked?: boolean;
}

export type IFilterEvent = (event: React.FormEvent) => void;

export interface IBasketProduct {
  productId: string;
  lineItemId: string;
  name: string;
  price: number;
  isDiscounted: boolean;
  discountPrice: number;
  quantity: number;
  image: string | undefined;
  variantId: number;
}

export type BasketItemAddType = (productId: string, variantId: number) => Promise<void>;
export type BasketItemRemoveType = (productId: string) => Promise<void>;
export type BasketItemRemoveAllType = (lineItemId: string, quantity: number) => Promise<void>;

export interface IBasketPromo {
  promocodeId: string;
  removeHandler: (id: string) => void;
  errorHandler: (error: string) => void;
}
