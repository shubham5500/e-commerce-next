import React from "react";
import { format } from "date-fns";
import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { SizeColumn } from "./components/columns";

type Props = {
  params: {
    storeId: string;
  };
};

const Sizes = async (props: Props) => {
  const {
    params: { storeId },
  } = props;

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColumns: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-5">
        <BillboardClient sizes={formattedColumns} />
      </div>
    </div>
  );
};

export default Sizes;
