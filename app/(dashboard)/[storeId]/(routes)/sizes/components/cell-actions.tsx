import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import toast from "react-hot-toast";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";
import { SizeColumn } from "./columns";

type Props = {
  data: SizeColumn;
};

const CellActions = ({ data }: Props) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Copied to clipboard");
  };

  const router = useRouter();
  const params = useParams();
  const update = () => {
    router.push(`/${params.storeId}/sizes/${data.id}`);
  };

  const onDelete = async () => {
    const { storeId } = params;

    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/sizes/${data.id}`
      );
      router.refresh();
      toast.success("Size deleted...");
    } catch (error) {
      toast.error(
        "Make sure to remove all products using this size first."
      );
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="py-2">
          <DropdownMenuLabel>
            <div className="text-center py-1 px-4">Actions</div>
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <div className="flex items-center gap-2 py-2 px-4 cursor-pointer">
              <Copy className="h-4 w-4" />
              Copy Id
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div
              className="flex items-center gap-2 py-2 px-4 cursor-pointer"
              onClick={update}
            >
              <Edit className="h-4 w-4" />
              Update
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div
              className="flex items-center gap-2 py-2 px-4 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
              Delete
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActions;
