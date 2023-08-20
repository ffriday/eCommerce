import { apiRoot } from './ecommerce-client';
import { IUser, IUserValidate, IValueStatus } from './types';

enum ShipmentDefaultKey {
  shipment = 'Shipment',
  bill = 'Billing',
}

export const createCustomer = (customer: IUserValidate<IUser> | IUserValidate<IValueStatus>) => {
  const shipmentAdress = {
    key: ShipmentDefaultKey.shipment.toString(),
    country: 'US',
    city: customer.shipment.city.val,
    streetName: customer.shipment.street.val,
    postalCode: customer.shipment.postal.val,
    building: customer.shipment.building.val,
    apartment: customer.shipment.apart.val,
  };

  const billAdress = {
    key: ShipmentDefaultKey.bill.toString(),
    country: 'DE',
    city: customer.bill.city.val,
    streetName: customer.bill.street.val,
    postalCode: customer.bill.postal.val,
    building: customer.bill.building.val,
    apartment: customer.bill.apart.val,
  };

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
