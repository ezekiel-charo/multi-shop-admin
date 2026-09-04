export interface Shop {
  logoUrl: string;
  shopName: string;
  description: string;
  numberOfProducts: number;
  totalStock: number;
  totalInventoryValue: number;
  createdDate: number;
  contactEmail: string;
  status: "ACTIVE" | "INACTIVE";
}
