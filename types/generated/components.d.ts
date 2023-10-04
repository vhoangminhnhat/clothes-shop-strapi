import type { Schema, Attribute } from '@strapi/strapi';

export interface ColorColor extends Schema.Component {
  collectionName: 'components_color_colors';
  info: {
    displayName: 'Color';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    code: Attribute.String;
    img: Attribute.Media;
    size: Attribute.Component<'size.size', true>;
  };
}

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

export interface SizeSize extends Schema.Component {
  collectionName: 'components_size_sizes';
  info: {
    displayName: 'Size';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    quantity: Attribute.BigInteger;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'color.color': ColorColor;
      'item.items': ItemItems;
      'payment.payment': PaymentPayment;
      'size.size': SizeSize;
    }
  }
}
