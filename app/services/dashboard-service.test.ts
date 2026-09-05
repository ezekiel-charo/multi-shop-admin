import { describe, expect, it } from "vitest";
import { calculateDashboardData } from "./dashboard-service";

describe("calculateDashboardData", () => {
  it("aggregates totals, stock statuses, and the five highest-value shops", () => {
    const shops = [
      { id: "shop-1", shopName: "Shop 1" },
      { id: "shop-2", shopName: "Shop 2" },
      { id: "shop-3", shopName: "Shop 3" },
      { id: "shop-4", shopName: "Shop 4" },
      { id: "shop-5", shopName: "Shop 5" },
      { id: "shop-6", shopName: "Shop 6" },
    ];
    const products = [
      { shopId: "shop-1", price: 10, stock: 6 },
      { shopId: "shop-1", price: 5, stock: 5 },
      { shopId: "shop-2", price: 20, stock: 0 },
      { shopId: "shop-3", price: 2, stock: 1 },
      { shopId: "shop-4", price: 1, stock: 2 },
      { shopId: "shop-5", price: 3, stock: 3 },
      { shopId: "shop-6", price: 100, stock: 1 },
    ];

    expect(calculateDashboardData(shops, products)).toEqual({
      totalShops: 6,
      totalProducts: 7,
      totalStock: 18,
      totalInventoryValue: 198,
      numLowStockProducts: 5,
      numOutOfStockProducts: 1,
      topShops: [
        { shopName: "Shop 6", inventoryValue: 100 },
        { shopName: "Shop 1", inventoryValue: 85 },
        { shopName: "Shop 5", inventoryValue: 9 },
        { shopName: "Shop 3", inventoryValue: 2 },
        { shopName: "Shop 4", inventoryValue: 2 },
      ],
    });
  });
});