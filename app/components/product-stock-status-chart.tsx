"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import type { DashboardData } from "~/types/dashboard-data";

interface ProductStockStatusChartProps {
  data: DashboardData;
}

const chartConfig = {
  products: {
    label: "Products",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export default function ProductStockStatusChart({
  data,
}: ProductStockStatusChartProps) {
  const chartData = [
    { status: "In Stock", products: data?.totalProducts },
    { status: "Low Stock", products: data?.numLowStockProducts },
    { status: "Out of Stock", products: data?.numOutOfStockProducts },
  ];

  return (
    <div className="border border-gray-100 bg-gray-50 rounded-lg p-3">
      <div className="font-semibold text-base text-gray-800">
        Product Stock Status
      </div>
      <div className="text-gray-500 text-xs">
        Number of product per stock status
      </div>
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="status"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="products" fill="var(--primary)" radius={8}>
            <LabelList
              dataKey="products"
              position="center"
              offset={8}
              className="fill-white font-extrabold"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
