import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BaseSelectProps {
  name: string;
  label?: string;
  options: { name: string; value: string | number }[];
  className?: string;
}

const BaseSelect: React.FC<BaseSelectProps> = ({
  name,
  label,
  options,
  className,
}) => {
  const { setValue, watch } = useFormContext();
  const value = watch(name);

  return (
    <div className="flex flex-col space-y-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Select onValueChange={(val) => setValue(name, val)} value={value || ""}>
        <SelectTrigger className={cn("!h-12", className)}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="w-full rounded-[4px]">
          {options.map(({ name, value }) => (
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
  );
};

export default BaseSelect;
