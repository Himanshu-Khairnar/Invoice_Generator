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
  let data = type === "item" ? Itemdata : Clientdata;
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      console.log(data);

      if (type === "client") {
        const matchesSearch =
          (item as IUser).name.toLowerCase().includes(search.toLowerCase()) ||
          (item as IUser).email.toLowerCase().includes(search.toLowerCase());
        // const matchesStatus = showArchived
        //   ? (item as IUser).status === "archived"
        //   : (item as IUser).status === "unarchived";
        return matchesSearch; // Removed matchesStatus as it's commented out
      } else {
        const matchesSearch =
          (item as IItem).productName.toLowerCase().includes(search.toLowerCase()) ||
          (item as IItem).productNo.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = showArchived
          ? (item as IItem).status === "archived"
          : (item as IItem).status === "unarchived";

        return matchesSearch && matchesStatus;
      }
    });
  }, [itemHeaders, search, showArchived]);

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
                {headers.map((header) => (
                  <TableHead key={header.key} className={header.className}>
                    {header.label}
                  </TableHead>
                ))}
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

              {filteredData.map((item) => {
                if (type === "client") {
                  return (
                    <TableRow key={(item as IUser).email}>
                      <TableCell className="font-medium">
                        {(item as IUser).name}
                      </TableCell>
                      <TableCell className="text-center">
                        {(item as IUser).email}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-2"
                          onClick={() => {
                            console.log("View client:", item._id);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={(item as IItem).productName}>
                      <TableCell className="font-medium">
                        {(item as IItem).productName}
                      </TableCell>

                      <TableCell className="text-center">
                        {(item as IItem).productNo}
                      </TableCell>

                      <TableCell className="text-center">
                        {(item as IItem).productPrice ?? 0}
                      </TableCell>

                      <TableCell className="text-center">
                        {(item as IItem).timesInvoiced ?? 0}
                      </TableCell>

                      <TableCell className="text-center">
                        {((item as IItem).timesInvoiced ?? 0) *
                          ((item as IItem).productPrice ?? 0)}
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
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemsTable;
