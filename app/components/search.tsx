import { debounce } from "~/lib/utils";
import { useMemo, useRef } from "react";
import { Input } from "./ui/input";

interface SearchProps {
  value: string;
  placeholder: string;
  onSearch: (searchStr: string) => void;
  onChange: (searchStr: string) => void;
}

export default function Search({
  value,
  placeholder,
  onChange,
  onSearch,
}: SearchProps) {
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  const debouncedSearch = useMemo(
    () => debounce((searchStr: string) => onSearchRef.current(searchStr), 500),
    [],
  );

  return (
    <>
      <Input
        type="search"
        placeholder={placeholder}
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
