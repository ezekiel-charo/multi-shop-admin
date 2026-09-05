export const SORT_DIRECTION = {
  ASC: "+",
  DESC: "-",
} as const;

export type SortDirection =
  (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];

export interface SortParams {
  sortBy: string;
  direction: SortDirection;
}
