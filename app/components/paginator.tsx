import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatNumber } from "~/lib/utils";
import type { Page } from "~/types/page";
import type { PaginationParams } from "~/types/pagination-params";

interface PaginatorProps<T> {
  page: Page<T>;
  pageSize: number;
  onPageChange: (params: PaginationParams) => void;
}

export default function Paginator<T>({
  page,
  pageSize,
  onPageChange,
}: PaginatorProps<T>) {
  return (
    <>
      <div className="flex items-center justify-between px-3 py-2 bg-white">
        <div className="text-sm text-gray-600">
          <span className="me-1">Total Items:</span>
          {formatNumber(page.items)}
        </div>
        <div className="flex items-center font-medium">
          <div className="text-sm me-5">
            Page {Number(page.prev) + 1} of {page.pages}
          </div>
          <button
            disabled={!page.prev}
            onClick={() =>
              onPageChange({
                _page: page.prev!,
                _per_page: pageSize,
              })
            }
            className="p-2 me-1 disabled:text-gray-300"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            disabled={!page.next}
            onClick={() => {
              onPageChange({
                _page: page.next!,
                _per_page: pageSize,
              });
            }}
            className="p-2 disabled:text-gray-300"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </>
  );
}
