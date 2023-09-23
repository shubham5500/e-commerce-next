"use client";

import useIsMounted from "@/hooks/useIsMounted";
import React from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget, CldUploadWidgetResults } from "next-cloudinary";

type Props = {
  disabled?: boolean;
  onChange: (val: any) => void;
  onRemove: (val: string) => void;
  value: string[];
};

const ImageUpload = ({ disabled, onChange, onRemove, value = [] }: Props) => {
  const isMounted = useIsMounted();
  const onUpload = (result: any) => {
    onChange(result?.info?.secure_url || '');
  };

  if (!isMounted) {
    return null;
  }

  console.log({value})
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant={"destructive"}
                size={"icon"}
              >
                <Trash className="h-4 w-4" />
              </Button>
              
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset={"t2suiu3y"}>
        {({ open }) => {
          return (
            <div>
              <Button
                variant={"secondary"}
                onClick={() => open()}
                type="button"
                disabled={disabled}
              >
                <ImagePlus className="h-4 w-4" />
                Upload an Image
              </Button>
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
