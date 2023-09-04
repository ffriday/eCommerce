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
import { AddressErrors, ButtonCodes } from '../../constants/types';
import Checkbox from '../checkbox/checkbox';
import SubmitButton from '../submitButton/submitButton';

interface IAddressButtons {
  add: boolean;
  edit: boolean;
  remove: boolean;
}

interface ICustomerAddress extends ICustomerReaction {
  address?: Address;
  addressTypes?: IAddressTypes;
  buttons: Partial<IAddressButtons>;
}

const addressPreview = (address: Address | undefined, countries: Record<string, string>) => {
  let res = 'Добавить новый адрес';
  if (address) {
    res = `Адрес: ${countries[address.country]}, ${address.city}, ${address.streetName}...`;
  }
  return res;
};

export const EditCustomerAddress = ({ address, addressTypes, buttons, update, showError }: ICustomerAddress) => {
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

  const [action, setAction] = useState('');
  const [addressInput, setAddressInput] = useState<Partial<BaseAddress>>({
    city: '',
    streetName: '',
    building: '',
    apartment: '',
    postalCode: '',
    ...address,
    country: address ? countries[address.country as string] : '',
  });
  const [addressParams, setAddressParams] = useState<IAddressTypes>(
    addressTypes ? addressTypes : { billing: [''], shipping: [''], defaultBilling: '', defaultShipping: '' },
  );

  const [submit, setSubmit] = useState(false);

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
    Object.values(addressInput).forEach((el) => {
      if (el === '') error = true;
    });
    setAddressInput({ ...addressInput, ...newData });
    setSubmit(!error);
  };

  const checkAddressParams = (arr: string[], id: string | undefined) => {
    let res = false;
    if (id !== undefined) res = arr.includes(id);
    return res;
  };

  const setParams = (param: string[], checked: boolean | undefined) => {
    let res = param;
    if (address?.id !== undefined) {
      if (checked) {
        if (!param.includes(address.id)) res.push(address.id);
      } else {
        const index = param.indexOf(address.id);
        res = res.splice(index, 1);
      }
    }
    return res;
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    showError('');
    try {
      if (action === ButtonCodes.remove) {
        if (address?.id) await api.removeAddress(address.id, false, false, true);
      }
      if (action === ButtonCodes.update) {
        if (address?.id) {
          await api.changeAddress({ ...addressInput, country: countryMAP[addressInput.country as string] }, address.id);
          // const ship = addressParams.shipping.includes(address.id);
          // const bill = addressParams.billing.includes(address.id);
          // await api.changeAddressParams(address.id, ship, bill, Boolean(addressParams.defaultShipping), Boolean(addressParams.defaultBilling));
        }
      }
      if (action === ButtonCodes.add) {
        const res = await api.addAddress({ ...addressInput, country: countryMAP[addressInput.country as string] });
        if (res.body.id) {
          const ship = addressParams.shipping.includes(res.body.id);
          const bill = addressParams.billing.includes(res.body.id);
          await api.changeAddressParams(res.body.id, ship, bill, Boolean(addressParams.defaultShipping), Boolean(addressParams.defaultBilling));
        }
      }
      update();
    } catch (error) {
      if (error) {
        showError(error.toString());
      }
    }
  };

  return (
    <div>
      <p onClick={toggleAddress} className='account__addressCaption'>
        {addressPreview(address, countries)}
      </p>
      {active && (
        <form className='account__data' onSubmit={(event) => submitForm(event)}>
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
          <div>
            <Checkbox
              id={`checkbox-shipment ${address?.id}`}
              handler={(value) => setAddressParams({ ...addressParams, shipping: setParams(addressParams.shipping, value) })}
              checked={checkAddressParams(addressParams.shipping, address?.id)}
              classNameWrapper='account__checkbox-defaultAddress'
              title='Для доставки'
            />
            <Checkbox
              id={`checkbox-billing ${address?.id}`}
              handler={(value) => setAddressParams({ ...addressParams, billing: setParams(addressParams.billing, value) })}
              checked={checkAddressParams(addressParams.billing, address?.id)}
              classNameWrapper='account__checkbox-defaultAddress'
              title='Для выставления счета'
            />
            <Checkbox
              id={`checkbox-defaultShipping ${address?.id}`}
              handler={(value) => {
                if (address && address.id && address.id === addressParams.defaultShipping) {
                  const def = value ? address.id : '';
                  setAddressParams({ ...addressParams, defaultShipping: def });
                }
              }}
              checked={address?.id ? addressParams.defaultShipping === address.id : false}
              classNameWrapper='account__checkbox-defaultAddress'
              title='По умолчанию для доставки'
            />
            <Checkbox
              id={`checkbox-defaultBilling ${address?.id}`}
              handler={(value) => {
                if (address && address.id && address.id === addressParams.defaultBilling) {
                  const def = value ? address.id : '';
                  setAddressParams({ ...addressParams, defaultBilling: def });
                }
              }}
              checked={address?.id ? addressParams.defaultBilling === address.id : false}
              classNameWrapper='account__checkbox-defaultAddress'
              title='По умолчанию для выставления счета'
            />
          </div>
          <div className='account__buttons'>
            {buttons?.remove ? (
              <SubmitButton text={'Удалить'} disabled={false} className={ButtonCodes.remove} handler={() => setAction(ButtonCodes.remove)} />
            ) : null}
            {buttons?.edit ? (
              <SubmitButton text={'Обновить'} disabled={!submit} className={ButtonCodes.update} handler={() => setAction(ButtonCodes.update)} />
            ) : null}
            {buttons?.add ? (
              <SubmitButton text={'Добавить'} disabled={!submit} className={ButtonCodes.add} handler={() => setAction(ButtonCodes.add)} />
            ) : null}
          </div>
        </form>
      )}
    </div>
  );
};
