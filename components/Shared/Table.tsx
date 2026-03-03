"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IItem } from "@/types/item.types";
import { itemHeaders, clientHeaders } from "@/constant";
import { IUser } from "@/types/user.types";
import { Search, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { archiveClient } from "@/services/userDetail.service";
import ClientDialogBox from "@/components/Client/ClientDialogBox";

const ItemsTable = ({
  Itemdata,
  Clientdata,
  type,
}: {
  Itemdata: IItem[];
  Clientdata: IUser[];
  type: string;
}) => {
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editClient, setEditClient] = useState<IUser | null>(null);
  const router = useRouter();

  const headers = type === "item" ? itemHeaders : clientHeaders;
  const data = type === "item" ? Itemdata : Clientdata;

  const handleArchiveClient = async (id: string, currentArchived: boolean) => {
    try {
      await archiveClient(id, !currentArchived);
      router.refresh();
    } catch (e) {
      console.error("Failed to archive client:", e);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (type === "client") {
        const client = item as IUser;
        const matchesSearch =
          client.fullname?.toLowerCase().includes(search.toLowerCase()) ||
          client.email?.toLowerCase().includes(search.toLowerCase());
        const matchesArchived = showArchived
          ? client.archived === true
          : client.archived !== true;
        return matchesSearch && matchesArchived;
      } else {
        const product = item as IItem;
        const matchesSearch =
          product.productName?.toLowerCase().includes(search.toLowerCase()) ||
          product.productNo?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = showArchived
          ? product.status === "archived"
          : product.status !== "archived";

        return matchesSearch && matchesStatus;
      }
    });
  }, [data, search, showArchived, type]);

  return (
    <>
    {editClient && (
      <ClientDialogBox
        open={!!editClient}
        onOpenChange={(o) => { if (!o) setEditClient(null); }}
        clientId={editClient._id}
        initialData={{
          name: editClient.fullname,
          email: editClient.email,
          phoneNumber: editClient.phoneNumber,
          website: editClient.website ?? "",
          cin: editClient.cin ?? "",
          gstin: editClient.gstin ?? "",
          addressLine1: editClient.addressLine1,
          addressLine2: editClient.addressLine2 ?? "",
          city: editClient.city,
          state: editClient.state,
          country: editClient.country,
          postalCode: editClient.postalCode,
        }}
      />
    )}
    <Card className="w-full border-none shadow-none bg-background">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">
            {type === "item" ? "Product List" : "Client List"}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={type === "item" ? "Search items..." : "Search clients..."}
                className="w-full md:w-64 pl-9 bg-muted/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {(type === "item" || type === "client") && (
              <div className="flex items-center space-x-2 bg-muted/30 px-3 py-1.5 rounded-md border">
                <Checkbox
                  id="archived"
                  checked={showArchived}
                  onCheckedChange={(v) => setShowArchived(!!v)}
                />
                <Label htmlFor="archived" className="text-sm font-medium cursor-pointer">
                  Show Archived
                </Label>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header.key} className={`${header.className} px-5 py-3 font-semibold`}>
                    {header.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headers.length} className="h-32 text-center text-muted-foreground">
                    No {type === "item" ? "items" : "clients"} found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => {
                  if (type === "client") {
                    const client = item as IUser;
                    return (
                      <TableRow key={client._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="px-5 py-4 font-medium">
                          <div className="flex flex-col">
                            <span>{client.fullname}</span>
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-center">{client.numberOfInvoices ?? 0}</TableCell>
                        <TableCell className="px-5 py-4 text-center">{client.numberOfDrafts ?? 0}</TableCell>
                        <TableCell className="px-5 py-4 text-center font-medium tabular-nums">₹{(client.totalInvoiced ?? 0).toLocaleString("en-IN")}</TableCell>
                        <TableCell className="px-5 py-4 text-center">
                          <Badge variant={client.totalUnpaid && client.totalUnpaid > 0 ? "destructive" : "secondary"}>
                            ₹{(client.totalUnpaid ?? 0).toLocaleString("en-IN")}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setEditClient(client)}>
                                Edit Client
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className={client.archived ? "" : "text-destructive focus:text-destructive"}
                                onClick={() => handleArchiveClient(client._id, !!client.archived)}
                              >
                                {client.archived ? "Unarchive Client" : "Archive Client"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    const product = item as IItem;
                    return (
                      <TableRow key={String(product._id)} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="px-5 py-4 font-medium">{product.productName}</TableCell>
                        <TableCell className="px-5 py-4 text-center">{product.productNo}</TableCell>
                        <TableCell className="px-5 py-4 text-center tabular-nums">₹{(product.productPrice ?? 0).toLocaleString("en-IN")}</TableCell>
                        <TableCell className="px-5 py-4 text-center">{product.timesInvoiced ?? 0}</TableCell>
                        <TableCell className="px-5 py-4 text-center font-semibold tabular-nums">
                          ₹{(product.totalInvoiced ?? 0).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => console.log("Edit:", product._id)}>
                                Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                {product.status === "archived" ? "Unarchive" : "Archive"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  }
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default ItemsTable;
