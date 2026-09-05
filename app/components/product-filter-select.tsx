import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select";

interface ProductFilterSelectProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export default function ProductFilterSelect({
  label,
  value,
  options,
  onChange,
}: ProductFilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onChange(nextValue as string)}
    >
      <SelectTrigger
        render={
          <Button
            className={value ? "text-foreground" : undefined}
            variant="outline"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : label}
          </Button>
        }
      />
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
