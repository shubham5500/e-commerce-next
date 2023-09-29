import React from "react";
import { format } from "date-fns";
import ProductClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

type Props = {
  params: {
    storeId: string;
  };
};

const Products = async (props: Props) => {
  const {
    params: { storeId },
  } = props;

  const products = await prismadb.product.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColumns: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    size: item.size.name,
    category: item.category.name,
    color: item.color.value,
    createdAt: item.createdAt,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-5">
        <ProductClient products={formattedColumns} />
      </div>
    </div>
  );
};

export default Products;
