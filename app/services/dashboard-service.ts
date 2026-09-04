import api from "~/lib/axios";
import type { DashboardData } from "~/types/dashboard-data";

export async function getDashboardData(): Promise<DashboardData> {
//   return (await api.get("dashboard")).data;
  const dummyData: DashboardData = {
    numLowStockProducts: 5,
    numOutOfStockProducts: 2,
    totalInventoryValue: 53200900,
    totalProducts: 120,
    totalShops: 254,
    totalStock: 13402,
    topShops: [
      {
        inventoryValue: 1243000,
        shopName: "Big Retail Shop",
      },
      {
        inventoryValue: 320000,
        shopName: "Relax Corner Store",
      },
      {
        inventoryValue: 670000,
        shopName: "Ever-open 24h Shop",
      },
      {
        inventoryValue: 530000,
        shopName: "Late Night Retail",
      },
      {
        inventoryValue: 123000,
        shopName: "Neighbourly Shop",
      },
    ],
  };

  return new Promise((resolve) => {
    resolve(dummyData);
  });
}
