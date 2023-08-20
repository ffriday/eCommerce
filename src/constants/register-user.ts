import { apiRoot } from './ecommerce-client';
import { IUser, IUserValidate, IValueStatus } from './types';

export enum ShipmentDefaultKey {
  shipment = 'Shipment',
  bill = 'Billing',
}

interface ICustomerAdress {
  key: string;
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
  building: string;
  apartment: string;
  defaultShippingAddress?: string;
  defaultBillingAddress?: string;
}

export const createCustomer = (customer: IUserValidate<IUser> | IUserValidate<IValueStatus>, defaultShipment: boolean, defaultBill: boolean) => {
  const shipmentAdress: ICustomerAdress = {
    key: ShipmentDefaultKey.shipment.toString(),
    country: customer.shipment.country.val,
    city: customer.shipment.city.val,
    streetName: customer.shipment.street.val,
    postalCode: customer.shipment.postal.val,
    building: customer.shipment.building.val,
    apartment: customer.shipment.apart.val,
  };
  if (defaultShipment) shipmentAdress.defaultShippingAddress = '0';

  const billAdress: ICustomerAdress = {
    key: ShipmentDefaultKey.bill.toString(),
    country: customer.bill.country.val,
    city: customer.bill.city.val,
    streetName: customer.bill.street.val,
    postalCode: customer.bill.postal.val,
    building: customer.bill.building.val,
    apartment: customer.bill.apart.val,
  };

  if (defaultBill) shipmentAdress.defaultBillingAddress = '1';

  return apiRoot
    .customers()
    .post({
      body: {
        firstName: customer.name.val,
        lastName: customer.surename.val,
        email: customer.email.val,
        password: customer.password.val,
        dateOfBirth: customer.birthDate.val,
        addresses: [shipmentAdress, billAdress],
      },
    })
    .execute();
};
