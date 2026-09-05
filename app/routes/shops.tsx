"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { ConfirmationDialog } from "~/components/confirmation-dialog";
import EmptyState from "~/components/empty-state";
import ErrorState from "~/components/error-state";
import Paginator from "~/components/paginator";
import Search from "~/components/search";
import Sort from "~/components/sort";
import Table from "~/components/table";
import TableBodyRow from "~/components/table-body-row";
import TableHeadRow from "~/components/table-head-row";
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
import { deleteShop, getShops } from "~/services/shop-service";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION_PARAMS,
} from "~/types/constants";

const defaultParams = {
  ...DEFAULT_PAGINATION_PARAMS,
  /**
   * Sort by `createdAt` DESC by default
   */
  _sort: "-createdAt",
};

export default function Shops() {
  const [searchParams, setSearchParams] = useSearchParams(defaultParams);
  const [shopNameSearch, setShopNameSearch] = useState(
    () => searchParams.get("shopName:contains") || "",
  );

  const [isConfirming, setIsConfirming] = useState(false);

  const {
    data: page,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["shops", searchParams.toString()],
    queryFn: () => getShops(searchParams),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
    onError: (error) => {
      toast.add({ title: "Failed to delete", description: error.message, type: 'error' });
    },
  });

  return (
    <>
      <div className="flex justify-between gap-4 mb-4">
        <Search
          value={shopNameSearch}
          onChange={setShopNameSearch}
          onSearch={(shopName) => {
            const params = new URLSearchParams(searchParams);

            if (shopName) {
              params.set("shopName:contains", shopName);
            } else {
              params.delete("shopName:contains");
            }

            params.set("_page", "1"); // Reset pagination
            setSearchParams(params);
          }}
        />
        <div className="flex items-center gap-2">
          <Sort
            defaultSort={searchParams.get("_sort") || ""}
            items={[
              { label: "Date Created", value: "createdAt" },
              { label: "Shop Name", value: "shopName" },
              { label: "No. of Products", value: "numProducts" },
              { label: "Total Stock", value: "totalStock" },
              { label: "Tota Inventory Value", value: "totalInventoryValue" },
            ]}
            onSort={(sort) => {
              const params = new URLSearchParams(searchParams);
              if (!sort) return;
              params.set("_sort", sort);
              setSearchParams(params);
            }}
          />
          <Button>Add Shop</Button>
        </div>
      </div>

      {isLoading && <Skeleton className="h-100" />}
      {isError && <ErrorState retry={refetch} error={error} />}
      {page?.items === 0 && (
        <EmptyState
          isSearchQuery={searchParams.has("shopName:contains")}
          listName="shops"
        />
      )}

      {page && page.items > 0 && (
        <>
          <Table
            paginator={
              <Paginator
                pageSize={DEFAULT_PAGE_SIZE}
                page={page}
                onPageChange={(pageParams) => {
                  const params = new URLSearchParams(searchParams);

                  Object.entries(pageParams).forEach(([key, value]) => {
                    params.set(key, String(value));
                  });

                  setSearchParams(params);
                }}
              />
            }
          >
            <thead>
              <TableHeadRow>
                <th>SHOP</th>
                <th>DATE CREATED</th>
                <th>NO. OF PRODUCTS</th>
                <th>TOTAL STOCK</th>
                <th>TOTAL INVENTORY VALUE</th>
                <th>ACTIONS</th>
              </TableHeadRow>
            </thead>
            <tbody>
              {page.data.map((shop) => (
                <TableBodyRow key={shop.id}>
                  <td>
                    <div className="flex gap-2">
                      <img
                        className="size-10 rounded-md"
                        src={shop.logoUrl}
                        alt={shop.shopName + " logo"}
                      />
                      <div title={shop.description}>
                        <div className="font-semibold text-black">
                          {shop.shopName}
                        </div>
                        <div className="max-w-50 text-nowrap overflow-hidden text-ellipsis">
                          {shop.description.slice(0, 32)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(shop.createdAt, "dd/MM/yyyy")}</td>
                  <td>{formatNumber(shop.numProducts)}</td>
                  <td>{formatNumber(shop.totalStock)}</td>
                  <td>{formatNumber(shop.totalInventoryValue)}</td>
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
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={mutation.isPending}
                            onClick={() => {
                              setIsConfirming(true);
                            }}
                            variant="destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ConfirmationDialog
                      open={isConfirming}
                      pending={mutation.isPending}
                      dialogTitle={`Delete ${shop.shopName}?`}
                      description="This action cannot be undone"
                      onOpenChange={(confirmed) => {
                        if (confirmed) {
                          mutation.mutate(shop.id);
                        }
                        setIsConfirming(false);
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
