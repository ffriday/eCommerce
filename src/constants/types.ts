export interface IRoute {
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
