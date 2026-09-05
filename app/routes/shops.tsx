import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { useSearchParams } from "react-router";
import Paginator from "~/components/paginator";
import Table from "~/components/table";
import TableBodyRow from "~/components/table-body-row";
import TableHeadRow from "~/components/table-head-row";
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

  const { data: page, isLoading } = useQuery({
    queryKey: ["shops", ...searchParams],
    queryFn: () => getShops(searchParams),
  });

  return (
    <>
      {isLoading && <Skeleton className="h-100" />}

      {page && (
        <>
          <Table
            paginator={
              <Paginator
                pageSize={DEFAULT_PAGE_SIZE}
                page={page}
                onPageChange={(params) => {
                  setSearchParams({ ...searchParams, ...params });
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
