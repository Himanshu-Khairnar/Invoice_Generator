"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { taxs } from "@/constant";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { createItem } from "@/services/items.service";
import { useRef } from "react";
import { Plus, Package, Tag, IndianRupee, Percent } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  productNo: z.string().min(1, "Product No is required"),
  productName: z.string().min(3, "Name must be at least 3 characters"),
  productPrice: z.number().min(0, "Price must be positive"),
  taxSlab: z.enum(taxs),
});

export type ItemForm = z.infer<typeof schema>;

export default function ItemDialogBox() {
  const closeRef = useRef<HTMLButtonElement>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ItemForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      taxSlab: "18"
    }
  });

  const onSubmit = async (data: ItemForm) => {
    const response = await createItem(data);
    if (response) {
      closeRef.current?.click();
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Item
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl">Create New Item</DialogTitle>
            <DialogDescription>
              Add a new product or service for your invoices.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Package className="h-4 w-4" />
                <span>Product Details</span>
              </div>
              <Separator />
              
              <div className="grid gap-2">
                <Label htmlFor="productName">Product Name <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="productName" 
                    {...register("productName")} 
                    placeholder="E.g. Web Development Service" 
                    className="pl-9 bg-muted/30"
                  />
                </div>
                {errors.productName && (
                  <p className="text-xs text-destructive">{errors.productName.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="productNo">Product No / SKU <span className="text-destructive">*</span></Label>
                <Input 
                  id="productNo" 
                  {...register("productNo")} 
                  placeholder="E.g. SVC-001" 
                  className="bg-muted/30"
                />
                {errors.productNo && (
                  <p className="text-xs text-destructive">{errors.productNo.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <IndianRupee className="h-4 w-4" />
                <span>Pricing & Tax</span>
              </div>
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="productPrice">Unit Price <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">₹</span>
                    <Input
                      id="productPrice"
                      type="number"
                      step="0.01"
                      {...register("productPrice", { valueAsNumber: true })}
                      placeholder="0.00"
                      className="pl-7 bg-muted/30"
                    />
                  </div>
                  {errors.productPrice && (
                    <p className="text-xs text-destructive">{errors.productPrice.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="taxSlab">Tax Slab (%)</Label>
                  <Controller
                    name="taxSlab"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="taxSlab" className="bg-muted/30">
                          <SelectValue placeholder="Select tax" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>GST Tax Slabs</SelectLabel>
                            {taxs.map((tax) => (
                              <SelectItem key={tax} value={tax}>
                                {tax}%
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.taxSlab && (
                    <p className="text-xs text-destructive">{errors.taxSlab.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-muted/20 border-t">
            <DialogClose asChild>
              <Button ref={closeRef} variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="px-8 font-semibold">
              Save Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
