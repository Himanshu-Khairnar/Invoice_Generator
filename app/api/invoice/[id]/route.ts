import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/invoice.model";
import Item from "@/models/item.model";
import PersonalDetail from "@/models/userDetail.model";
import { calcLineTotals, calcInvoiceTotals } from "@/lib/invoice-calc";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const invoice = await Invoice.findById(id)
      .populate("userImageId")
      .populate("userDetailId")
      .populate("clientDetailId")
      .populate("bankDetails");

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: invoice }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const body = await request.json();

    // If products or clientDetailId are being updated, fetch existing doc first
    let update = { ...body };
    const needsExisting = body.products || body.clientDetailId;
    let existing: any = null;
    if (needsExisting) {
      existing = await Invoice.findById(id).select("paidAmount products clientDetailId");
      if (!existing) {
        return NextResponse.json(
          { success: false, error: "Invoice not found" },
          { status: 404 }
        );
      }
    }

    if (body.products) {
      const products = calcLineTotals(body.products);
      const paidAmount = body.paidAmount ?? existing.paidAmount ?? 0;
      const totals = calcInvoiceTotals(products, paidAmount);
      update = { ...body, products, ...totals };

      // Build a map of old lineTotal per itemId for diffing
      const oldLineTotalByItemId = new Map<string, number>();
      const oldItemIds = new Set<string>();
      for (const p of (existing.products ?? [])) {
        if (p.itemId) {
          const key = p.itemId.toString();
          oldItemIds.add(key);
          oldLineTotalByItemId.set(key, p.lineTotal ?? 0);
        }
      }

      const catalogProducts = products.filter((p: any) => p.itemId);

      await Promise.all(
        catalogProducts.map((p: any) => {
          const key = p.itemId.toString();
          const isNew = !oldItemIds.has(key);
          const lineTotalDiff = (p.lineTotal ?? 0) - (oldLineTotalByItemId.get(key) ?? 0);
          return Item.findByIdAndUpdate(p.itemId, {
            $inc: {
              ...(isNew ? { timesInvoiced: 1 } : {}),
              totalInvoiced: lineTotalDiff,
            },
            productPrice: p.productPrice,
          });
        })
      );
    }

    // Increment timesInvoiced on client if clientDetailId changed
    if (body.clientDetailId) {
      const oldClientId = existing.clientDetailId?.toString();
      if (oldClientId !== body.clientDetailId.toString()) {
        await PersonalDetail.findByIdAndUpdate(body.clientDetailId, {
          $inc: { timesInvoiced: 1 },
        });
      }
    }

    const invoice = await Invoice.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .populate("userDetailId")
      .populate("clientDetailId")
      .populate("bankDetails");

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: invoice }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
