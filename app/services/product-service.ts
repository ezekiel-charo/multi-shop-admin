import api from "~/lib/axios";
import { mapProductWithDerivedFields } from "~/lib/product-data-utils";
import type { Page } from "~/types/page";
import type { Product } from "~/types/product";

export async function getProducts(
  params: URLSearchParams,
): Promise<Page<Product>> {
  const response = await api.get("products", { params });
  return {
    ...response.data,
    data: response.data.data.map(mapProductWithDerivedFields),
  };
}

export async function getProduct(productId: string): Promise<Product> {
  const response = await api.get(`products/${productId}`);
  return mapProductWithDerivedFields(response.data);
}

export async function addProduct(product: Partial<Product>): Promise<Product> {
  const response = await api.post("products", {
    ...product,
    createdAt: Date.now(),
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
