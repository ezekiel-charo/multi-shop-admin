import type { Product, StockStatus } from "~/types/product";

export function getStockStatus(stock: number): StockStatus {
  if (stock > 5) {
    return "IN_STOCK";
  }

  if (stock > 0) {
    return "LOW_STOCK";
  }

  return "OUT_OF_STOCK";
}

export function mapProductWithDerivedFields(product: Product): Product {
  return {
    ...product,
    stockStatus: getStockStatus(product.stock),
  };
}
