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
    route("shops/view/:shopId", "./routes/view-shop.tsx"),
    route("products", "./routes/products.tsx"),
    route("products/view/:productId", "./routes/view-product.tsx"),
    layout("./routes/admin-layout.tsx", [
      route("shops/add", "./routes/add-shop.tsx"),
      route("shops/edit/:shopId", "./routes/add-shop.tsx", {
        id: "edit-shop",
      }),
      route("products/add", "./routes/add-product.tsx"),
      route("products/edit/:productId", "./routes/add-product.tsx", {
        id: "edit-product",
      }),
    ]),
  ]),
] satisfies RouteConfig;
