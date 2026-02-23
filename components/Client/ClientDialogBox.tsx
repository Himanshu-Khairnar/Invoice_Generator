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
import { Plus, User, MapPin, Globe, CreditCard } from "lucide-react";
import { postUserDetail } from "@/services/userDetail.service";
import { Separator } from "@/components/ui/separator";

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
    try {
      const response = await postUserDetail({...data,type:"clientDetail"});
      if (response) {    
        closeRef.current?.click();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Client
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl">Add New Client</DialogTitle>
            <DialogDescription>
              Fill in the client details to add them to your database.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <User className="h-4 w-4" />
                <span>Basic Information</span>
              </div>
              <Separator />
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Client Name <span className="text-destructive">*</span></Label>
                  <Input id="name" {...register("name")} placeholder="John Doe or Acme Inc." className="bg-muted/30" />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input id="email" {...register("email")} type="email" placeholder="client@example.com" className="bg-muted/30" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number <span className="text-destructive">*</span></Label>
                    <Input id="phoneNumber" {...register("phoneNumber")} placeholder="9876543210" className="bg-muted/30" />
                    {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="website" {...register("website")} placeholder="https://www.client.com" className="pl-9 bg-muted/30" />
                  </div>
                  {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
                </div>
              </div>
            </div>

            {/* Tax Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <CreditCard className="h-4 w-4" />
                <span>Tax & Registration</span>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cin">CIN (Corporate Identity Number)</Label>
                  <Input id="cin" {...register("cin")} placeholder="U12345MH2020PTC123456" className="bg-muted/30 uppercase" />
                  {errors.cin && <p className="text-xs text-destructive">{errors.cin.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input id="gstin" {...register("gstin")} placeholder="27AABCU9603R1ZV" className="bg-muted/30 uppercase" />
                  {errors.gstin && <p className="text-xs text-destructive">{errors.gstin.message}</p>}
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <MapPin className="h-4 w-4" />
                <span>Address Details</span>
              </div>
              <Separator />
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="addressLine1">Address Line 1 <span className="text-destructive">*</span></Label>
                  <Input id="addressLine1" {...register("addressLine1")} placeholder="Street, Building No." className="bg-muted/30" />
                  {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input id="addressLine2" {...register("addressLine2")} placeholder="Apartment, Suite, Locality" className="bg-muted/30" />
                  {errors.addressLine2 && <p className="text-xs text-destructive">{errors.addressLine2.message}</p>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-1 md:col-span-2 grid gap-2">
                    <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                    <Input id="city" {...register("city")} placeholder="City" className="bg-muted/30" />
                    {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                    <Input id="state" {...register("state")} placeholder="State" className="bg-muted/30" />
                    {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="postalCode">Zip <span className="text-destructive">*</span></Label>
                    <Input id="postalCode" {...register("postalCode")} placeholder="400001" className="bg-muted/30" />
                    {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country <span className="text-destructive">*</span></Label>
                  <Input id="country" {...register("country")} placeholder="Country" className="bg-muted/30" />
                  {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
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
            <Button type="submit" className="px-8">Create Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
