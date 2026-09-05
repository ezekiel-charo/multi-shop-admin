import type { Shop } from "./shop";

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export interface Product {
  id: string;
  productImageUrl: string;
  productName: string;
  sku: string;
  shop: Shop;
  shopId: string;
  category: string;
  price: number;
  stock: number;
  stockStatus: StockStatus;
  lastUpdatedAt: number;
  createdAt: number;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}
