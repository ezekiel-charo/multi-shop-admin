import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { formatNumber } from "~/lib/utils";
import { adjustProductStock } from "~/services/product-service";
import type { InventoryAdjustment, Product } from "~/types/product";
import { useUser } from "~/user-context";
import { toast } from "./ui/toast";

interface StockAdjustmentFormValues {
  quantity: string | number;
  reason: string;
}

interface StockAdjustmentDialogProps {
  open: boolean;
  product?: Product | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (result: Product) => void;
  onError?: (error: Error) => void;
}

export default function StockAdjustmentDialog({
  open,
  product,
  onOpenChange,
  onSuccess,
  onError,
}: StockAdjustmentDialogProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const form = useForm<StockAdjustmentFormValues>({
    defaultValues: {
      quantity: "",
      reason: "",
    },
  });

  const newStockLevel = Number(form.watch("quantity")) + Number(product?.stock);

  const mutation = useMutation({
    mutationFn: async ({ quantity, reason }: StockAdjustmentFormValues) => {
      if (!product) throw new Error("Product not found");

      const adjustmentQuantity = Number(quantity);
      if (!Number.isInteger(adjustmentQuantity) || adjustmentQuantity === 0) {
        throw new Error("Enter a non-zero whole number.");
      }

      if (newStockLevel < 0) {
        throw new Error("Stock cannot be negative.");
      }

      const adjustment = {
        productId: product.id,
        quantity: adjustmentQuantity,
        previousStock: product.stock,
        newStock: newStockLevel,
        reason: reason.trim(),
        adjustedAt: Date.now(),
        adjustedBy: user?.name,
      } as InventoryAdjustment;

      product.stock = newStockLevel;

      return adjustProductStock(product, adjustment);
    },
    onSuccess: (productResult) => {
      queryClient.invalidateQueries({ queryKey: ["adjustments"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast.add({
        title: `${productResult?.productName}'s stock updated`,
        description: `The stock was adjusted to ${productResult.stock} successfully`,
        type: "success",
      });

      form.reset();
      onOpenChange(false);

      onSuccess?.(productResult);
    },
    onError: (error) => {
      toast.add({
        title: "Failed to adjust stock",
        description: error.message,
        type: "error",
      });
      onError?.(error as Error);
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({ quantity: "", reason: "" });
    }
  }, [form, open]);

  const submit: SubmitHandler<StockAdjustmentFormValues> = (values) => {
    if (!product) return;

    mutation.mutate({
      quantity: Number(values.quantity),
      reason: values.reason.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Adjust <span className="text-primary">{product?.productName}</span>
            's stock
          </DialogTitle>
          <DialogDescription>
            Use a positive number to add stock or a negative number to remove
            it.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <Field>
            <FieldLabel htmlFor={product?.id + "-stock-adjustment"}>
              Stock adjustment
            </FieldLabel>
            <Input
              autoFocus
              id={product?.id + "-stock-adjustment"}
              placeholder="e.g. 25 or -5"
              step="1"
              type="number"
              {...form.register("quantity")}
            />
            {mutation.isError && (
              <FieldError>
                {mutation.error?.message ?? "Unable to adjust stock."}
              </FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor={product?.id + "-stock-adjustment-reason"}>
              Reason
            </FieldLabel>
            <Textarea
              id={product?.id + "-stock-adjustment-reason"}
              placeholder="Optional note"
              {...form.register("reason")}
            />
          </Field>

          <div className="flex gap-3 justify-between">
            <div>
              Current stock:{" "}
              <span className="font-bold">{formatNumber(product?.stock)}</span>
            </div>
            <div>
              {newStockLevel ? (
                <>
                  Stock after adjustment will be:{" "}
                  <span className="font-bold">{newStockLevel}</span>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={open && mutation.isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? "Adjusting..." : "Adjust"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
