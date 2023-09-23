"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

type Props = {
  billboards: Billboard[];
};

const BillboardClient = ({billboards = []}: Props) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex item-center justify-between">
        <Heading
          title="Billboard (0)"
          description="Manage billboard for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      {billboards.map(billB => {
        return <div>{billB.label} {billB.id}</div>
      })}
    </>
  );
};

export default BillboardClient;
