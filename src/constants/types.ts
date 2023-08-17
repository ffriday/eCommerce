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
export enum EmailErrors {
  missing = 'Введите email',
  invalidFormat = 'Неверный формат',
  noTopLevelDomain = 'Отсутствует символ "@"',
  shortDomain = 'Слишком короткое имя домена',
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
}
