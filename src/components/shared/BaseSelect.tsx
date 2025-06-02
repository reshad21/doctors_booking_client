import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface BaseSelectProps {
  placeholder?: string;
  title?: string;
}

const BaseSelect = ({ placeholder, title }: BaseSelectProps) => {
  const [status, setStatus] = useState("active");
  return (
    <div>
      {title && (
        <label className="text-[#5A5A5A] text-sm font-medium text-[16px] mb-2 block">
          {title}
        </label>
      )}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full rounded-[4px] border-[#A0B19E] h-12 border text-[#5F597480]">
          <SelectValue placeholder={placeholder || 'Select'} />
        </SelectTrigger>
        <SelectContent>
          <div className="text-xs text-gray-500 py-1.5">Select</div>
          <SelectItem
            value="active"
            className="data-[state=checked]:bg-green-700 data-[state=checked]:text-white focus:bg-green-700 focus:text-white"
          >
            Active
          </SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BaseSelect;
