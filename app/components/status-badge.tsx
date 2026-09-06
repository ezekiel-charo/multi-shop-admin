import { Badge } from "./ui/badge";

interface ActiveStatusBadgeProps {
  status: "ACTIVE" | "INACTIVE";
}

export default function StatusBadge({ status }: ActiveStatusBadgeProps) {
  let badgeVariant: "secondary" | "destructive" = "secondary";
  let badgeLabel = "Active";

  if (status === "INACTIVE") {
    badgeVariant = "destructive";
    badgeLabel = "Inactive";
  }

  return <Badge variant={badgeVariant}>{badgeLabel}</Badge>;
}
