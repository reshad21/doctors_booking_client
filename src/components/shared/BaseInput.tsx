"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import type React from "react";

interface BaseInputProps {
  name: string;
  title?: string;
  placeholder?: string;
  classname?: string;
  label?:string;
  icon?: React.ReactNode;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
}

const BaseInput = ({
  name,
  title,
  placeholder,
  classname,
  icon,
  label,
  type ,
}: BaseInputProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {title && (
            <FormLabel className="text-[#5A5A5A] text-sm ">{title}</FormLabel>
          )}
          <FormControl>
            <div className="relative">
              {icon && (
                <div className="absolute inset-y-0 left-3 flex items-center text-[#5F5974]">
                  {icon}
                </div>
              )}
              <label htmlFor="">{label}</label>
              <Input
                {...field}
                type={type}
                placeholder={placeholder || "Text"}
                className={cn(
                  icon ? "pl-10" : "",
                  "border-[#A0B19E] rounded-[4px] h-12 border text-[#5F597480]",
                  classname
                )}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BaseInput;
