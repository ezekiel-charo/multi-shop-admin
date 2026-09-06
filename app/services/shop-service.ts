import api from "~/lib/axios";
import { mapShopWithDerivedFields } from "~/lib/shop-data-utils";
import type { Page } from "~/types/page";
import type { Shop } from "~/types/shop";

export async function getShops(params: URLSearchParams): Promise<Page<Shop>> {
  const { data: shopPage } = await api.get("shops", { params });
  return {
    ...shopPage,
    data: shopPage.data.map(mapShopWithDerivedFields),
  };
}

export async function getShop(shopId: string): Promise<Shop> {
  const response = await api.get(`shops/${shopId}`, {
    params: { _embed: "products" },
  });
  return mapShopWithDerivedFields(response.data);
}

export async function addShop(shop: Partial<Shop>): Promise<Shop> {
  const response = await api.post("shops", {
    ...shop,
    createdAt: Date.now(),
    lastUpdatedAt: Date.now(),
  });
  return response.data;
}

export async function updateShop(
  shopId: string,
  shop: Partial<Shop>,
): Promise<Shop> {
  const response = await api.put(`shops/${shopId}`, {
    ...shop,
    lastUpdatedAt: Date.now(),
  });
  return response.data;
}

export async function deleteShop(shopId: string): Promise<Shop> {
  const response = await api.delete(`shops/${shopId}`);
  return response.data;
}
