import { Address, BaseAddress } from '@commercetools/platform-sdk';
import './customerProfile.scss';
import { useContext, useMemo, useState } from 'react';
import { apiContext } from '../App';
import { ICustomerReaction } from './customerProfile';
import {
  buildingFormProps,
  buildingapartPattern,
  cityFormProps,
  cityPattern,
  countryAutocomplete,
  countryFormProps,
  countryMAP,
  postalFormProps,
  postalPattern,
  streetFormProps,
  streetPattern,
} from '../registerForm/formProps';
import InputForm from '../inputForm/inputForm';
import { IAddressTypes } from './profileTypes';
import { checkInput } from '../../constants/formValidation';
import { AddressErrors } from '../../constants/types';

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

  const countries = useMemo(
    () =>
      Object.entries(countryMAP).reduce((acc: Record<string, string>, [key, value]) => {
        acc[value] = key;
        return acc;
      }, {}),
    [],
  );

  const [active, setActive] = useState(false);

  const [country, setCountry] = useState('');
  const [countryState, setCountryState] = useState(address?.country ? countries[address?.country] : '');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [apart, setApart] = useState('');
  const [postal, setPostal] = useState('');

  const [addressInput, setAddressInput] = useState<Partial<BaseAddress>>({ city: '', ...address });

  const [submit, setSubmit] = useState(true);

  const toggleAddress = () => setActive(!active);

  const updateData = (newData: Partial<Address>) => {
    let error = false;
    if (newData.country) {
      if (!countryAutocomplete.dataList.includes(newData.country)) {
        error = true;
        setCountry(AddressErrors.countryFromList);
      } else {
        setCountry('');
      }
    }
    if (newData.city) {
      const { err } = checkInput(newData.city, cityPattern);
      if (err) error = true;
      setCity(err);
    }
    if (newData.streetName) {
      const { err } = checkInput(newData.streetName, streetPattern);
      if (err) error = true;
      setStreet(err);
    }
    if (newData.building) {
      const { err } = checkInput(newData.building, buildingapartPattern);
      if (err) error = true;
      setBuilding(err);
    }
    if (newData.apartment) {
      const { err } = checkInput(newData.apartment, buildingapartPattern);
      if (err) error = true;
      setApart(err);
    }
    if (newData.postalCode) {
      const { err } = checkInput(newData.postalCode, postalPattern);
      if (err) error = true;
      setPostal(err);
    }
    setAddressInput({ ...addressInput, ...newData });
    setSubmit(!error);
  };

  return (
    <div>
      <p onClick={toggleAddress} className='account__addressCaption'>
        {addressPreview(address, countries)}
      </p>
      {active && (
        <>
          <InputForm
            {...countryFormProps}
            id={`${countryFormProps.id}-${address?.id}`}
            labelClassName={`${countryFormProps.labelClassName} ${country ? 'invailid-label' : 'vailid-label'}`}
            propLabelInfo={country}
            value={countryState}
            handler={(event) => {
              updateData({ country: event.currentTarget.value });
              setCountryState(event.currentTarget.value);
            }}
          />
          <InputForm
            {...cityFormProps}
            id={`${cityFormProps.id}-${address?.id}`}
            labelClassName={`${cityFormProps.labelClassName} ${city ? 'invailid-label' : 'vailid-label'}`}
            propLabelInfo={city}
            value={addressInput.city}
            handler={(event) => updateData({ city: event.currentTarget.value })}
          />
          <InputForm
            {...streetFormProps}
            id={`${streetFormProps.id}-${address?.id}`}
            labelClassName={`${streetFormProps.labelClassName} ${street ? 'invailid-label' : 'vailid-label'}`}
            propLabelInfo={street}
            value={addressInput.streetName}
            handler={(event) => updateData({ streetName: event.currentTarget.value })}
          />
          <InputForm
            {...buildingFormProps}
            id={`${buildingFormProps.id}-${address?.id}`}
            labelClassName={`${buildingFormProps.labelClassName} ${building ? 'invailid-label' : 'vailid-label'}`}
            propLabelInfo={building}
            value={addressInput.building}
            handler={(event) => updateData({ building: event.currentTarget.value })}
          />
          <InputForm
            {...buildingFormProps}
            id={`${buildingFormProps.id}-${address?.id}`}
            labelClassName={`${buildingFormProps.labelClassName} ${apart ? 'invailid-label' : 'vailid-label'}`}
            propLabelInfo={apart}
            value={addressInput.apartment}
            handler={(event) => updateData({ apartment: event.currentTarget.value })}
          />
          <InputForm
            {...postalFormProps}
            id={`${postalFormProps.id}-${address?.id}`}
            labelClassName={`${postalFormProps.labelClassName} ${postal ? 'invailid-label' : 'vailid-label'}`}
            propLabelInfo={postal}
            value={addressInput.postalCode}
            handler={(event) => updateData({ postalCode: event.currentTarget.value })}
          />
        </>
      )}

      {/* <InputForm
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
