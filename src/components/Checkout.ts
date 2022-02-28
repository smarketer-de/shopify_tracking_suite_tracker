
import DataLayerExtension from "./DataLayerExtension";

export default class Checkout extends DataLayerExtension {
  name = "Checkout";
  
  setup(): void {
    if (window.sts_config.purchase) {      
      const dataLayer: {[key:string]: any} = {};

      // Remarketing
      dataLayer.ecomm_pagetype = "purchase";
      dataLayer.ecomm_prodid = window.Shopify.checkout.line_items.map((item: any) => item.product_id + "_" + item.variant_id);
      dataLayer.ecomm_totalvalue = window.Shopify.checkout.totalPrice;

      // Tag Manager infos
      dataLayer.purchase = {
        v:1,
        
        first_time_accessed: window.sts_config.purchase.first_time_accessed,
        customer: window.sts_config.purchase.customer,

        discount: window.Shopify.checkout.gift_cards.join(","),
        value: Number(window.Shopify.checkout.total_price),
        subvalue: Number(window.Shopify.checkout.subtotal_price),

        currency: window.Shopify.checkout.currency,

        items: window.Shopify.checkout.line_items.map((item: any) => {
          return {
            ...item,
            id: item.product_id + "_" + item.variant_id,
            price: item.price,
            quantity: item.quantity,
            name: item.title,
            category: item.product_type,
            brand: item.vendor,
          }
        }),
        shipping: Number(window.Shopify.checkout.shipping_rate.price),

        tax: window.Shopify.checkout.tax_lines.reduce((acc: number, tax: any) => acc + Number(tax.price), 0),
        productTax: window.Shopify.checkout.line_items.reduce((acc: number, item: any) => {
          if (item.tax_lines && item.tax_lines.length) {
            return acc + item.tax_lines.reduce((acc: number, tax: any) => acc + Number(tax.price), 0);
          }
          return acc;
        }, 0),

        orderId: window.Shopify.checkout.order_id,
        orderNumber: document.querySelector('.os-order-number')?.textContent?.replace(/[^0-9]/g, ''),
      }
      
      window.sts_config.dataLayer = {
        ...window.sts_config.dataLayer,
        ...dataLayer
      }
    }
  }
}