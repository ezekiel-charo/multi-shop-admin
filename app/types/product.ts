import type { Shop } from "./shop";

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export interface InventoryAdjustment {
  id: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  adjustedAt: number;
  adjustedBy: string;
}

export interface Product {
  id: string;
  productImageUrl: string;
  productName: string;
  sku: string;
  shop: Shop;
  shopId: string;
  category: "FOODSTUFF" | "OTHER";
  price: number;
  stock: number;
  stockStatus: StockStatus;
  lastUpdatedAt: number;
  createdAt: number;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  inventoryAdjustments?: InventoryAdjustment[];
}
