import type React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import BaseSelect from "@/components/shared/BaseSelect";
import BaseInput from "@/components/shared/BaseInput";
import type { Chamber } from "@/types/chamber.types";
import { clearChamber } from "@/redux/slices/chamberSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

interface FormData {
  date: string;
  chamber: string;
}

interface HeaderSelectProps {
  chambersData: Chamber[];
  selected: {
    date: string;
    chamber: string;
  };
  onChange: (val: { date: string; chamber: string }) => void;
}

const HeaderSelect: React.FC<HeaderSelectProps> = ({
  chambersData,
  selected,
  onChange,
}) => {
  const dispatch = useAppDispatch();
  const methods = useForm<FormData>({
    defaultValues: {
      date: selected.date || "",
      chamber: selected.chamber || "",
    },
  });

  // Update form values when selected prop changes
  useEffect(() => {
    methods.reset({
      date: selected.date || "",
      chamber: selected.chamber || "",
    });
  }, [selected.date, selected.chamber, methods]);

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
    methods.reset({ date: "", chamber: "" });
    onChange({ date: "", chamber: "" });
    dispatch(clearChamber({ page: "appointment-management" }));
  };

  return (
    <div className="w-full mx-auto">
      <FormProvider {...methods}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white p-4">
          {/* Date Selection */}
          <div className="flex-1 min-w-0 sm:max-w-sm">
            <span className="block text-sm mb-1 font-medium">Select Date</span>
            <BaseInput
              name="date"
              classname="border-[#A0B19E] rounded-[4px] !h-10 border text-[#5F597480] w-full bg-slate-50"
              type="date"
              placeholder="Date"
            />
          </div>
          {/* Chamber Selection */}
          <div className="flex-1 min-w-0">
            <span className="block text-sm mb-1 font-medium">Chamber</span>
            <BaseSelect
              key={selected.chamber}
              name="chamber"
              value={selected.chamber}
              options={chamberOptions.map((chamber) => ({
                name: chamber.name,
                value: chamber.val,
              }))}
              onChange={(val) => {
                methods.setValue("chamber", val);
                handleSend();
              }}
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

export default HeaderSelect;
