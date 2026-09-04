import api from "~/lib/axios";
import type { Shop } from "~/types/shop";

export async function getShops(params?: URLSearchParams) {
  const response = await api.get("shops", { params });
  return response.data;
}

export async function addShop(shop: Partial<Shop>) {
  const response = await api.post("shops", shop);
  return response.data;
}

export async function updateShop(shopId: string, shop: Partial<Shop>) {
  const response = await api.put(`shops/${shopId}`, shop);
  return response.data;
}

export async function deleteShop(shopId: string) {
  const response = await api.delete(`shops/${shopId}`);
  return response.data;
}
