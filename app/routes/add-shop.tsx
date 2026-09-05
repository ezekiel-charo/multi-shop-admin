import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

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
import { addShop, getShop, updateShop } from "~/services/shop-service";
import { toast } from "../components/ui/toast";
import type { Route } from "./+types/add-shop";
import { ArrowLeft } from "lucide-react";

const shopFormSchema = z.object({
  shopName: z.string().min(1, "Shop name is required."),
  contactEmail: z.email({ message: "Invalid email format" }),
  logoUrl: z.url({ message: "Invalid url" }).or(z.literal("")),
  description: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type ShopForm = z.infer<typeof shopFormSchema>;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (params.shopId) {
    const shop = await getShop(params.shopId);
    return shop;
  }
}

export default function AddShop({ loaderData: shop }: Route.ComponentProps) {
  const isEditing = !!shop;

  const navigate = useNavigate();

  const form = useForm<ShopForm>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      shopName: "",
      description: "",
      logoUrl: "",
      contactEmail: "",
      status: "ACTIVE",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ShopForm) => {
      if (isEditing) {
        return updateShop(shop.id, data);
      }

      return addShop(data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });

      toast.add({
        title: "Successful",
        description: isEditing
          ? "Shop has been updated"
          : "Shop has been added",
      });

      navigate("/shops");
    },
  });

  useEffect(() => {
    if (shop) {
      form.reset({
        shopName: shop.shopName,
        contactEmail: shop.contactEmail,
        logoUrl: shop.logoUrl,
        description: shop.description,
        status: shop.status,
      });
    }
  }, [shop, form]);

  return (
    <>
      <Button onClick={() => navigate("/shops")} variant="outline">
        <ArrowLeft />
        Back
      </Button>

      <div className="font-bold text-lg my-4">
        {isEditing ? "Edit Shop" : "Add a Shop"}
      </div>

      <form
        id="shop-form"
        className="max-w-3xl"
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      >
        <FieldGroup>
          <FieldGroup className="grid grid-cols-2">
            <Controller
              name="shopName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="shop-name">Shop Name</FieldLabel>
                  <Input
                    {...field}
                    id="shop-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter shop name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="contactEmail"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="shop-contact-email">
                    Contact Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="shop-contact-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="shop@example.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="logoUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="shop-logo-url">Logo URL</FieldLabel>
                  <Input
                    {...field}
                    id="shop-logo-url"
                    type="url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://example.com/logo.png"
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
                  <FieldLabel htmlFor="shop-status">Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="shop-status"
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
                  <FieldLabel htmlFor="shop-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="shop-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter shop description"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {mutation.isError && <FieldError errors={[mutation.error]} />}

            <Button
              form="shop-form"
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
