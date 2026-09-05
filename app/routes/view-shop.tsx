import { Building2 } from "lucide-react";
import { formatNumber } from "~/lib/utils";
import { getShop } from "~/services/shop-service";
import type { Route } from "./+types/view-shop";
import { Badge } from "~/components/ui/badge";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (params.shopId) {
    const shop = await getShop(params.shopId);
    return shop;
  }
}

export default function ViewShop({ loaderData: shop }: Route.ComponentProps) {
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
              <Badge
                className="ms-2"
                variant={
                  shop?.status === "ACTIVE" ? "secondary" : "destructive"
                }
              >
                {shop?.status}
              </Badge>
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
            <tr>
              <td>Total Products</td>
              <td>{formatNumber(shop?.numProducts)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div className="font-semibold">Products</div>
        {/* TODO: List shop's products */}
      </div>
    </>
  );
}
