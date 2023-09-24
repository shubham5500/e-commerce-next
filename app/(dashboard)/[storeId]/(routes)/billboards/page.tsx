import React from "react";
import { format } from "date-fns";
import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { BillboardColumn } from "./components/columns";

type Props = {
  params: {
    storeId: string;
  };
};

const Billboards = async (props: Props) => {
  const {
    params: { storeId },
  } = props;

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColumns: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-5">
        <BillboardClient billboards={formattedColumns} />
      </div>
    </div>
  );
};

export default Billboards;
