export interface ShopInventoryValue {
  shopName: string;
  inventoryValue: number;
}

export interface DashboardData {
  totalShops: number;
  totalProducts: number;
  totalStock: number;
  totalInventoryValue: number;
  numLowStockProducts: number;
  numOutOfStockProducts: number;
  topShops: ShopInventoryValue[];
}
