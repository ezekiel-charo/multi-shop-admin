import { formatDate } from "date-fns";
import { ArrowLeft, Pencil, Wrench } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import Image from "~/components/image";
import StatusBadge from "~/components/status-badge";
import StockAdjustmentDialog from "~/components/stock-adjustment-dialog";
import StockStatusBadge from "~/components/stock-status-badge";
import { Button } from "~/components/ui/button";
import { formatNumber } from "~/lib/utils";
import { getProduct } from "~/services/product-service";
import type { Product } from "~/types/product";
import { useUser } from "~/user-context";
import type { Route } from "./+types/view-product";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!params.productId) return null;
  const product = await getProduct(params.productId);
  return product;
}

export default function ViewProduct({ loaderData }: Route.ComponentProps) {
  const { isAdmin } = useUser();
  const [product, setProduct] = useState<Product | null>(loaderData);
  const [isAdjustingStock, setIsAdjustingStock] = useState(false);

  if (!product) return null;

  const adjustments = product.adjustments;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          render={<Link to="/products" />}
          nativeButton={false}
          variant="outline"
        >
          <ArrowLeft /> Back to products
        </Button>
        {isAdmin && (
          <div className="flex gap-2">
            <Button onClick={() => setIsAdjustingStock(true)} variant="outline">
              <Wrench /> Adjust stock
            </Button>
            <Button
              nativeButton={false}
              render={<Link to={`/products/edit/${product.id}`} />}
            >
              <Pencil /> Edit product
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
        <div className="border border-gray-100 bg-gray-50 rounded-lg p-6">
          <div className="mb-3">
            <div className="mb-5 font-medium">Product information</div>
            <div className="flex items-start gap-4">
              <Image
                className="size-20 rounded-md object-cover"
                src={product.productImageUrl}
                alt={`${product.productName} image`}
              />
              <div>
                <div className="text-xl font-medium">{product.productName}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm">SKU: {product.sku}</span>
                  <StatusBadge status={product.status} />
                </div>
              </div>
            </div>
          </div>
          <div className="gap-5">
            <p className="text-sm text-muted-foreground mb-6">
              {product.description || "No description"}
            </p>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <DetailItem label="Category" value={product.category} />
              <DetailItem label="Price" value={formatNumber(product.price)} />
              <DetailItem
                label="Created"
                value={formatDate(product.createdAt, "dd/MM/yyyy HH:mm")}
              />
              <DetailItem
                label="Last updated"
                value={formatDate(product.lastUpdatedAt, "dd/MM/yyyy HH:mm")}
              />
            </dl>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
          <MetricCard
            label="Current stock"
            value={formatNumber(product.stock)}
          />
          <MetricCard
            label="Stock status"
            value={<StockStatusBadge product={product} />}
          />
          <MetricCard
            label="Inventory value"
            value={formatNumber(product.price * product.stock)}
          />
        </div>
      </div>

      <div className="border border-gray-100 bg-gray-50 rounded-lg p-6">
        <div className="mb-5 font-medium">Shop information</div>
        <Link
          className="inline-flex items-center gap-2 hover:underline"
          to={`/shops/view/${product.shop.id}`}
        >
          <Image
            className="size-12 rounded-md object-cover"
            src={product.shop.logoUrl}
            alt={`${product.shop.shopName} logo`}
          />
          {product.shop.shopName}
        </Link>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          <DetailItem label="Contact email" value={product.shop.contactEmail} />
          <DetailItem label="Status" value={product.shop.status} />
          <DetailItem
            label="Description"
            value={product.shop.description || "No description"}
          />
        </dl>
      </div>

      <div className="border border-gray-100 bg-gray-50 rounded-lg p-6">
        <div className="mb-5 font-medium">Adjustment history</div>
        {!adjustments?.length ? (
          <p className="text-sm text-muted-foreground">
            No inventory adjustments have been recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="pb-3 pe-4">DATE</th>
                  <th className="pb-3 pe-4">CHANGE</th>
                  <th className="pb-3 pe-4">STOCK</th>
                  <th className="pb-3 pe-4">REASON</th>
                  <th className="pb-3">ADJUSTED BY</th>
                </tr>
              </thead>
              <tbody>
                {adjustments?.map((adjustment) => (
                  <tr className="border-b last:border-0" key={adjustment.id}>
                    <td className="py-3 pe-4 whitespace-nowrap">
                      {formatDate(adjustment.adjustedAt, "dd/MM/yyyy HH:mm")}
                    </td>
                    <td
                      className={`py-3 pe-4 font-semibold ${adjustment.quantity > 0 ? "text-green-700" : "text-destructive"}`}
                    >
                      {adjustment.quantity > 0 ? "+" : ""}
                      {formatNumber(adjustment.quantity)}
                    </td>
                    <td className="py-3 pe-4 whitespace-nowrap">
                      {formatNumber(adjustment.previousStock)} →{" "}
                      {formatNumber(adjustment.newStock)}
                    </td>
                    <td className="py-3 pe-4">{adjustment.reason}</td>
                    <td className="py-3 whitespace-nowrap">
                      {adjustment.adjustedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StockAdjustmentDialog
        open={isAdjustingStock}
        product={product}
        onOpenChange={setIsAdjustingStock}
        onSuccess={setProduct}
      />
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | ReactNode;
}) {
  return (
    <div className="border border-gray-100 bg-gray-50 rounded-lg p-6">
      <div className="text-xs text-muted-foreground mb-2">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
