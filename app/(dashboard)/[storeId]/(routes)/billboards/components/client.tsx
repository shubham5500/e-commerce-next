"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import React from "react";

type Props = {};

const BillboardClient = (props: Props) => {
  return (
    <>
      <div className="flex item-center justify-between">
        <Heading
          title="Billboard (0)"
          description="Manage billboard for your store"
        />
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
    </>
  );
};

export default BillboardClient;
