"use client";

import React, { useRef, useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BaseImageUploadProps {
  classname?: string;
  onFileChange?: (file: File | null) => void;
  defaultImage?: string | null;
}

const BaseImageUpload = ({ classname, onFileChange, defaultImage }: BaseImageUploadProps) => {
  const [image, setImage] = useState<string | null>(defaultImage || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (onFileChange) {
      onFileChange(file || null);
    }
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

  // Update image if defaultImage changes (e.g., when editing different staff)
  useEffect(() => {
    if (defaultImage) {
      setImage(defaultImage);
    }
  }, [defaultImage]);

  return (
    <div>
      <div
        className={cn(
          "border border-gray-300 rounded-md p-3 text-center bg-[#D9D9D9] min-h-[20px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200",
          classname
        )}
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
