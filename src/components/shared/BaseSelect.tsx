import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "../ui/form";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BaseSelectProps {
  name: string;
  label?: string;
  options: { name: string; value: string | number }[];
  className?: string;
  onChange?: (value: string) => void;
  value?: string;
}

const BaseSelect: React.FC<BaseSelectProps> = ({
  name,
  label,
  options,
  className,
  onChange,
  value,
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                if (onChange) onChange(value);
              }}
              value={value || field.value || ""}
            >
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BaseSelect;
