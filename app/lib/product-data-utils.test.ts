import { describe, expect, it } from "vitest";
import { getStockStatus, mapProductWithDerivedFields } from "./product-data-utils";
import type { Product } from "~/types/product";

describe("product data utilities", () => {
  it.each([
    [0, "OUT_OF_STOCK"],
    [1, "LOW_STOCK"],
    [5, "LOW_STOCK"],
    [6, "IN_STOCK"],
  ] as const)("derives %s units as %s", (stock, expectedStatus) => {
    expect(getStockStatus(stock)).toBe(expectedStatus);
  });

  it("overwrites a stored stock status with the derived status", () => {
    const product = {
      stock: 6,
      stockStatus: "OUT_OF_STOCK",
    } as Product;

    expect(mapProductWithDerivedFields(product).stockStatus).toBe("IN_STOCK");
  });
});