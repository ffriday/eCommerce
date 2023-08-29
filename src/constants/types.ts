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

export enum EmailErrors {
  leadingTrailingSpace = 'Не должно быть начальных или конечных пробелов',
  notInLatin = 'Email должен быть на латинице',
  missing = 'Введите email',
  invalidFormat = 'Неверный формат',
  noTopLevelDomain = 'Отсутствует домен вернего уровня (например: "@xxx.xx")',
  shortDomain = 'Слишком короткое имя домена',
  notCorrect = 'введите корректный email',
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
}

// =========================================================
// // interfaces of Product
// interface Dimensions {
//   h: number;
//   w: number;
// }

// interface Image {
//   dimensions: Dimensions;
//   url: string;
// }

// interface PriceValue {
//   type: string;
//   fractionDigits: number;
//   centAmount: number;
//   currencyCode: string;
// }

// interface Price {
//   value: PriceValue;
//   id: string;
// }

// interface Attribute {
//   type: { name: string };
//   isSearchable: boolean;
//   inputHint: string;
//   name: string;
//   label: { en: string };
//   isRequired: boolean;
//   attributeConstraint: string;
// }

// interface Variant {
//   attributes: Attribute[];
//   id: number;
//   images: Image[];
//   prices: Price[];
//   sku: string;
// }

// interface MasterData {
//   current: {
//     categories: { id: string; typeId: string }[];
//     description: { en: string };
//     masterVariant: Variant;
//     name: { en: string };
//     slug: { en: string };
//     variants: Variant[];
//     searchKeywords: object;
//   };
//   hasStagedChanges: boolean;
//   published: boolean;
//   staged: {
//     categories: { id: string; typeId: string }[];
//     description: { en: string };
//     masterVariant: Variant;
//     name: { en: string };
//     slug: { en: string };
//     variants: Variant[];
//     searchKeywords: object;
//   };
// }

// interface ProductType {
//   id: string;
//   typeId: string;
// }

// interface TaxCategory {
//   id: string;
//   typeId: string;
// }

// export interface ProductData {
//   id: string;
//   version: number;
//   masterData: MasterData;
//   productType: ProductType;
//   taxCategory: TaxCategory;
//   createdAt: string;
//   lastModifiedAt: string;
// }
export interface ICardApiData {
  image: string | undefined;
  name: string;
  description: string | undefined;
  price: number | '';
}
export enum language {
  en = 'en-US',
  ru = 'ru-BY',
}

export type GetPrice = (centAmount?: number, fractionDigits?: number) => number | '';
// =====================================================
