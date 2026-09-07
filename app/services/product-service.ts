import api from "~/lib/axios";
import { mapProductWithDerivedFields } from "~/lib/product-data-utils";
import type { Page } from "~/types/page";
import type { InventoryAdjustment, Product } from "~/types/product";

export async function getProducts(
  params: URLSearchParams,
): Promise<Page<Product>> {
  const response = await api.get("products", { params });
  return {
    ...response.data,
    data: response.data.data.map(mapProductWithDerivedFields),
  };
}

export async function getProductsBySku(sku: string): Promise<Product[]> {
  const response = await api.get("products", { params: { sku } });
  return response.data;
}

export async function getProduct(productId: string): Promise<Product> {
  const params = new URLSearchParams("?_embed=shop&_embed=adjustments");
  const response = await api.get(`products/${productId}`, { params });
  return mapProductWithDerivedFields(response.data);
}

export async function addProduct(product: Partial<Product>): Promise<Product> {
  const response = await api.post("products", {
    ...product,
    createdAt: Date.now(),
    lastUpdatedAt: Date.now(),
  });
  return mapProductWithDerivedFields(response.data);
}

export async function updateProduct(
  productId: string,
  product: Partial<Product>,
): Promise<Product> {
  const response = await api.put(`products/${productId}`, {
    ...product,
    lastUpdatedAt: Date.now(),
  });
  return mapProductWithDerivedFields(response.data);
}

export async function deleteProduct(productId: string): Promise<Product> {
  const response = await api.delete(`products/${productId}`);
  return response.data;
}

export async function adjustProductStock(
  product: Product,
  adjustment: InventoryAdjustment,
): Promise<Product> {
  const { shop, adjustments, ...cleanProduct } = product;
  const _adjustment = (await api.post("adjustments", adjustment)).data;
  product.adjustments?.push(_adjustment);
  const _product = await updateProduct(product.id, cleanProduct);
  return { ..._product, shop, adjustments };
}
