/** Recalculate lineTotal for every product row */
export function calcLineTotals(products: any[]): any[] {
  return products.map((p) => {
    const base = (p.quantity || 0) * (p.productPrice || 0);
    const discounted = Math.max(0, base - (p.discount || 0));
    const tax = discounted * ((p.taxSlab || 0) / 100);
    return { ...p, lineTotal: +(discounted + tax).toFixed(2) };
  });
}

/** Derive invoice-level totals from a products array (already has lineTotal) */
export function calcInvoiceTotals(products: any[], paidAmount = 0) {
  let subTotal = 0;
  let taxTotal = 0;
  let discountTotal = 0;

  for (const p of products) {
    const base = (p.quantity || 0) * (p.productPrice || 0);
    const discount = p.discount || 0;
    const discounted = Math.max(0, base - discount);
    const tax = discounted * ((p.taxSlab || 0) / 100);
    subTotal += discounted;
    taxTotal += tax;
    discountTotal += discount;
  }

  subTotal = +subTotal.toFixed(2);
  taxTotal = +taxTotal.toFixed(2);
  discountTotal = +discountTotal.toFixed(2);
  const totalAmount = +(subTotal + taxTotal).toFixed(2);
  const balanceDue = +Math.max(0, totalAmount - (paidAmount || 0)).toFixed(2);

  return { subTotal, taxTotal, discountTotal, totalAmount, balanceDue };
}
