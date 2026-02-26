"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

const SEGMENT_LABELS: Record<string, string> = {
  homepage: "Dashboard",
  invoices: "Invoices",
  new: "New Invoice",
  client: "Clients",
  items: "Items",
  settings: "Settings",
};

function toLabel(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

function isId(segment: string) {
  return /^[a-f0-9]{24}$/.test(segment) || segment.length > 20;
}

export default function AppBreadcrumb() {
  const pathname = usePathname();

  // Strip leading slash and split
  const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);

  // Build cumulative hrefs
  const crumbs = segments.map((seg, i) => ({
    label: isId(seg) ? "Detail" : toLabel(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <React.Fragment key={crumb.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
