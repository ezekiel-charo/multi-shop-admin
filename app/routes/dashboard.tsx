import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "~/components/dashboard-skeleton";
import DashboardStatCard from "~/components/dashboard-stat-card";
import LoadingError from "~/components/loading-error";
import ProductStockStatusChart from "~/components/product-stock-status-chart";
import { TopFiveShopsChart } from "~/components/top-five-shops-chart";
import { getDashboardData } from "~/services/dashboard-service";

export default function Dashboard() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryFn: getDashboardData,
    queryKey: ["dashboard-data"],
  });

  return (
    <>
      <title>Dashboard</title>
      <meta name="description" content="MultiShop Admin Panel dashboard" />

      {isPending && <DashboardSkeleton />}
      {isError && <LoadingError error={error} retry={refetch} />}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
            <DashboardStatCard
              statTitle="Total Shops"
              statValue={data.totalShops}
            />
            <DashboardStatCard
              statTitle="Total Products"
              statValue={data.totalProducts}
            />
            <DashboardStatCard
              statTitle="Total Inventory Value"
              statValue={data.totalInventoryValue}
            />
            <DashboardStatCard
              statTitle="Total Stock"
              statValue={data.totalStock}
            />
            <DashboardStatCard
              statTitle="Low Stock Products"
              statValue={data.numLowStockProducts}
            />
            <DashboardStatCard
              statTitle="Out of Stock Products"
              statValue={data.numOutOfStockProducts}
            />
          </div>
          <div className="grid  lg:grid-cols-2 gap-3">
            <ProductStockStatusChart data={data} />
            <TopFiveShopsChart topShops={data.topShops} />
          </div>
        </>
      )}
    </>
  );
}
