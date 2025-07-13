"use client";

import { SelectItem } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { Select } from "@/components/ui/select";

import type React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormData {
  date: string;
  chamber: string;
}

const HeaderSelect: React.FC = () => {
  const methods = useForm<FormData>({
    defaultValues: {
      date: "",
      chamber: "",
    },
  });

  const chamberOptions = [
    { name: "Chamber 1", value: "chamber1" },
    { name: "Chamber 2", value: "chamber2" },
    { name: "Chamber 3", value: "chamber3" },
    { name: "Main Chamber", value: "main" },
    { name: "Secondary Chamber", value: "secondary" },
  ];

  const handleClose = () => {
    methods.reset();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <FormProvider {...methods}>
        <div className="flex items-center gap-6 bg-white">
          {/* Date Selection */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
              Select Date:
            </span>
            <Input
              type="text"
              placeholder="Please Select Date"
              className="h-11 w-48 border-gray-300 rounded-sm text-gray-500 placeholder:text-gray-400"
              {...methods.register("date")}
            />
          </div>

          {/* Chamber Selection */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
              Chamber
            </span>
            <div className="w-48">
              <Select
                onValueChange={(val) => methods.setValue("chamber", val)}
                value={methods.watch("chamber") || ""}
              >
                <SelectTrigger className="h-11 border-gray-300 rounded-sm text-gray-400">
                  <SelectValue placeholder="Please Select One" />
                </SelectTrigger>
                <SelectContent className="w-full rounded-[4px]">
                  {chamberOptions.map(({ name, value }) => (
                    <SelectItem
                      key={value}
                      value={String(value)}
                      className="rounded focus:bg-green-800 focus:text-white"
                    >
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Close Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 border-gray-300 hover:bg-gray-50 bg-white rounded-sm"
            onClick={handleClose}
          >
            <X className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};

export default HeaderSelect;
