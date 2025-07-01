import React from "react";
import { useFormContext } from "react-hook-form";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BaseSelectProps {
  name: string;
  label?: string;
  options: { name: string; value: string | number }[];
}

const BaseSelect: React.FC<BaseSelectProps> = ({ name, label, options }) => {
  const { setValue, watch } = useFormContext();
  const value = watch(name);

  return (
    <div className="flex flex-col space-y-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Select onValueChange={(val) => setValue(name, val)} value={value || ""}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ name, value }) => (
            <SelectItem key={value} value={String(value)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BaseSelect;
