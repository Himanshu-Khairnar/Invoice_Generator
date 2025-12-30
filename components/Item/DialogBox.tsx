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
import { Plus } from "lucide-react";

const schema = z.object({
  productNo: z.string().min(1),
  productName: z.string().min(5),
  productPrice: z.number().min(1),
  taxSlab: z.enum(taxs),
});

export type ItemForm = z.infer<typeof schema>;

export default function DialogBox() {
  const closeRef = useRef<HTMLButtonElement>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ItemForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ItemForm) => {
    console.log(data);
    const response = await createItem(data);
    if (response) {
      closeRef.current?.click();
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default"><Plus /> Create Item</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>Add a item to your item list</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Item Name</Label>
              <Input {...register("productName")} />
              {errors.productName && (
                <p className="text-sm text-red-500">
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Product No</Label>
              <Input {...register("productNo")} />
              {errors.productNo && (
                <p className="text-sm text-red-500">
                  {errors.productNo.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  {...register("productPrice", { valueAsNumber: true })}
                />
                {errors.productPrice && (
                  <p className="text-sm text-red-500">
                    {errors.productPrice.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Tax Slab</Label>
                <Controller
                  name="taxSlab"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tax Slabs</SelectLabel>
                          {taxs.map((tax) => (
                            <SelectItem key={tax} value={tax}>
                              {tax}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.taxSlab && (
                  <p className="text-sm text-red-500">
                    {errors.taxSlab.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose    asChild>
              <Button ref={closeRef} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
