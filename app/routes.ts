import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("./routes/index.tsx"),
  route("login", "./routes/login.tsx"),
  layout("./routes/main-layout.tsx", [
    route("dashboard", "./routes/dashboard.tsx"),
    route("shops", "./routes/shops.tsx"),
    route("shops/add", "./routes/add-shop.tsx"),
    route("shops/edit/:shopId", "./routes/add-shop.tsx", { id: "edit-shop" }),
    route("products", "./routes/products.tsx"),
  ]),
] satisfies RouteConfig;
