"use client";

import React, { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { type } from "os";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";

type Props = {
  initialData: Store;
};

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingFormType = z.infer<typeof formSchema>;

const SettingsForm = ({ initialData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleSubmit = async (values: SettingFormType) => {
    console.log(values);
    const req = await axios.patch(`/api/${initialData.id}`, {name: values.name})
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          variant="destructive"
          disabled={loading}
          size={"icon"}
          onClick={() => setIsOpen(true)}
        >
          <Trash className="h-4 2-4" />
        </Button>
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;
