import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  addProduct,
  getProduct,
  updateProduct,
} from "~/services/product-service";
import { getShops } from "~/services/shop-service";
import { PRODUCT_CATEGORIES } from "~/types/constants";
import { toast } from "../components/ui/toast";
import type { Route } from "./+types/add-product";

const productFormSchema = z.object({
  productName: z.string().min(1, "Product name is required."),
  sku: z.string().min(1, "SKU is required."),
  shopId: z.string().min(1, "Shop is required."),
  category: z.string().min(1, "Category is required."),
  price: z.coerce
    .number({ message: "Price is required." })
    .gt(0, "Price must be greater than zero."),
  stock: z.coerce
    .number({ message: "Stock level is required." })
    .int("Stock must be a whole number.")
    .min(0, "Stock cannot be negative."),
  description: z.string(),
  productImageUrl: z.url({ message: "Invalid url" }).or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type ProductForm = z.infer<typeof productFormSchema>;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const shops = await getShops(new URLSearchParams({ _page: "-1" }));
  const product = params.productId
    ? await getProduct(params.productId)
    : undefined;
  return { shops, product };
}

export default function AddProduct({
  loaderData: { shops, product },
}: Route.ComponentProps) {
  const isEditing = !!product;

  const navigate = useNavigate();

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      sku: "",
      shopId: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
      productImageUrl: "",
      status: "ACTIVE",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ProductForm) => {
      if (isEditing) {
        return updateProduct(product.id, { ...product, ...data });
      }

      return addProduct(data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast.add({
        title: "Successful",
        description: isEditing
          ? "Product has been updated"
          : "Product has been added",
      });

      navigate("/products");
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        productName: product.productName,
        sku: product.sku,
        shopId: product.shopId,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
        productImageUrl: product.productImageUrl,
        status: product.status,
      });
    }
  }, [product, form]);

  return (
    <>
      <Button onClick={() => navigate("/products")} variant="outline">
        <ArrowLeft />
        Back
      </Button>

      <div className="font-bold text-lg my-4">
        {isEditing ? "Edit Product" : "Add a Product"}
      </div>

      <form
        id="product-form"
        className="max-w-3xl"
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      >
        <FieldGroup>
          <FieldGroup className="grid grid-cols-2">
            <Controller
              name="productName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
                  <Input
                    {...field}
                    id="product-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter product name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="sku"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-sku">SKU</FieldLabel>
                  <Input
                    {...field}
                    id="product-sku"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter unique SKU"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="shopId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-shop">Shop</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="product-shop"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select shop" />
                    </SelectTrigger>
                    <SelectContent>
                      {shops.data.map((shop) => (
                        <SelectItem key={shop.id} value={shop.id}>
                          {shop.shopName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-category">Category</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="product-category"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-price">Price</FieldLabel>
                  <Input
                    {...field}
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-invalid={fieldState.invalid}
                    placeholder="0.00"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="stock"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-stock">Stock Level</FieldLabel>
                  <Input
                    {...field}
                    id="product-stock"
                    type="number"
                    min="0"
                    step="1"
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="productImageUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-image-url">
                    Product Image URL
                  </FieldLabel>
                  <Input
                    {...field}
                    id="product-image-url"
                    type="url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://example.com/product.png"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-status">Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="product-status"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor="product-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="product-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter product description"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {mutation.isError && <FieldError errors={[mutation.error]} />}

            <Button
              form="product-form"
              disabled={mutation.isPending}
              type="submit"
              className="col-span-2"
            >
              {mutation.isPending ? "Saving..." : isEditing ? "Update" : "Save"}
            </Button>
          </FieldGroup>
        </FieldGroup>
      </form>
    </>
  );
}
