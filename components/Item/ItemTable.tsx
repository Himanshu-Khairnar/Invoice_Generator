"use client";

import React, { useMemo, useState } from "react";
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
import { Eye } from "lucide-react";

const ItemsTable = ({ data }: { data: IItem[] }) => {
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.productNo.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = showArchived
        ? item.status === "archived"
        : item.status === "unarchived";

      return matchesSearch && matchesStatus;
    });
  }, [data, search, showArchived]);

  return (
    <Card className="w-full border-none bg-transparent shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Items</CardTitle>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by name or product no"
            className="w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Checkbox
              id="archived"
              checked={showArchived}
              onCheckedChange={(v) => setShowArchived(!!v)}
            />
            <Label htmlFor="archived">Show Archived</Label>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableCaption>Product listing</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Product Name</TableHead>
                <TableHead className="w-[180px]">Product No</TableHead>
                <TableHead className="w-[160px]">Price (GST)</TableHead>
                <TableHead className="w-[180px] text-right">
                  Times Invoiced
                </TableHead>
                <TableHead className="w-[200px] text-right">
                  Total Invoiced
                </TableHead>
                <TableHead className="w-[140px] text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No items found
                  </TableCell>
                </TableRow>
              )}

              {filteredData.map((item) => (
                <TableRow key={item.productName}>
                  <TableCell className="font-medium">
                    {item.productName}
                  </TableCell>

                  <TableCell>{item.productNo}</TableCell>

                  <TableCell>{item.productPrice ?? 0}</TableCell>

                  <TableCell className="text-right">
                    {item.timesInvoiced ?? 0}
                  </TableCell>

                  <TableCell className="text-right">
                    {(item.timesInvoiced ?? 0) * (item.productPrice ?? 0)}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2"
                      onClick={() => {
                        console.log("View product:", item._id);
                      }}
                    >
                      {/* <Eye size={16} /> */}
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemsTable;
