import type { Product } from "~/types/product";
import { Badge } from "./ui/badge";

interface StockStatusBadgeProps {
  product: Product;
}

export default function StockStatusBadge({ product }: StockStatusBadgeProps) {
  let badgeVariant: "default" | "destructive" | "secondary" = "default";
  let stockStatusLabel = "In Stock";

  if (product.stockStatus === "OUT_OF_STOCK") {
    badgeVariant = "destructive";
    stockStatusLabel = "Out of Stock";
  }

  if (product.stockStatus === "LOW_STOCK") {
    badgeVariant = "secondary";
    stockStatusLabel = "Low Stock";
  }

  return <Badge variant={badgeVariant}>{stockStatusLabel}</Badge>;
}
