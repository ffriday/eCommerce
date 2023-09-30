import { AddressErrors, EmailErrors, NameErrors, PasswordErrors } from '../../constants/types';
import { IInputAutocomplete, IInputForm } from '../inputForm/inputForm';
import { IPattern } from './registerForm';

// Step 1

export const emailFormProps: IInputForm = {
  name: 'email',
  type: 'email',
  id: 'email',
  placeholder: 'Ваш e-mail',
  inputClassName: 'register__input-email',
  labelClassName: 'register__label-email',
};

export const passwordFormProps: IInputForm = {
  name: 'password',
  type: 'password',
  id: 'password',
  placeholder: 'Придумайте пароль',
  inputClassName: 'register__input-password',
  labelClassName: 'register__label-password',
};

export const passwordCheckFormProps: IInputForm = {
  name: 'password-check',
  type: 'password',
  id: 'password-check',
  placeholder: 'Повторите пароль',
  inputClassName: 'register__input-password-check',
  labelClassName: 'register__label-password-check',
};

export const firstNameFormProps: IInputForm = {
  name: 'first-name',
  type: 'text',
  id: 'first-name',
  placeholder: 'Имя',
  inputClassName: 'register__input-first-name',
  labelClassName: 'register__label-first-name',
};

export const lastNameFormProps: IInputForm = {
  name: 'last-name',
  type: 'text',
  id: 'last-name',
  placeholder: 'Фамилия',
  inputClassName: 'register__input-last-name',
  labelClassName: 'register__label-last-name',
};

export const dateFormProps: IInputForm = {
  name: 'date',
  type: 'date',
  id: 'date',
  placeholder: 'Дата рождения',
  inputClassName: 'register__input-date',
  labelClassName: 'register__label-date',
};

// Step 2

export const streetFormProps: IInputForm = {
  name: 'street',
  type: 'text',
  id: 'street',
  placeholder: 'Улица',
  inputClassName: 'register__input-street',
  labelClassName: 'register__label-street',
};

export const cityFormProps: IInputForm = {
  name: 'city',
  type: 'text',
  id: 'city',
  placeholder: 'Город',
  inputClassName: 'register__input-city',
  labelClassName: 'register__label-city',
};

export const postalFormProps: IInputForm = {
  name: 'postal',
  type: 'text',
  id: 'postal',
  placeholder: 'Почтовый индекс',
  inputClassName: 'register__input-postal',
  labelClassName: 'register__label-postal',
};

export const countryAutocomplete: IInputAutocomplete = {
  listName: 'country',
  dataList: ['Belarus', 'Russia', 'Turkey'],
};

export const countryMAP: Record<string, string> = {
  Belarus: 'BY',
  Russia: 'RU',
  Turkey: 'TR',
};

export const countryFormProps: IInputForm = {
  name: 'country',
  type: 'text',
  id: 'countrySelect',
  placeholder: 'Выберите страну',
  inputClassName: 'register__input-country',
  labelClassName: 'register__label-country',
  autocomplete: countryAutocomplete,
};

export const buildingFormProps: IInputForm = {
  name: 'building',
  type: 'text',
  id: 'building',
  placeholder: 'Дом',
  inputClassName: 'register__input-building',
  labelClassName: 'register__label-building',
};

export const apartFormProps: IInputForm = {
  name: 'apart',
  type: 'text',
  id: 'apart',
  placeholder: 'Квартира',
  inputClassName: 'register__input-apart',
  labelClassName: 'register__label-apart',
};

// Patterns

export const emailPattern: IPattern[] = [
  { pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, error: EmailErrors.notCorrect },
  { pattern: /^[A-Za-z@{|}_~!#$%^=&*+?.\\\d/]+$/, error: EmailErrors.notInLatin },
  { pattern: /^[A-Z0-9{|}_~!#$%^=&*+?.\\/]+@[A-Z0-9.-]+$/i, error: EmailErrors.noTopLevelDomain },
  { pattern: /^[A-Z0-9{|}_~!#$%^=&*+?.\\/]+@[A-Z0-9.-]+\.\w{2,4}$/i, error: EmailErrors.shortDomain },
];

export const passwordPattern: IPattern[] = [
  { pattern: /^(?!(\s|\S*\s$))\S+$/, error: PasswordErrors.leadingTrailingSpace },
  { pattern: /[A-Za-z\d].*/, error: PasswordErrors.notInLatin },
  { pattern: /^(?=.{8,})/, error: PasswordErrors.tooShort },
  { pattern: /[A-Z]/, error: PasswordErrors.missingUppercase },
  { pattern: /[a-z]/, error: PasswordErrors.missingLowercase },
  { pattern: /[0-9]/, error: PasswordErrors.missingDigit },
];

export const namePattern: IPattern[] = [
  { pattern: /^.{1,}$/, error: NameErrors.tooShort },
  { pattern: /^[a-zA-Zа-яА-Я]+$/, error: NameErrors.specialSymbols },
];

export const streetPattern: IPattern[] = [{ pattern: /^.{1,}$/, error: AddressErrors.tooShort }];

export const cityPattern: IPattern[] = [
  { pattern: /^.{1,}$/, error: AddressErrors.tooShort },
  { pattern: /^[a-zA-Zа-яА-Я]+$/, error: AddressErrors.specialSymbols },
];

export const postalPattern: IPattern[] = [{ pattern: /^(?:\d{6}(?:[-\s]\d{5})?|[A-Z]\d[A-Z] \d[A-Z]\d)$/, error: AddressErrors.postalFormat }];

export const buildingapartPattern: IPattern[] = [
  { pattern: /^.{1,}$/, error: AddressErrors.noNumber },
  { pattern: /^[A-Za-z0-9А-Яа-я/]+$/, error: AddressErrors.specialSymbolsApart },
];
