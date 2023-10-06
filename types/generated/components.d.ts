import type { Schema, Attribute } from '@strapi/strapi';

export interface ItemItems extends Schema.Component {
  collectionName: 'components_item_items';
  info: {
    displayName: 'Items';
  };
  attributes: {
    clothe: Attribute.Relation<'item.items', 'oneToOne', 'api::clothe.clothe'>;
    quantity: Attribute.Integer;
  };
}

export interface PaymentPayment extends Schema.Component {
  collectionName: 'components_payment_payments';
  info: {
    displayName: 'Payment';
  };
  attributes: {
    name: Attribute.String;
  };
}

export interface QuantityQuantity extends Schema.Component {
  collectionName: 'components_quantity_quantities';
  info: {
    displayName: 'Quantity';
    description: '';
  };
  attributes: {
    quantities: Attribute.Integer;
    color: Attribute.Relation<
      'quantity.quantity',
      'oneToOne',
      'api::color.color'
    >;
    size: Attribute.Relation<'quantity.quantity', 'oneToOne', 'api::size.size'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'item.items': ItemItems;
      'payment.payment': PaymentPayment;
      'quantity.quantity': QuantityQuantity;
    }
  }
}
