export interface Shop {
  id: string;
  logoUrl: string;
  shopName: string;
  description: string;
  numProducts: number;
  totalStock: number;
  totalInventoryValue: number;
  createdAt: number;
  contactEmail: string;
  status: "ACTIVE" | "INACTIVE";
}
