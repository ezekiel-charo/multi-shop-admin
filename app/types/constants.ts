const IS_DEV = import.meta.env.DEV;

export const BASE_URL = IS_DEV
  ? "http://localhost:3300"
  : "https://mock-api-production-ff48.up.railway.app";
export const TOKEN_KEY = "auth_token";

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGINATION_PARAMS = {
  _per_page: `${DEFAULT_PAGE_SIZE}`,
  _page: `${1}`,
};

export const PRODUCT_CATEGORIES = [
  { label: "Food", value: "FOOD" },
  { label: "Other", value: "OTHER" },
];
