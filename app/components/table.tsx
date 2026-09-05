import type { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  paginator?: ReactNode;
}

export default function Table({ children, paginator }: TableProps) {
  return (
    <>
      <div className="rounded-lg border border-[#cdd2d5] overflow-hidden">
        <table className="w-full text-[#646566]">{children}</table>
        {paginator}
      </div>
    </>
  );
}
