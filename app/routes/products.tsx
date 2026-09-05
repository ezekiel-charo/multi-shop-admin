"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { Building2, EllipsisVertical, X } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ConfirmationDialog } from "~/components/confirmation-dialog";
import EmptyState from "~/components/empty-state";
import ErrorState from "~/components/error-state";
import Paginator from "~/components/paginator";
import ProductFilterSelect from "~/components/product-filter-select";
import Search from "~/components/search";
import Sort from "~/components/sort";
import Table from "~/components/table";
import TableBodyRow from "~/components/table-body-row";
import TableHeadRow from "~/components/table-head-row";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "~/components/ui/toast";
import { formatNumber } from "~/lib/utils";
import { deleteProduct, getProducts } from "~/services/product-service";
import { getShops } from "~/services/shop-service";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION_PARAMS,
} from "~/types/constants";
import type { PaginationParams } from "~/types/pagination-params";
import type { Product, StockStatus } from "~/types/product";
import { useUser } from "~/user-context";

const defaultParams = {
  ...DEFAULT_PAGINATION_PARAMS,

  /**
   * Include the product's shop in the response
   */
  _embed: "shop",

  /**
   * Sort by `lastUpdatedAt` DESC by default
   */
  _sort: "-lastUpdatedAt",
};

const sortingOptions = [
  { label: "Product Name", value: "productName" },
  { label: "Price", value: "price" },
  { label: "Stock", value: "stock" },
  { label: "Last-updated Date", value: "lastUpdatedAt" },
];

const stockStatusOptions: { label: string; value: StockStatus }[] = [
  { label: "In stock", value: "IN_STOCK" },
  { label: "Low stock", value: "LOW_STOCK" },
  { label: "Out of stock", value: "OUT_OF_STOCK" },
];

export default function Products() {
  const { isAdmin } = useUser();
  const [searchParams, setSearchParams] = useSearchParams(defaultParams);
  const [productNameSearch, setProductNameSearch] = useState(
    () => searchParams.get("productName:contains") || "",
  );

  const { data: filterOptions } = useQuery({
    queryKey: ["products", "filter-options"],
    queryFn: async () => {
      const [shops, products] = await Promise.all([
        getShops(new URLSearchParams({ _page: "1", _per_page: "1000" })),
        getProducts(new URLSearchParams({ _page: "1", _per_page: "1000" })),
      ]);

      return {
        shops,
        categories: [
          ...new Set(products.data.map((product) => product.category)),
        ],
      };
    },
  });

  const [isConfirming, setIsConfirming] = useState<Product | null>();

  const {
    data: page,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", searchParams.toString()],
    queryFn: () => getProducts(searchParams),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.add({
        title: "Product deleted",
        description: "Product deleted successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        title: "Failed to delete product",
        description: error.message,
        type: "error",
      });
    },
  });

  function searchByProductName(productName: string) {
    const params = new URLSearchParams(searchParams);

    if (productName) {
      params.set("productName:contains", productName);
    } else {
      params.delete("productName:contains");
    }

    params.set("_page", "1"); // Reset pagination
    setSearchParams(params);
  }

  function sortProducts(sort: string) {
    const params = new URLSearchParams(searchParams);
    if (!sort) return;
    params.set("_sort", sort);
    setSearchParams(params);
  }

  function filterProducts(filter: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(filter, value);
    } else {
      params.delete(filter);
    }

    params.set("_page", "1");
    setSearchParams(params);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams);
    ["shopId", "category", "stockStatus"].forEach((filter) => {
      params.delete(filter);
    });
    params.set("_page", "1");
    setSearchParams(params);
  }

  const hasActiveFilters = ["shopId", "category", "stockStatus"].some(
    (filter) => searchParams.has(filter),
  );

  function onPageChange(pageInfo: PaginationParams) {
    const params = new URLSearchParams(searchParams);

    Object.entries(pageInfo).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    setSearchParams(params);
  }

  return (
    <>
      <div className="flex justify-between gap-4 mb-4">
        <Search
          placeholder="Type product name to search"
          value={productNameSearch}
          onChange={setProductNameSearch}
          onSearch={searchByProductName}
        />
        <div className="flex items-center gap-2">
          <ProductFilterSelect
            label="Filter by shop"
            value={searchParams.get("shopId") || ""}
            options={
              filterOptions?.shops.data.map((shop) => ({
                label: shop.shopName,
                value: shop.id,
              })) || []
            }
            onChange={(value) => filterProducts("shopId", value)}
          />
          <ProductFilterSelect
            label="Filter by category"
            value={searchParams.get("category") || ""}
            options={
              filterOptions?.categories.map((category) => ({
                label: category,
                value: category,
              })) || []
            }
            onChange={(value) => filterProducts("category", value)}
          />
          <ProductFilterSelect
            label="Filter by stock status"
            value={searchParams.get("stockStatus") || ""}
            options={stockStatusOptions}
            onChange={(value) => filterProducts("stockStatus", value)}
          />
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <X /> Clear filters
            </Button>
          )}
          <Sort
            defaultSort={searchParams.get("_sort") || ""}
            items={sortingOptions}
            onSort={sortProducts}
          />
          {isAdmin && (
            <Link to="add">
              <Button>Add Product</Button>
            </Link>
          )}
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
        <>
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
                <th>SHOP</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STOCK STATUS</th>
                <th>LAST UPDATED</th>
                <th>ACTIONS</th>
              </TableHeadRow>
            </thead>
            <tbody>
              {page.data.map((product) => (
                <TableBodyRow key={product.id}>
                  <td>
                    <div className="flex gap-2">
                      {product.productImageUrl ? (
                        <img
                          className="size-10 rounded-md"
                          src={product.productImageUrl}
                          alt={product.productName + " image"}
                        />
                      ) : (
                        <Building2 className="size-10" />
                      )}
                      <div>
                        <div className="font-semibold text-black mb-1">
                          {product.productName}
                          <Badge
                            className="ms-2 py-0"
                            variant={
                              product.status === "ACTIVE"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {product.status}
                          </Badge>
                        </div>
                        <div className="xs">SKU {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td>{product.shop.shopName}</td>
                  <td>{product.category}</td>
                  <td className="text-end">{formatNumber(product.price)}</td>
                  <td>{formatNumber(product.stock)}</td>
                  <td>{product.stockStatus}</td>
                  <td>{formatDate(product.lastUpdatedAt, "dd/MM/yyyy")}</td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="secondary">
                            <EllipsisVertical />
                          </Button>
                        }
                      />
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Link to={`view/${product.id}`}>
                            <DropdownMenuItem>View</DropdownMenuItem>
                          </Link>
                          {isAdmin && (
                            <>
                              <Link to={`edit/${product.id}`}>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                disabled={mutation.isPending}
                                onClick={() => {
                                  setIsConfirming(product);
                                }}
                                variant="destructive"
                              >
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ConfirmationDialog
                      open={!!isConfirming}
                      pending={mutation.isPending}
                      dialogTitle={`Delete ${isConfirming?.productName}?`}
                      description="This action cannot be undone"
                      onOpenChange={(confirmed) => {
                        if (confirmed) {
                          mutation.mutate(product.id);
                        }
                        setIsConfirming(null);
                      }}
                    />
                  </td>
                </TableBodyRow>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
}
