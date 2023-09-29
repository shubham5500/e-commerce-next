import React from "react";
import { format } from "date-fns";
import OrderClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

type Props = {
  params: {
    storeId: string;
  };
};

const OrderPage = async (props: Props) => {
  const {
    params: { storeId },
  } = props;

  const orders = await prismadb.order.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColumns: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    isPaid: item.isPaid,
    products: item.orderItems.map((item) => item.product.name).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((acc, item) => acc + Number(item.product.price), 0)),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-5">
        <OrderClient orders={formattedColumns} />
      </div>
    </div>
  );
};

export default OrderPage;
