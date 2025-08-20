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

  // Bangla to English number mapping
  const banglaToEnglish: { [key: string]: string } = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  // Convert Bangla numerals to English
  const convertBanglaToEnglish = (text: string): string => {
    return text.replace(/[০-৯]/g, (match) => banglaToEnglish[match] || match);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Convert to English for validation only
    const englishValue = convertBanglaToEnglish(inputValue);

    // Validate that it's a valid number, but store the original input
    if (inputValue === "" || /^\d+$/.test(englishValue)) {
      setLocalValue(inputValue); // Store original input (Bangla or English)
    }
  };

  // Update RHF whenever local state changes
  useEffect(() => {
    if (value && unit) {
      // Store the original input (Bangla or English) with unit
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
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="৭"
        onWheel={(e) => e.preventDefault()}
        className="focus:outline-none rounded-s-sm rounded-e-none border-none h-[50px]"
        inputMode="numeric"
        pattern="[০-৯0-9]*"
      />
      <div
        style={{ width: "1px", height: "100%", backgroundColor: "#A0B19E" }}
      />
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value as DurationUnit)}
        className="focus-within:outline-none focus-visible:outline-none cursor-pointer px-2"
      >
        <option value="দিন">দিন</option>
        <option value="সপ্তাহ">সপ্তাহ</option>
        <option value="মাস">মাস</option>
        <option value="বছর">বছর</option>
        <option value="চলবে">চলবে</option>
      </select>

      {/* Hidden input for RHF */}
      <input type="hidden" {...register(name)} />
    </div>
  );
};

export default DurationInput;
