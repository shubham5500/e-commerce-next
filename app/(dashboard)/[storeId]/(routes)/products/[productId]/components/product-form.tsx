"use client";

import AlertModal from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useOrigin from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

type Props = {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
};

const formSchema = z.object({
  name: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  sizeId: z.string().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
});

type ProductFormType = z.infer<typeof formSchema>;

const ProductForm = ({ initialData, categories, sizes, colors }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const origin = useOrigin();

  const form = useForm<ProductFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit product" : "Create product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create";

  const handleSubmit = async (values: ProductFormType) => {
    const {
      name,
      images,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = values;
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          {
            name,
            images,
            price,
            categoryId,
            colorId,
            sizeId,
            isFeatured,
            isArchived,
          }
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, {
          name,
          images,
          price,
          categoryId,
          colorId,
          sizeId,
          isFeatured,
          isArchived,
        });
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const { storeId } = params;

    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted...");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        loading={loading}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            disabled={loading}
            size={"icon"}
            onClick={() => setIsOpen(true)}
          >
            <Trash className="h-4 2-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((item) => item.url)}
                      disabled={loading}
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter(
                            (curItem) => curItem.url !== url
                          ),
                        ])
                      }
                      onChange={(url) =>
                        field.onChange([...field.value, { url }])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Product name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            defaultValue={field.value}
                            placeholder="Select a Category"
                          >
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((categoryItem) => (
                            <SelectItem
                              key={categoryItem.id}
                              value={categoryItem.id}
                            >
                              {categoryItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            defaultValue={field.value}
                            placeholder="Select a size"
                          >
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sizes.map((sizeItem) => (
                            <SelectItem key={sizeItem.id} value={sizeItem.id}>
                              {sizeItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            defaultValue={field.value}
                            placeholder="Select a color"
                          >
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colors.map((colorItem) => (
                            <SelectItem key={colorItem.id} value={colorItem.id}>
                              {colorItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="isFeatured"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row p-4 items-start space-x-3 space-y-0 border rounded-sm">
                  <FormControl>
                    <>
                      <Checkbox
                        id="isFeatured"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="isArchived"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row p-4 items-start space-x-3 space-y-0 border rounded-sm">
                  <FormControl>
                    <>
                      <Checkbox
                        id="isArchived"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default ProductForm;
