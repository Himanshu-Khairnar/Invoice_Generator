// ...existing code...
// import React from 'react';
//
// const Page = () => {
//     return (
//         <div>
//             Create Invoice 
//             <div>
//
//             </div>
//         </div>
//     );
// }
//
// export default Page;
// ...existing code...

"use client";

import React, { useMemo, useState } from "react";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

type InvoiceForm = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  customerName: string;
  customerEmail: string;
  billingAddress: string;
  items: LineItem[];
  taxRate: number; // %
  discount: number; // absolute
  shipping: number; // absolute
  notes: string;
};

const Page = () => {
  const [form, setForm] = useState<InvoiceForm>({
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    currency: "USD",
    customerName: "",
    customerEmail: "",
    billingAddress: "",
    items: [
      { id: Math.random().toString(36).slice(2), description: "", quantity: 1, price: 0 },
    ],
    taxRate: 0,
    discount: 0,
    shipping: 0,
    notes: "",
  });

  const subtotal = useMemo(
    () => form.items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0),
    [form.items]
  );
  const taxAmount = useMemo(() => subtotal * ((Number(form.taxRate) || 0) / 100), [subtotal, form.taxRate]);
  const total = useMemo(
    () => Math.max(0, subtotal + taxAmount + (Number(form.shipping) || 0) - (Number(form.discount) || 0)),
    [subtotal, taxAmount, form.shipping, form.discount]
  );

  const formatMoney = (v: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: form.currency || "USD" }).format(v || 0);

  const updateField = <K extends keyof InvoiceForm>(key: K, value: InvoiceForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateItem = <K extends keyof LineItem>(id: string, key: K, value: LineItem[K]) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, [key]: value } : it)),
    }));

  const addItem = () =>
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { id: Math.random().toString(36).slice(2), description: "", quantity: 1, price: 0 }],
    }));

  const removeItem = (id: string) =>
    setForm((prev) => ({ ...prev, items: prev.items.filter((it) => it.id !== id) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim()) {
      alert("Customer name is required.");
      return;
    }
    if (form.items.length === 0 || !form.items.some((it) => it.description && it.quantity > 0)) {
      alert("At least one valid line item is required.");
      return;
    }

    const payload = {
      ...form,
      subtotal,
      taxAmount,
      total,
    };

    // TODO: Replace with your API route
    // await fetch("/api/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

    console.log("Invoice payload:", payload);
    alert("Invoice ready. Check console for payload.");
  };

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Create Invoice</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24 }}>
        {/* Invoice & Customer Details */}
        <section style={{ display: "grid", gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Details</h2>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            <div>
              <label htmlFor="invoiceNumber">Invoice Number</label>
              <input
                id="invoiceNumber"
                type="text"
                value={form.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </div>
            <div>
              <label htmlFor="issueDate">Issue Date</label>
              <input
                id="issueDate"
                type="date"
                value={form.issueDate}
                onChange={(e) => updateField("issueDate", e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </div>
            <div>
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </div>
            <div>
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            <div>
              <label htmlFor="customerName">Customer Name</label>
              <input
                id="customerName"
                type="text"
                value={form.customerName}
                onChange={(e) => updateField("customerName", e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </div>
            <div>
              <label htmlFor="customerEmail">Customer Email</label>
              <input
                id="customerEmail"
                type="email"
                value={form.customerEmail}
                onChange={(e) => updateField("customerEmail", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="billingAddress">Billing Address</label>
              <textarea
                id="billingAddress"
                value={form.billingAddress}
                onChange={(e) => updateField("billingAddress", e.target.value)}
                rows={3}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </section>

        {/* Line Items */}
        <section style={{ display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Line Items</h2>
          <div role="table" style={{ display: "grid", gap: 8 }}>
            <div
              role="row"
              style={{ display: "grid", gridTemplateColumns: "4fr 1fr 1fr 1fr auto", gap: 8, fontWeight: 600 }}
            >
              <div>Description</div>
              <div>Qty</div>
              <div>Rate</div>
              <div>Amount</div>
              <div />
            </div>

            {form.items.map((it) => {
              const amount = (Number(it.quantity) || 0) * (Number(it.price) || 0);
              return (
                <div
                  key={it.id}
                  role="row"
                  style={{ display: "grid", gridTemplateColumns: "4fr 1fr 1fr 1fr auto", gap: 8, alignItems: "center" }}
                >
                  <input
                    placeholder="Item description"
                    value={it.description}
                    onChange={(e) => updateItem(it.id, "description", e.target.value)}
                  />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={it.quantity}
                    onChange={(e) => updateItem(it.id, "quantity", Number(e.target.value))}
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={it.price}
                    onChange={(e) => updateItem(it.id, "price", Number(e.target.value))}
                  />
                  <div style={{ textAlign: "right" }}>{formatMoney(amount)}</div>
                  <button type="button" onClick={() => removeItem(it.id)} aria-label="Remove item">
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <div>
            <button type="button" onClick={addItem}>
              + Add Item
            </button>
          </div>
        </section>

        {/* Totals */}
        <section style={{ display: "grid", gap: 12, justifyContent: "end" }}>
          <div style={{ display: "grid", gap: 8, width: 360 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "center" }}>
              <label htmlFor="taxRate">Tax (%)</label>
              <input
                id="taxRate"
                type="number"
                min={0}
                step="0.01"
                value={form.taxRate}
                onChange={(e) => updateField("taxRate", Number(e.target.value))}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tax Amount</span>
              <strong>{formatMoney(taxAmount)}</strong>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "center" }}>
              <label htmlFor="discount">Discount</label>
              <input
                id="discount"
                type="number"
                min={0}
                step="0.01"
                value={form.discount}
                onChange={(e) => updateField("discount", Number(e.target.value))}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "center" }}>
              <label htmlFor="shipping">Shipping</label>
              <input
                id="shipping"
                type="number"
                min={0}
                step="0.01"
                value={form.shipping}
                onChange={(e) => updateField("shipping", Number(e.target.value))}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
              <span>Total</span>
              <strong>{formatMoney(total)}</strong>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section style={{ display: "grid", gap: 8 }}>
          <label htmlFor="notes">Notes / Terms</label>
          <textarea
            id="notes"
            rows={4}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Payment is due within 7 days..."
          />
        </section>

        {/* Actions */}
        <section style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button type="button" onClick={() => console.log("Save draft:", { ...form, subtotal, taxAmount, total })}>
            Save Draft
          </button>
          <button type="submit">Create Invoice</button>
        </section>
      </form>
    </main>
  );
};

export default Page;