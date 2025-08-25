/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";

interface BaseDatePickerProps {
  name: string;
  label: string;
  value: string | undefined; // Expecting ISO string
  onChange: (dateString: string | undefined) => void; // Returns ISO string
  required?: boolean;
}

export const BaseDatePicker = ({
  // name,
  label,
  value,
  onChange,
  // required = false,
}: BaseDatePickerProps) => {
  const [open, setOpen] = useState(false);

  // Convert ISO string to Date object for the calendar
  const dateValue = value ? new Date(value) : undefined;

  return (
    <FormItem className="flex flex-col">
      <FormLabel className="pb-[0.35rem]">{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button variant="outline" className="w-full justify-start">
              {dateValue ? format(dateValue, "PPP") : "Pick a date"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-50">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={(date) => {
              if (date) {
                onChange(date.toString()); 
              } else {
                onChange(undefined);
              }
              setOpen(false);
            }}
            modifiers={{
              today: new Date(),
            }}
            modifiersClassNames={{
              today: "text-white bg-gray-500 font-semibold rounded-md",
            }}
          />
        </PopoverContent>
      </Popover>
      <FormMessage className="text-red-500 text-sm mt-1" />
    </FormItem>
  );
};