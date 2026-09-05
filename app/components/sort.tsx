import { ChevronsUpDown, SortAsc, SortDesc } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  SORT_DIRECTION,
  type SortDirection,
  type SortParams,
} from "~/types/sort-params";
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
  items: { label: string; value: string }[];
  defaultSort: string;
  onSort: (sort: string) => void;
}

export default function Sort({ items, defaultSort, onSort }: SortProps) {
  const [sortValue, setSortValue] = useState<SortParams>(() => {
    return {
      direction: defaultSort.charAt(0) as SortDirection,
      sortBy: defaultSort.substring(1),
    };
  });

  function formatSort({ direction, sortBy }: SortParams) {
    return `${direction}${sortBy}`;
  }

  return (
    <>
      <ButtonGroup>
        <Select
          items={items}
          value={sortValue.sortBy}
          onValueChange={(v) => {
            const value = { ...sortValue, sortBy: v as string };
            setSortValue(value);
            onSort(formatSort(value));
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
            const value = {
              ...sortValue,
              direction:
                sortValue.direction === SORT_DIRECTION.ASC
                  ? SORT_DIRECTION.DESC
                  : SORT_DIRECTION.ASC,
            };
            setSortValue(value);
            onSort(formatSort(value));
          }}
          variant="outline"
        >
          {sortValue.direction === SORT_DIRECTION.ASC ? (
            <SortAsc />
          ) : (
            <SortDesc />
          )}
        </Button>
      </ButtonGroup>
    </>
  );
}
