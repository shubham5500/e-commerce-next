import prismadb from "@/lib/prismadb";
import React from "react";

import CategoryForm from "./components/category-form";

type Props = {
  params: {
    categoryId: string;
    storeId: string;
  };
};

const BillboardPage = async ({ params: { categoryId, storeId } }: Props) => {
  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId
    }
  })

  if (!category) {
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default BillboardPage;
