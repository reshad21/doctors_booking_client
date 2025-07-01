"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const BaseImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <div
        className="border border-gray-300 rounded-md p-3 text-center bg-[#D9D9D9] min-h-[20px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={handleUploadClick}
      >
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {image ? (
          <div className="flex flex-col items-center">
            <img
              src={image || "/placeholder.svg"}
              alt="Preview"
              className="max-h-20 max-w-20 rounded-md border border-gray-200 shadow-sm object-cover"
            />
            <span className="text-xs text-gray-500 mt-2">Click to change</span>
          </div>
        ) : (
          <div className="text-black flex items-center">
            <span className="text-sm mr-1">Upload Image</span>
            <span className="p-0.5 rounded-full bg-white">
              <Plus className="size-4" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseImageUpload;
