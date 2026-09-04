import { formatNumber } from "~/lib/utils";

interface DashboardStatCardProps {
  statTitle: string;
  statValue: number;
}

export default function DashboardStatCard({
  statTitle,
  statValue,
}: DashboardStatCardProps) {
  return (
    <>
      <div className="border border-gray-200 bg-gray-100 rounded-lg p-3">
        <div className="text-xs text-gray-700 mb-1">{statTitle}</div>
        <div className="font-extrabold text-lg text-gray-800">
          {formatNumber(statValue)}
        </div>
      </div>
    </>
  );
}
