"use client";

import { useMemo, useState } from "react";
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
import { Search, MoreVertical, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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
  
  const headers = type === "item" ? itemHeaders : clientHeaders;
  const data = type === "item" ? Itemdata : Clientdata;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (type === "client") {
        const client = item as IUser;
        const matchesSearch =
          client.name?.toLowerCase().includes(search.toLowerCase()) ||
          client.email?.toLowerCase().includes(search.toLowerCase());
        
        // For clients, we might not have a status field yet, so we just return search matches
        return matchesSearch;
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
    <Card className="w-full border-none shadow-none bg-background">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">
            {type === "item" ? "Product List" : "Client List"}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={type === "item" ? "Search items..." : "Search clients..."}
                className="w-full md:w-72 pl-9 bg-muted/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {type === "item" && (
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
            <TableHeader className="bg-muted/50">
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header.key} className={`${header.className} font-semibold`}>
                    {header.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No {type === "item" ? "items" : "clients"} found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => {
                  if (type === "client") {
                    const client = item as IUser;
                    return (
                      <TableRow key={client._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium py-4">
                          <div className="flex flex-col">
                            <span>{client.name}</span>
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{client.numberOfInvoices ?? 0}</TableCell>
                        <TableCell className="text-center">{client.numberOfDrafts ?? 0}</TableCell>
                        <TableCell className="text-center font-medium">₹{(client.totalInvoiced ?? 0).toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={client.totalUnpaid && client.totalUnpaid > 0 ? "destructive" : "secondary"}>
                            ₹{(client.totalUnpaid ?? 0).toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => console.log("View:", client._id)}>
                                <ExternalLink className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Archive Client</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    const product = item as IItem;
                    return (
                      <TableRow key={product._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium py-4">{product.productName}</TableCell>
                        <TableCell className="text-center">{product.productNo}</TableCell>
                        <TableCell className="text-center">₹{(product.productPrice ?? 0).toLocaleString()}</TableCell>
                        <TableCell className="text-center">{product.timesInvoiced ?? 0}</TableCell>
                        <TableCell className="text-center font-bold">
                          ₹{(product.totalInvoiced ?? 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
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
  );
};

export default ItemsTable;
