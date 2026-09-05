import type { ReactNode } from "react";

interface TableHeadRowProps {
  children: ReactNode;
}

export default function TableHeadRow({ children }: TableHeadRowProps) {
  return (
    <>
      <tr className="text-xs text-black [&_th]:semibold [&_th]:text-start [&_th]:p-4 [&_th]:bg-[#f5f9fa] [&_th]:border-r-2 [&_th]:last:border-r-0 [&_th]:border-[#feffff]">
        {children}
      </tr>
    </>
  );
}
