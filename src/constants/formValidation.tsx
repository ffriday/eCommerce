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
