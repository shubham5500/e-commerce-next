"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./cell-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div
          className="border rounded-full h-6 w-6"
          style={{
            backgroundColor: row.original.value,
          }}
        ></div>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
