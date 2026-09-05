import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

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
import { addShop } from "~/services/shop-service";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "./ui/toast";
import { useState } from "react";

const addShopFormSchema = z.object({
  shopName: z.string().min(1, "Shop name is required."),
  contactEmail: z.email({ message: "Invalid email format" }),
  logoUrl: z.url({ message: "Invalid url" }).or(z.literal("")),
  description: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export default function AddShop() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof addShopFormSchema>>({
    resolver: zodResolver(addShopFormSchema),
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
    mutationFn: addShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      setOpen(false);
      toast.add({
        title: "Successful",
        description: "Shop has been added",
      });
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(_open) => {
          form.reset();
          mutation.reset();
          setOpen(_open);
        }}
      >
        <DialogTrigger render={<Button>Add Shop</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add a Shop</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit((shop) => {
              const s = { ...shop, createdAt: Date.now() };
              mutation.mutate(s);
            })}
            id="add-shop-form"
            className="max-w-2xl"
          >
            <FieldGroup>
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
                  <Field data-invalid={fieldState.invalid}>
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
            </FieldGroup>
          </form>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              form="add-shop-form"
              disabled={mutation.isPending}
              type="submit"
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
