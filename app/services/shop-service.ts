import api from "~/lib/axios";
import type { Page } from "~/types/page";
import type { Shop } from "~/types/shop";

export async function getShops(params: URLSearchParams): Promise<Page<Shop>> {
  const response = await api.get("shops", { params });
  return response.data;
}

export async function addShop(shop: Partial<Shop>): Promise<boolean> {
  const response = await api.post("shops", shop);
  return response.data;
}

export async function updateShop(
  shopId: string,
  shop: Partial<Shop>,
): Promise<boolean> {
  const response = await api.put(`shops/${shopId}`, shop);
  return response.data;
}

export async function deleteShop(shopId: string): Promise<boolean> {
  const response = await api.delete(`shops/${shopId}`);
  return response.data;
}
