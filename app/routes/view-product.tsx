"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import {
  ArrowLeft,
  Building2,
  Package,
  Pencil,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/toast";
import { formatNumber } from "~/lib/utils";
import { getProduct, updateProduct } from "~/services/product-service";
import { getShop } from "~/services/shop-service";
import type { InventoryAdjustment, Product } from "~/types/product";
import type { Route } from "./+types/view-product";
import { useUser } from "~/user-context";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!params.productId) return null;

  const product = await getProduct(params.productId);
  const shop = await getShop(product.shopId);

  return { ...product, shop };
}

export default function ViewProduct({ loaderData }: Route.ComponentProps) {
  const { isAdmin, user } = useUser();
  const [product, setProduct] = useState<Product | null>(loaderData);
  const [isAdjustingStock, setIsAdjustingStock] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState("");
  const queryClient = useQueryClient();

  const adjustmentMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("Product not found");

      const adjustmentQuantity = Number(quantity);
      if (!Number.isInteger(adjustmentQuantity) || adjustmentQuantity === 0) {
        throw new Error("Enter a non-zero whole number.");
      }

      const newStock = product.stock + adjustmentQuantity;
      if (newStock < 0) {
        throw new Error("Stock cannot be negative.");
      }

      const adjustment: InventoryAdjustment = {
        id: crypto.randomUUID(),
        quantity: adjustmentQuantity,
        previousStock: product.stock,
        newStock,
        reason: reason.trim() || "Stock adjustment",
        adjustedAt: Date.now(),
        adjustedBy: user?.name || "Administrator",
      };

      return updateProduct(product.id, {
        stock: newStock,
        inventoryAdjustments: [
          adjustment,
          ...(product.inventoryAdjustments || []),
        ],
      });
    },
    onSuccess: (updatedProduct) => {
      if (!product) return;

      setProduct({ ...updatedProduct, shop: product.shop });
      setQuantity("");
      setReason("");
      setValidationError("");
      setIsAdjustingStock(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.add({
        title: "Stock updated",
        description: "The inventory adjustment was saved.",
        type: "success",
      });
    },
    onError: (error) => {
      setValidationError(error.message);
    },
  });

  if (!product) return null;

  const adjustments = [...(product.inventoryAdjustments || [])].sort(
    (a, b) => b.adjustedAt - a.adjustedAt,
  );

  function openAdjustmentDialog() {
    setValidationError("");
    setIsAdjustingStock(true);
  }

  function closeAdjustmentDialog(open: boolean) {
    if (!open && !adjustmentMutation.isPending) {
      setIsAdjustingStock(false);
      setValidationError("");
    }
  }

  function submitAdjustment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    adjustmentMutation.mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button render={<Link to="/products" />} variant="outline">
          <ArrowLeft /> Back to products
        </Button>
        {isAdmin && (
          <div className="flex gap-2">
            <Button onClick={openAdjustmentDialog} variant="outline">
              <SlidersHorizontal /> Adjust stock
            </Button>
            <Button render={<Link to={`/products/edit/${product.id}`} />}>
              <Pencil /> Edit product
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
        <Card>
          <CardHeader>
            <CardDescription>Product information</CardDescription>
            <div className="flex items-start gap-4">
              {product.productImageUrl ? (
                <img
                  className="size-20 rounded-md object-cover"
                  src={product.productImageUrl}
                  alt={`${product.productName} image`}
                />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-md bg-muted">
                  <Package className="size-9 text-muted-foreground" />
                </div>
              )}
              <div>
                <CardTitle className="text-xl">{product.productName}</CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">SKU {product.sku}</Badge>
                  <Badge
                    variant={
                      product.status === "ACTIVE" ? "secondary" : "destructive"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="gap-5">
            <p className="text-sm text-muted-foreground">
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
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
          <MetricCard
            label="Current stock"
            value={formatNumber(product.stock)}
          />
          <MetricCard label="Stock status" value={product.stockStatus} />
          <MetricCard
            label="Inventory value"
            value={formatNumber(product.price * product.stock)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Shop information</CardDescription>
          <CardTitle>
            <Link
              className="inline-flex items-center gap-2 hover:underline"
              to={`/shops/view/${product.shop.id}`}
            >
              {product.shop.logoUrl ? (
                <img
                  className="size-8 rounded-md object-cover"
                  src={product.shop.logoUrl}
                  alt={`${product.shop.shopName} logo`}
                />
              ) : (
                <Building2 className="size-8" />
              )}
              {product.shop.shopName}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
            <DetailItem
              label="Contact email"
              value={product.shop.contactEmail}
            />
            <DetailItem label="Status" value={product.shop.status} />
            <DetailItem
              label="Description"
              value={product.shop.description || "No description"}
            />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Inventory activity</CardDescription>
          <CardTitle>Adjustment history</CardTitle>
        </CardHeader>
        <CardContent>
          {adjustments.length === 0 ? (
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
                  {adjustments.map((adjustment) => (
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
        </CardContent>
      </Card>

      <Dialog open={isAdjustingStock} onOpenChange={closeAdjustmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust stock</DialogTitle>
            <DialogDescription>
              Current stock: {formatNumber(product.stock)}. Use a positive
              number to add stock or a negative number to remove it.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitAdjustment}>
            <Field>
              <FieldLabel htmlFor="stock-adjustment">
                Stock adjustment
              </FieldLabel>
              <Input
                autoFocus
                id="stock-adjustment"
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="e.g. 25 or -5"
                step="1"
                type="number"
                value={quantity}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="stock-adjustment-reason">Reason</FieldLabel>
              <Textarea
                id="stock-adjustment-reason"
                onChange={(event) => setReason(event.target.value)}
                placeholder="Optional note"
                value={reason}
              />
            </Field>
            {validationError && <FieldError>{validationError}</FieldError>}
            <DialogFooter>
              <Button
                disabled={adjustmentMutation.isPending}
                onClick={() => closeAdjustmentDialog(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={adjustmentMutation.isPending} type="submit">
                {adjustmentMutation.isPending ? "Saving..." : "Save adjustment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardContent>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
