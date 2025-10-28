import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface DurationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DurationInput({
  value,
  onChange,
  placeholder = "Duration...",
}: DurationInputProps) {
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleCustomSave = () => {
    onChange(tempValue);
    setCustomOpen(false);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCustomSave();
    } else if (e.key === "Escape") {
      setTempValue(value);
      setCustomOpen(false);
    }
  };

  const handleNumberClick = (num: number) => {
    onChange(num.toString());
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white min-h-[40px] flex items-center cursor-pointer hover:border-gray-400 transition-colors">
          {value || <span className="text-gray-400">{placeholder}</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start" side="top">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                value === num.toString()
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-green-500 hover:bg-green-50"
              }`}
            >
              {num}
            </button>
          ))}
          <Popover open={customOpen} onOpenChange={setCustomOpen}>
            <PopoverTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTempValue(value);
                }}
                className="h-10 w-10 rounded-full bg-white text-gray-700 border border-gray-300 hover:border-green-500 hover:bg-green-50 flex items-center justify-center text-sm font-medium transition-all"
              >
                ...
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end" side="top">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Enter Duration
                  </label>
                  <Input
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCustomSave}
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setTempValue(value);
                      setCustomOpen(false);
                    }}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </PopoverContent>
    </Popover>
  );
}
