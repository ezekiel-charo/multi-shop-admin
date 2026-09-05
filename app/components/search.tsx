import { debounce } from "~/lib/utils";
import { Input } from "./ui/input";

interface SearchProps {
  value: string;
  onSearch: (searchStr: string) => void;
  onChange: (searchStr: string) => void;
}

export default function Search({ value, onChange, onSearch }: SearchProps) {
  const debouncedSearch = debounce(onSearch, 500);

  return (
    <>
      <Input
        type="search"
        placeholder="Type shop name to search"
        className="lg:max-w-100"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          debouncedSearch(e.target.value);
        }}
      />
    </>
  );
}
