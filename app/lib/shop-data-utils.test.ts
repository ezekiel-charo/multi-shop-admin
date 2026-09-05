import { describe, expect, it } from "vitest";
import {
  getShopDerivedFields,
  mapShopWithDerivedFields,
} from "./shop-data-utils";
import type { Shop } from "~/types/shop";

const products = [
  { price: 10, stock: 3 },
  { price: 25, stock: 2 },
] as Shop["products"];

describe("shop data utilities", () => {
  it("calculates shop product count, stock, and inventory value", () => {
    expect(getShopDerivedFields(products)).toEqual({
      numProducts: 2,
      totalStock: 5,
      totalInventoryValue: 80,
    });
  });

  it("returns zeroed derived fields when a shop has no products", () => {
    expect(getShopDerivedFields()).toEqual({
      numProducts: 0,
      totalStock: 0,
      totalInventoryValue: 0,
    });
  });

  it("maps derived fields and excludes embedded products", () => {
    const shop = {
      id: "shop-1",
      logoUrl: "",
      shopName: "Shop 1",
      description: "",
      createdAt: 0,
      contactEmail: "shop@example.com",
      status: "ACTIVE" as const,
      products,
    } as Shop;

    expect(mapShopWithDerivedFields(shop)).toEqual({
      id: "shop-1",
      logoUrl: "",
      shopName: "Shop 1",
      description: "",
      createdAt: 0,
      contactEmail: "shop@example.com",
      status: "ACTIVE",
      numProducts: 2,
      totalStock: 5,
      totalInventoryValue: 80,
    });
  });
});
