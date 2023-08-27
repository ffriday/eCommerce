import { BaseAddress, CustomerDraft, MyCustomerDraft } from '@commercetools/platform-sdk';
import { apiRoot } from './ecommerce-client';
import { IUser, IUserValidate, IValueStatus } from './types';

export enum ShipmentDefaultKey {
  shipment = 'Shipment',
  bill = 'Billing',
}

export enum RegisterErrors {
  userAlredyExist = 'Пользователь с таким email уже существует',
  serviceUnavalible = 'Сервис недоступен. Проверьте свое интернет подключение',
}

interface ICustomerAdress {
  key: string;
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
  building: string;
  apartment: string;
}

interface IDefaultAddress {
  defaultShippingAddress: number;
  defaultBillingAddress: number;
}

export const ErorMap: Record<string, string> = {
  400: RegisterErrors.userAlredyExist,
  503: RegisterErrors.serviceUnavalible,
};

export const createCustomer = (
  customer: IUserValidate<IUser> | IUserValidate<IValueStatus>,
  defaultShipment: boolean,
  defaultBill: boolean,
  billAddressDisabled: boolean,
) => {
  const shipmentAdress: ICustomerAdress = {
    key: ShipmentDefaultKey.shipment.toString(),
    country: customer.shipment.country.val,
    city: customer.shipment.city.val,
    streetName: customer.shipment.street.val,
    postalCode: customer.shipment.postal.val,
    building: customer.shipment.building.val,
    apartment: customer.shipment.apart.val,
  };

  const billAdress: ICustomerAdress = {
    key: ShipmentDefaultKey.bill.toString(),
    country: customer.bill.country.val,
    city: customer.bill.city.val,
    streetName: customer.bill.street.val,
    postalCode: customer.bill.postal.val,
    building: customer.bill.building.val,
    apartment: customer.bill.apart.val,
  };

  const defaultAdress: Partial<IDefaultAddress> = {};
  if (defaultShipment) defaultAdress.defaultShippingAddress = 0;
  // If defauld billing address input disabled => make shipping address as defalt (if chosen)
  if (defaultBill) defaultAdress.defaultBillingAddress = billAddressDisabled ? 0 : 1;
  const addressArr: BaseAddress[] = [shipmentAdress];
  if (!billAddressDisabled) addressArr.push(billAdress);

  const customerBody: CustomerDraft = {
    firstName: customer.name.val,
    lastName: customer.surename.val,
    email: customer.email.val,
    password: customer.password.val,
    dateOfBirth: customer.birthDate.val,
    addresses: addressArr,
    shippingAddresses: [0],
    billingAddresses: [billAddressDisabled ? 0 : 1],
    ...defaultAdress,
  };

  return customerBody;

  // return apiRoot
  //   .customers()
  //   .post({
  //     body: customerBody,
  //   })
  //   .execute();
};
