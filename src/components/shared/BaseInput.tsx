/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useRef, useEffect } from "react";

interface BaseInputProps {
  name: string;
  title?: string;
  placeholder?: string;
  classname?: string;
  label?: string;
  icon?: React.ReactNode;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
}

const BaseInput = ({
  name,
  title: _title,
  placeholder,
  classname,
  icon,
  label,
  type,
}: BaseInputProps) => {
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input || type !== "number") return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    input.addEventListener("wheel", handleWheel, { passive: false });
    // Uncomment the next line if you also want to disable arrow key changes
    // input.addEventListener("keydown", handleKeyDown);

    return () => {
      input.removeEventListener("wheel", handleWheel);
      // input.removeEventListener("keydown", handleKeyDown);
    };
  }, [type]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              {icon && (
                <div className="absolute inset-y-0 left-3 flex items-center text-[#5F5974]">
                  {icon}
                </div>
              )}
              <Input
                {...field}
                ref={inputRef}
                type={type}
                placeholder={placeholder || "Text"}
                onChange={(e) => {
                  if (type === "number") {
                    const val = e.target.value;
                    field.onChange(val === "" ? "" : Number(val));
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                value={
                  type === "number" && field.value === 0
                    ? field.value
                    : (field.value ?? "")
                }
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
