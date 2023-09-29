"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./cell-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string;
  phone: string;
  isPaid: boolean;
  address: string;
  totalPrice: string;
  products: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
