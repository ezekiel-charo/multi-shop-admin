import { ChevronsUpDown, SortAsc, SortDesc } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { type SortOptions } from "~/types/sort-options";
import { ButtonGroup } from "./ui/button-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "./ui/select";

interface SortProps {
  items: SortOptions[];
  defaultSort: string;
  onSort: (sort: string) => void;
}

export default function Sort({ items, defaultSort, onSort }: SortProps) {
  const [sortValue, setSortValue] = useState<string | null>(() =>
    defaultSort.substring(1),
  );
  const [isDescending, setIsDescending] = useState(
    () => defaultSort.charAt(0) === "-",
  );

  function applySort(sortBy: string | null, descending: boolean) {
    onSort(`${descending ? "-" : ""}${sortBy}`);
  }

  return (
    <>
      <ButtonGroup>
        <Select
          value={sortValue}
          onValueChange={(value) => {
            setSortValue(value);
            applySort(value, isDescending);
          }}
        >
          <SelectTrigger
            render={
              <Button variant="outline">
                <ChevronsUpDown /> Sort
              </Button>
            }
          ></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            setIsDescending(!isDescending);
            applySort(sortValue, !isDescending);
          }}
          variant="outline"
        >
          {isDescending ? <SortAsc /> : <SortDesc />}
        </Button>
      </ButtonGroup>
    </>
  );
}
