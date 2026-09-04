import { TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";

interface LoadingErrorProps {
  error: Error;
  retry: () => void;
}
export default function LoadingError({ error, retry }: LoadingErrorProps) {
  return (
    <>
      <div
        aria-label="Loading error"
        className="p-12 w-full flex flex-col items-center justify-center"
      >
        <TriangleAlert className="size-16 text-red-700" />
        <div className="font-bold text-red-700">{error.name}</div>
        <div className="text-sm text-red-700 mb-4">{error.message}</div>
        <Button onClick={() => retry()}>Retry</Button>
      </div>
    </>
  );
}
