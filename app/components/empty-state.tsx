import { FolderCode } from "lucide-react";

interface EmptyStateProps {
  isSearchQuery: boolean;
  listName: string;
}

export default function EmptyState({
  isSearchQuery,
  listName,
}: EmptyStateProps) {
  return (
    <div className="h-100 flex flex-col items-center justify-center">
      <div className="inline-block bg-slate-100 p-3 mb-4 rounded-full">
        <FolderCode />
      </div>
      {isSearchQuery ? (
        <>No results found for your search</>
      ) : (
        <>You haven't created any {listName} yet.</>
      )}
    </div>
  );
}
