import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { useState } from "react";
import { useSearchParams } from "react-router";
import EmptyState from "~/components/empty-state";
import ErrorState from "~/components/error-state";
import Paginator from "~/components/paginator";
import Search from "~/components/search";
import Table from "~/components/table";
import TableBodyRow from "~/components/table-body-row";
import TableHeadRow from "~/components/table-head-row";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { formatNumber } from "~/lib/utils";
import { getShops } from "~/services/shop-service";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION_PARAMS,
} from "~/types/constants";

export default function Shops() {
  const [searchParams, setSearchParams] = useSearchParams(
    DEFAULT_PAGINATION_PARAMS,
  );

  const [shopName, setShopName] = useState(
    () => searchParams.get("shopName:contains") || "",
  );

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

  return (
    <>
      <div className="flex justify-between gap-4 mb-4">
        <Search
          value={shopName}
          onChange={setShopName}
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
        <Button>Add Shop</Button>
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
                <th>CREATED DATE</th>
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
                  <td></td>
                </TableBodyRow>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
}
