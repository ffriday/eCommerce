import { Address } from '@commercetools/platform-sdk';
import './customerProfile.scss';
import { useContext, useMemo, useState } from 'react';
import { apiContext } from '../App';
import { ICustomerReaction } from './customerProfile';
import { countryFormProps, countryMAP } from '../registerForm/formProps';
import InputForm from '../inputForm/inputForm';
import { IAddressTypes } from './profileTypes';

interface IAddressButtons {
  add: boolean;
  edit: boolean;
  remove: boolean;
}

interface ICustomerAddress extends ICustomerReaction {
  address: Address;
  addressTypes: IAddressTypes;
  buttons: Partial<IAddressButtons>;
}

const addressPreview = (address: Address | undefined, countries: Record<string, string>) => {
  let res = 'Добавить новый адрес';
  if (address) {
    res = `Адрес: ${countries[address.country]}, ${address.city}, ${address.streetName}...`;
  }
  return res;
};

export const EditCustomerAddress = ({ address, addressTypes, buttons, update, showError }: Partial<ICustomerAddress>) => {
  const api = useContext(apiContext);

  const [active, setActive] = useState(false);

  const countries = useMemo(
    () =>
      Object.entries(countryMAP).reduce((acc: Record<string, string>, [key, value]) => {
        acc[value] = key;
        return acc;
      }, {}),
    [],
  );

  return (
    <div>
      {!active ? <p className='account__addressCaption'>{addressPreview(address, countries)}</p> : ''}

      {/* <p className='account__addressCaption'>{caption}</p>
      <InputForm
        {...countryFormProps}
        id={`${countryFormProps.id}-${className}`}
        labelClassName={`${countryFormProps.labelClassName} ${context.validateArr.shipment?.country.className || ''}`}
        propLabelInfo={context.validateArr.shipment?.country.err}
        disabled={isDisabled}
        handler={(event) => {
          const error = !countryAutocomplete.dataList.includes(event.currentTarget.value) ? AddressErrors.countryFromList : '';
          const status: IValueStatus = {
            val: !error ? countryMAP[event.currentTarget.value] : '',
            err: error,
            className: error.length ? ' invailid-label' : ' vailid-label',
          };
          const adress = { ...context.validateArr[arrKey], country: status };
          context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
        }}
      />
      <InputForm
        {...cityFormProps}
        id={`${cityFormProps.id}-${className}`}
        labelClassName={`${cityFormProps.labelClassName} ${context.validateArr[arrKey].city.className || ''}`}
        propLabelInfo={context.validateArr[arrKey].city.err}
        disabled={isDisabled}
        handler={(event) => {
          const status = checkInput(event.currentTarget.value, cityPattern);
          status.className = status.err.length ? ' invailid-label' : ' vailid-label';
          const adress = { ...context.validateArr[arrKey], city: status };
          context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
        }}
      />
      <InputForm
        {...streetFormProps}
        id={`${streetFormProps.id}-${className}`}
        labelClassName={`${streetFormProps.labelClassName} ${context.validateArr[arrKey].street.className || ''}`}
        propLabelInfo={context.validateArr[arrKey].street.err}
        disabled={isDisabled}
        handler={(event) => {
          const status = checkInput(event.currentTarget.value, streetPattern);
          status.className = status.err.length ? ' invailid-label' : ' vailid-label';
          const adress = { ...context.validateArr[arrKey], street: status };
          context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
        }}
      />
      <div className='register__home'>
        <InputForm
          {...buildingFormProps}
          id={`${buildingFormProps.id}-${className}`}
          labelClassName={`${buildingFormProps.labelClassName} ${context.validateArr[arrKey].building.className || ''}`}
          propLabelInfo={context.validateArr[arrKey].building.err}
          disabled={isDisabled}
          handler={(event) => {
            const status = checkInput(event.currentTarget.value, buildingapartPattern);
            status.className = status.err.length ? ' invailid-label' : ' vailid-label';
            const adress = { ...context.validateArr[arrKey], building: status };
            context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
          }}
        />
        <InputForm
          {...apartFormProps}
          id={`${apartFormProps.id}-${className}`}
          labelClassName={`${apartFormProps.labelClassName} ${context.validateArr[arrKey].apart.className || ''}`}
          propLabelInfo={context.validateArr[arrKey].apart.err}
          disabled={isDisabled}
          handler={(event) => {
            const status = checkInput(event.currentTarget.value, buildingapartPattern);
            status.className = status.err.length ? ' invailid-label' : ' vailid-label';
            const adress = { ...context.validateArr[arrKey], apart: status };
            context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
          }}
        />
      </div>
      <InputForm
        {...postalFormProps}
        id={`${postalFormProps.id}-${className}`}
        labelClassName={`${postalFormProps.labelClassName} ${context.validateArr[arrKey].postal.className || ''}`}
        propLabelInfo={context.validateArr[arrKey].postal.err}
        disabled={isDisabled}
        handler={(event) => {
          const status = checkInput(event.currentTarget.value, postalPattern);
          status.className = status.err.length ? ' invailid-label' : ' vailid-label';
          const adress = { ...context.validateArr[arrKey], postal: status };
          context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
        }}
      />
      <Checkbox
        id={`checkbox ${className}`}
        handler={() => defaultAddress(arrKey)}
        classNameWrapper='register__checkbox-defaultAddress'
        title='Сделать адресом по умолчанию'
      /> */}
    </div>
  );
};
