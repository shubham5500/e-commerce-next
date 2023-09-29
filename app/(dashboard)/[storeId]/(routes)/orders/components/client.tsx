"use client";

import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";

type Props = {
  orders: OrderColumn[];
};

const BillboardClient = ({orders = []}: Props) => {
  return (
    <>
    <div className="flex item-center justify-between">
        <Heading
          title={`Categories (${orders.length})`}
          description="Manage categories for your store"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={orders} searchKey="label"/>
    </>
  );
};

export default BillboardClient;
