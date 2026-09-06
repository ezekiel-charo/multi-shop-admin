"use client";

import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import EmptyState from "~/components/empty-state";
import ErrorState from "~/components/error-state";
import Paginator from "~/components/paginator";
import Search from "~/components/search";
import Sort from "~/components/sort";
import StatusBadge from "~/components/status-badge";
import StockStatusBadge from "~/components/stock-status-badge";
import Table from "~/components/table";
import TableBodyRow from "~/components/table-body-row";
import TableHeadRow from "~/components/table-head-row";
import { Skeleton } from "~/components/ui/skeleton";
import { formatNumber } from "~/lib/utils";
import { getProducts } from "~/services/product-service";
import { getShop } from "~/services/shop-service";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION_PARAMS,
} from "~/types/constants";
import type { PaginationParams } from "~/types/pagination-params";
import type { Route } from "./+types/view-shop";

const sortingOptions = [
  { label: "Product Name", value: "productName" },
  { label: "Price", value: "price" },
  { label: "Stock", value: "stock" },
  { label: "Last-updated Date", value: "lastUpdatedAt" },
];

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (params.shopId) {
    const shop = await getShop(params.shopId);
    return shop;
  }
}

export default function ViewShop({ loaderData: shop }: Route.ComponentProps) {
  const defaultParams = {
    ...DEFAULT_PAGINATION_PARAMS,
    shopId: shop?.id || "",
    _embed: "shop",
    _sort: "-lastUpdatedAt",
  };
  const [searchParams, setSearchParams] = useSearchParams(defaultParams);
  const [productNameSearch, setProductNameSearch] = useState(
    () => searchParams.get("productName:contains") || "",
  );

  const {
    data: page,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["shop-products", shop?.id, searchParams.toString()],
    queryFn: () => getProducts(searchParams),
    enabled: !!shop?.id,
  });

  function searchProducts(productName: string) {
    const params = new URLSearchParams(searchParams);

    if (productName) {
      params.set("productName:contains", productName);
    } else {
      params.delete("productName:contains");
    }

    params.set("_page", "1");
    setSearchParams(params);
  }

  function sortProducts(sort: string) {
    if (!sort) return;

    const params = new URLSearchParams(searchParams);
    params.set("_sort", sort);
    setSearchParams(params);
  }

  function onPageChange(pageInfo: PaginationParams) {
    const params = new URLSearchParams(searchParams);

    Object.entries(pageInfo).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    setSearchParams(params);
  }

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8 pb-8 mb-4 border-b border-b-gray-100 ">
        <div className="flex gap-4">
          {shop?.logoUrl ? (
            <img
              className="size-24 rounded-md"
              src={shop.logoUrl}
              alt={shop.shopName + " logo"}
            />
          ) : (
            <Building2 className="size-24" />
          )}

          <div className="flex flex-col gap-1">
            <div className="font-semibold text-black text-lg">
              {shop?.shopName}
              <StatusBadge status={shop?.status || "INACTIVE"} />
            </div>

            <div className="text-sm">
              {shop?.description ? (
                shop.description
              ) : (
                <span className="text-xs text-gray-300">No description</span>
              )}
            </div>
          </div>
        </div>

        <table className="w-full [&_td]:py-1 [&_td]:border-b [&_td]:border-b-gray-200 [&_td]:first-of-type:text-sm [&_td]:first-of-type:text-gray-600 [&_td]:last-of-type:font-semibold [&_td]:last-of-type:text-end">
          <tbody>
            <tr>
              <td>Total Products</td>
              <td>{formatNumber(shop?.numProducts)}</td>
            </tr>
            <tr>
              <td>Total Stock</td>
              <td>{formatNumber(shop?.totalStock)}</td>
            </tr>
            <tr>
              <td>Total Inventory Value</td>
              <td>{formatNumber(shop?.totalInventoryValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div className="flex justify-between gap-4 mb-4">
          <div className="font-semibold">Products</div>
          <div className="flex items-center gap-2">
            <Search
              placeholder="Type product name to search"
              value={productNameSearch}
              onChange={setProductNameSearch}
              onSearch={searchProducts}
            />
            <Sort
              defaultSort={searchParams.get("_sort") || ""}
              items={sortingOptions}
              onSort={sortProducts}
            />
          </div>
        </div>

        {isLoading && <Skeleton className="h-100" />}

        {isError && <ErrorState retry={refetch} error={error} />}

        {page?.items === 0 && (
          <EmptyState
            isSearchQuery={searchParams.has("productName:contains")}
            listName="products"
          />
        )}

        {page && page.items > 0 && (
          <Table
            paginator={
              <Paginator
                pageSize={DEFAULT_PAGE_SIZE}
                page={page}
                onPageChange={onPageChange}
              />
            }
          >
            <thead>
              <TableHeadRow>
                <th>PRODUCT NAME</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STOCK STATUS</th>
                <th>LAST UPDATED</th>
              </TableHeadRow>
            </thead>
            <tbody>
              {page.data.map((product) => (
                <TableBodyRow key={product.id}>
                  <td>
                    <Link
                      className="font-semibold text-black"
                      to={`/products/view/${product.id}`}
                    >
                      {product.productName}
                    </Link>
                    <div className="text-xs">SKU: {product.sku}</div>
                  </td>
                  <td>{product.category}</td>
                  <td className="text-end">{formatNumber(product.price)}</td>
                  <td>{formatNumber(product.stock)}</td>
                  <td>
                    <StockStatusBadge product={product} />
                  </td>
                  <td>{formatDate(product.lastUpdatedAt, "dd/MM/yyyy")}</td>
                </TableBodyRow>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
}
