import api from "~/lib/axios";
import { getStockStatus } from "~/lib/product-data-utils";
import type { DashboardData } from "~/types/dashboard-data";
import type { Product } from "~/types/product";
import type { Shop } from "~/types/shop";

type DashboardShop = Pick<Shop, "id" | "shopName">;
type DashboardProduct = Pick<Product, "shopId" | "price" | "stock">;

export function calculateDashboardData(
  shops: DashboardShop[],
  products: DashboardProduct[],
): DashboardData {
  const inventoryByShopId = new Map<string, number>();
  let totalStock = 0;
  let totalInventoryValue = 0;
  let numLowStockProducts = 0;
  let numOutOfStockProducts = 0;

  for (const product of products) {
    const inventoryValue = product.price * product.stock;
    inventoryByShopId.set(
      product.shopId,
      (inventoryByShopId.get(product.shopId) ?? 0) + inventoryValue,
    );
    totalStock += product.stock;
    totalInventoryValue += inventoryValue;

    const stockStatus = getStockStatus(product.stock);
    if (stockStatus === "LOW_STOCK") {
      numLowStockProducts += 1;
    } else if (stockStatus === "OUT_OF_STOCK") {
      numOutOfStockProducts += 1;
    }
  }

  return {
    totalShops: shops.length,
    totalProducts: products.length,
    totalStock,
    totalInventoryValue,
    numLowStockProducts,
    numOutOfStockProducts,
    topShops: shops
      .map((shop) => ({
        shopName: shop.shopName,
        inventoryValue: inventoryByShopId.get(shop.id) ?? 0,
      }))
      .sort((firstShop, secondShop) =>
        secondShop.inventoryValue - firstShop.inventoryValue,
      )
      .slice(0, 5),
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const [{ data: shops }, { data: products }] = await Promise.all([
    api.get<Shop[]>("shops"),
    api.get<Product[]>("products"),
  ]);

  return calculateDashboardData(shops, products);
}
