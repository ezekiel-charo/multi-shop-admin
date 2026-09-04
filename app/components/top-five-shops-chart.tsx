"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import type { ShopInventoryValue } from "~/types/dashboard-data";

interface TopFiveShopsChartProps {
  topShops: ShopInventoryValue[];
}

export function TopFiveShopsChart({ topShops }: TopFiveShopsChartProps) {
  const chartConfig = Object.fromEntries(
    topShops.map((shop) => [shop.shopName, { label: shop.shopName }]),
  ) satisfies ChartConfig;

  const chartData = topShops.map((shop, i) => ({
    shop: shop.shopName,
    value: shop.inventoryValue,
    fill: `var(--chart-${i + 1})`,
  }));

  return (
    <div className="border border-gray-100 bg-gray-50 rounded-lg p-3">
      <ChartContainer config={chartConfig} className="mx-auto w-full">
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="shop" hideLabel />}
          />
          <Pie data={chartData} dataKey="value" />
          <ChartLegend
            content={<ChartLegendContent nameKey="shop" />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
