"use client";

import React, { useState } from "react";
import { IInvoice } from "@/types/invoice.types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateInvoiceStatus } from "@/services/invoice.service";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

interface InvoiceDetailViewProps {
  invoice: IInvoice;
  onInvoiceUpdate: (invoice: IInvoice) => void;
}

const statusConfig = {
  due: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    label: "Due",
  },
  "payment done": {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
    label: "Payment Done",
  },
  cancel: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    label: "Cancelled",
  },
  draft: {
    color: "bg-gray-100 text-gray-800",
    icon: AlertCircle,
    label: "Draft",
  },
};

export default function InvoiceDetailView({
  invoice,
  onInvoiceUpdate,
}: InvoiceDetailViewProps) {
  const [status, setStatus] = useState<string>(invoice.status);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const StatusIcon =
    statusConfig[invoice.status as keyof typeof statusConfig]?.icon ||
    AlertCircle;

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true);
      setMessage(null);

      const response = await updateInvoiceStatus(
        invoice._id as any,
        newStatus as "due" | "payment done" | "cancel" | "draft"
      );

      if (response.success) {
        setStatus(newStatus);
        onInvoiceUpdate(response.data);
        setMessage({
          type: "success",
          text: "Status updated successfully",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update status",
      });
    } finally {
      setUpdating(false);
    }
  };

  const userDetail = invoice.userDetailId as any;
  const clientDetail = invoice.clientDetailId as any;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Invoice Number and Status */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            Invoice {invoice.invoiceNumber}
          </h1>
          <p className="text-gray-500 mt-1">
            Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className={
              statusConfig[invoice.status as keyof typeof statusConfig]?.color
            }
          >
            <StatusIcon className="w-4 h-4 mr-1" />
            {statusConfig[invoice.status as keyof typeof statusConfig]?.label}
          </Badge>
        </div>
      </div>

      {/* Status Update Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Invoice Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                New Status
              </label>
              <Select
                value={status}
                onValueChange={handleStatusChange}
                disabled={updating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="due">Due</SelectItem>
                  <SelectItem value="payment done">Payment Done</SelectItem>
                  <SelectItem value="cancel">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bill From */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bill From</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{userDetail?.companyName}</p>
            <p className="text-sm text-gray-600">
              {userDetail?.companyAddress}
            </p>
            <p className="text-sm text-gray-600">{userDetail?.email}</p>
            <p className="text-sm text-gray-600">{userDetail?.phone}</p>
          </CardContent>
        </Card>

        {/* Bill To */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bill To</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{clientDetail?.companyName}</p>
            <p className="text-sm text-gray-600">
              {clientDetail?.companyAddress}
            </p>
            <p className="text-sm text-gray-600">{clientDetail?.email}</p>
            <p className="text-sm text-gray-600">{clientDetail?.phone}</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Item</th>
                  <th className="text-right py-2 px-2">Unit Price</th>
                  <th className="text-right py-2 px-2">Quantity</th>
                  <th className="text-right py-2 px-2">Tax %</th>
                  <th className="text-right py-2 px-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.products?.map((product: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-2">{product.productName}</td>
                    <td className="text-right py-2 px-2">
                      ₹{product.productPrice}
                    </td>
                    <td className="text-right py-2 px-2">{product.quantity}</td>
                    <td className="text-right py-2 px-2">{product.taxSlab}%</td>
                    <td className="text-right py-2 px-2">
                      ₹{product.lineTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{invoice.subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Total:</span>
              <span>₹{invoice.taxTotal}</span>
            </div>
            {invoice.discountTotal && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-₹{invoice.discountTotal}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Total Amount:</span>
              <span>₹{invoice.totalAmount}</span>
            </div>
            {invoice.paidAmount ? (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Paid Amount:</span>
                  <span>₹{invoice.paidAmount}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Balance Due:</span>
                  <span>₹{invoice.balanceDue}</span>
                </div>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline">Download PDF</Button>
        <Button variant="outline">Send Email</Button>
        <Button>Edit Invoice</Button>
      </div>
    </div>
  );
}
