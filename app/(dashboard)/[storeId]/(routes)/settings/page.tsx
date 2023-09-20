import prismadb from "@/lib/prismadb";
import { redirectUnauthorized } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";
import SettingsForm from "./components/settings-form";

type Props = {
  params: {
    storeId: string;
  };
};

const SettingPage = async ({ params: { storeId } }: Props) => {
  const userId = redirectUnauthorized();

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingPage;
