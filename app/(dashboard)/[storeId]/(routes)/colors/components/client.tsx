"use client";

import ApiList from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn, columns } from "./columns";

type Props = {
  colors: ColorColumn[];
};

const ColorClient = ({colors = []}: Props) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex item-center justify-between">
        <Heading
          title={`Color (${colors.length})`}
          description="Manage color for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={colors} searchKey="name"/>
      <Heading title="API" description="API calls for Color"/>
      <ApiList entityName="colors" entityIdName="colorId"/>
    </>
  );
};

export default ColorClient;
