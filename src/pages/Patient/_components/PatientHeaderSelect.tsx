"use client";

import type React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import BaseSelect from "@/components/shared/BaseSelect";
import BaseInput from "@/components/shared/BaseInput";
import type { Chamber } from "@/types/chamber.types";

interface FormData {
  startDate: string;
  endDate: string;
  chamber: string;
}

interface HeaderSelectProps {
  chambersData: Chamber[];
  selected: {
    startDate: string;
    endDate: string;
    chamber: string;
  };
  onChange: (val: { startDate: string; endDate: string; chamber: string }) => void;
}

const PatientHeaderSelect: React.FC<HeaderSelectProps> = ({
  chambersData,
  selected,
  onChange,
}) => {
  const methods = useForm<FormData>({
    defaultValues: {
      startDate: selected.startDate || "",
      endDate: selected.endDate || "",
      chamber: selected.chamber || "",
    },
  });

  const chamberOptions = (chambersData || []).map((chamber: Chamber) => ({
    name: chamber.name,
    val: chamber.id,
  }));

  // Handle send button click
  const handleSend = methods.handleSubmit((data) => {
    onChange(data);
  });

  // Handle cross button click
  const handleClose = () => {
    methods.reset();
    onChange({ startDate: "", endDate: "", chamber: "" });
  };

  return (
    <div className="w-full mx-auto">
      <FormProvider {...methods}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white p-4">
          {/* Start Date Selection */}
          <div className="flex-1 min-w-0 sm:max-w-sm">
            <span className="block text-sm mb-1 font-medium">Start Date</span>
            <BaseInput
              name="startDate"
              classname="border-[#A0B19E] rounded-[4px] !h-10 border text-[#5F597480] w-full bg-slate-50"
              type="date"
              placeholder="Start Date"
            />
          </div>
          {/* End Date Selection */}
          <div className="flex-1 min-w-0 sm:max-w-sm">
            <span className="block text-sm mb-1 font-medium">End Date</span>
            <BaseInput
              name="endDate"
              classname="border-[#A0B19E] rounded-[4px] !h-10 border text-[#5F597480] w-full bg-slate-50"
              type="date"
              placeholder="End Date"
            />
          </div>
          {/* Chamber Selection */}
          <div className="flex-1 min-w-0">
            <span className="block text-sm mb-1 font-medium">Chamber</span>
            <BaseSelect
              name="chamber"
              options={chamberOptions.map((chamber) => ({
                name: chamber.name,
                value: chamber.val,
              }))}
              className="w-full border-[#A0B19E] rounded-[4px] !h-10 border text-[#5F597480] bg-slate-50"
            />
          </div>
          <div className="flex gap-2 justify-end sm:justify-start sm:flex-shrink-0 sm:self-end">
            <Button
              type="button"
              variant="default"
              className="h-11 px-6 cursor-pointer bg-brand text-white rounded-sm"
              onClick={handleSend}
            >
              Send
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 cursor-pointer border-gray-300 hover:bg-slate-50 bg-white rounded-sm"
              onClick={handleClose}
            >
              <X className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default PatientHeaderSelect;
