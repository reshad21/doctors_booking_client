import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type DurationUnit = "দিন" | "সপ্তাহ" | "মাস" | "বছর";

type DurationInputProps = {
  name: string; // e.g. "1-duration-medicineId"
  defaultUnit?: DurationUnit;
  defaultValue?: number;
};

const DurationInput = ({
  name,
  defaultUnit = "দিন",
  defaultValue,
}: DurationInputProps) => {
  const { register, setValue } = useFormContext();
  const [value, setLocalValue] = useState(defaultValue || "");
  const [unit, setUnit] = useState<DurationUnit>(defaultUnit);

  // Update RHF whenever local state changes
  useEffect(() => {
    if (value && unit) {
      setValue(name, `${value} ${unit}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [value, unit, name, setValue]);

  return (
    <div
      className="w-full border bg-white text-sm flex"
      style={{ height: "52px", borderColor: "#A0B19E", borderRadius: "6px" }}
    >
      <Input
        type="number"
        min="1"
        value={value}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="7"
        onWheel={(e) => e.preventDefault()}
        className="focus:outline-none rounded-s-sm rounded-e-none border-none h-[50px]"
      />
      <div
        style={{ width: "1px", height: "100%", backgroundColor: "#A0B19E" }}
      />
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value as DurationUnit)}
        className="focus-within:outline-none focus-visible:outline-none cursor-pointer"
      >
        <option value="দিন">দিন</option>
        <option value="সপ্তাহ">সপ্তাহ</option>
        <option value="মাস">মাস</option>
        <option value="বছর">বছর</option>
      </select>

      {/* Hidden input for RHF */}
      <input type="hidden" {...register(name)} />
    </div>
  );
};

export default DurationInput;
