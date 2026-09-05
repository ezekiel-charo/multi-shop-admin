import type { Page } from "~/types/page";
import type { Product } from "~/types/product";
import type { Shop } from "~/types/shop";

export function getShopDerivedFields(products: Product[] = []) {
  return {
    numProducts: products.length,
    totalStock: products.reduce((total, product) => total + product.stock, 0),
    totalInventoryValue: products.reduce(
      (total, product) => total + product.price * product.stock,
      0,
    ),
  };
}

export function mapShopWithDerivedFields(shop: Shop): Shop {
  const { products, ...shopData } = shop;
  return {
    ...shopData,
    ...getShopDerivedFields(products),
  };
}

export function attachDerivedShopFields(page: Page<Shop>): Page<Shop> {
  return {
    ...page,
    data: page.data.map(mapShopWithDerivedFields),
  };
}
