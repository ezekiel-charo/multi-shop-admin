import type { ReactNode } from "react";

interface TableBodyRowProps {
  children: ReactNode;
}

export default function TableBodyRow({ children }: TableBodyRowProps) {
  return (
    <>
      <tr className="border-b border-gray-200 text-sm [&_td]:semibold [&_td]:text-start [&_td]:py-3 [&_td]:px-4 [&_td]:bg-white [&_td]:border-r-2 [&_td]:border-[#feffff]">
        {children}
      </tr>
    </>
  );
}
