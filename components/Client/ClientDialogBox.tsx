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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { Plus } from "lucide-react";
import { postUserDetail } from "@/services/userDetail.service";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must not exceed 80 characters"),
  phoneNumber: z
    .string()
    .regex(/^[6-9][0-9]{9}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  website: z
    .string()
    .regex(
      /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/,
      "Invalid website URL"
    )
    .optional()
    .or(z.literal("")),
  cin: z
    .string()
    .regex(/^[A-Z]{1}[A-Z]{4}[0-9]{6}[A-Z]{3}[0-9]{6}$/, "Invalid CIN format")
    .optional()
    .or(z.literal("")),
  gstin: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format"
    )
    .optional()
    .or(z.literal("")),
  addressLine1: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .max(120, "Address must not exceed 120 characters"),
  addressLine2: z
    .string()
    .max(120, "Address must not exceed 120 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(60, "City must not exceed 60 characters"),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(60, "State must not exceed 60 characters"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(60, "Country must not exceed 60 characters"),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid postal code format"),
  type:z.string().optional(),
});

export type ClientForm = z.infer<typeof schema>;

export default function ClientDialogBox() {
  const closeRef = useRef<HTMLButtonElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ClientForm) => {
    console.log(data);
    try {
      const response = await postUserDetail({...data,type:"clientDetail"});
      if (response) {    
        closeRef.current?.click();
        window.location.reload();
      } else {
        console.error("Failed to create client");
      }
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus /> Add Client
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Client</DialogTitle>
            <DialogDescription>
              Add a new client to your client list
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Client Name *</Label>
              <Input {...register("name")} placeholder="Enter client name" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Phone Number *</Label>
                <Input {...register("phoneNumber")} placeholder="9876543210" />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Email *</Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="client@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Website</Label>
              <Input
                {...register("website")}
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>CIN</Label>
                <Input
                  {...register("cin")}
                  placeholder="U12345MH2020PTC123456"
                />
                {errors.cin && (
                  <p className="text-sm text-red-500">{errors.cin.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>GSTIN</Label>
                <Input {...register("gstin")} placeholder="27AABCU9603R1ZV" />
                {errors.gstin && (
                  <p className="text-sm text-red-500">{errors.gstin.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Address Line 1 *</Label>
              <Input
                {...register("addressLine1")}
                placeholder="Street address"
              />
              {errors.addressLine1 && (
                <p className="text-sm text-red-500">
                  {errors.addressLine1.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Address Line 2</Label>
              <Input
                {...register("addressLine2")}
                placeholder="Apartment, suite, etc."
              />
              {errors.addressLine2 && (
                <p className="text-sm text-red-500">
                  {errors.addressLine2.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>City *</Label>
                <Input {...register("city")} placeholder="City" />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>State *</Label>
                <Input {...register("state")} placeholder="State" />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Country *</Label>
                <Input {...register("country")} placeholder="Country" />
                {errors.country && (
                  <p className="text-sm text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Postal Code *</Label>
                <Input {...register("postalCode")} placeholder="400001" />
                {errors.postalCode && (
                  <p className="text-sm text-red-500">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button ref={closeRef} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
