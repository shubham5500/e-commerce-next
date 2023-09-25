import React from "react";
import { format } from "date-fns";
import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "./components/columns";

type Props = {
  params: {
    storeId: string;
  };
};

const Categories = async (props: Props) => {
  const {
    params: { storeId },
  } = props;

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColumns: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-5">
        <BillboardClient categories={formattedColumns} />
      </div>
    </div>
  );
};

export default Categories;
