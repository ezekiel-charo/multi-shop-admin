import type { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  paginator?: ReactNode;
}

export default function Table({ children, paginator }: TableProps) {
  return (
    <>
      <div className="rounded-lg border border-[#cdd2d5] overflow-x-scroll overflow-hidden">
        <table className="w-full text-[#646566] text-nowrap">{children}</table>
        {paginator}
      </div>
    </>
  );
}
