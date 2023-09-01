import moment from 'moment';
import { DateErrors, IValueStatus } from './types';
import { IPattern, IRegisterContext } from '../components/registerForm/registerForm';

export interface IformData {
  [key: string]: string | null;
}

export interface IListOfValidationRules {
  [key: string]: IValidationRule[];
}

export const missingError = 'Значение отсутствует';

export interface IFormErrors {
  [key: string]: string | null;
}

interface IValidationRule {
  pattern: RegExp;
  error: string;
}
// the name of the keys of the formData object must match the keys of the ListOfValidationRules object!
export const validation = (formData: IformData, ListOfValidationRules: IListOfValidationRules) => {
  const formErrors: IFormErrors = {};
  const formDatakeys = Object.keys(formData);
  formDatakeys.forEach((formDataKey) => {
    const formDataValue = formData[formDataKey];
    if (!formDataValue) {
      formErrors[formDataKey] = missingError;
    } else {
      for (const validationRuleKey of Object.keys(ListOfValidationRules)) {
        if (formDataKey === validationRuleKey) {
          for (const { pattern, error } of ListOfValidationRules[validationRuleKey]) {
            if (!pattern.test(formDataValue)) {
              formErrors[formDataKey] = error;
              break; // Stop on first matching rule
            }
          }
        }
      }
    }
  });
  return formErrors;
};

export const checkDate = (inputDate: string, age: number) => {
  const date = new Date(inputDate);
  const birthDate = moment(inputDate, 'YYYY-MM-DD');
  const status: IValueStatus = { val: inputDate, err: DateErrors.tooYang, className: 'invailid-label' };
  if (!isNaN(date.getTime())) {
    const currentDate = moment();
    const delta = currentDate.diff(birthDate, 'year');
    if (delta >= age) {
      status.className = 'vailid-label';
      status.err = '';
    }
  }
  return status;
};

export const checkDateContext = (event: React.FormEvent<HTMLInputElement>, context: IRegisterContext, age: number) => {
  const status = checkDate(event.currentTarget.value, age);
  context.setValidateArr({ ...context.validateArr, birthDate: status });
};

export const checkInput = (value: string, pattern: IPattern[]): IValueStatus => {
  const errorArr = pattern.filter((elem) => !elem.pattern.test(value));
  const error = errorArr.length ? errorArr[0].error : '';
  return { val: value, err: error };
};
