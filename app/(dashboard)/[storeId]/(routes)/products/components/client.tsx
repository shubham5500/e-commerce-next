"use client";

import ApiList from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";

type Props = {
  products: ProductColumn[];
};

const ProductClient = ({products = []}: Props) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex item-center justify-between">
        <Heading
          title={`Products (${products.length})`}
          description="Manage products for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={products} searchKey="name"/>
      <Heading title="API" description="API calls for Products"/>
      <ApiList entityName="products" entityIdName="productId"/>
    </>
  );
};

export default ProductClient;
