import { Input } from "@/components/ui/input";
import { useEffect, useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import React from "react";

type DurationUnit = "দিন" | "সপ্তাহ" | "মাস" | "বছর" | "চলবে";

type DurationInputProps = {
  name: string;
  defaultUnit?: DurationUnit;
  defaultValue?: number;
};

const DurationInput = ({
  name,
  defaultUnit = "দিন",
  defaultValue,
}: DurationInputProps) => {
  const { register, setValue, getValues } = useFormContext();

  const initial = getValues(name);

  // ✅ Memoize initial parsing so it doesn’t run on every render
  const { initialUnit, initialValue } = useMemo(() => {
    let unit: DurationUnit = defaultUnit;
    let val: string =
      defaultValue !== undefined && defaultValue !== null
        ? String(defaultValue)
        : "";

    if (typeof initial === "string" && initial !== "" && initial !== "চলবে") {
      const match = initial.match(/^([০-৯0-9]+)\s*(দিন|সপ্তাহ|মাস|বছর)$/);
      if (match) {
        val = match[1];
        unit = match[2] as DurationUnit;
      }
    } else if (initial === "চলবে") {
      unit = "চলবে";
      val = "";
    }

    return { initialUnit: unit, initialValue: val };
  }, [initial, defaultUnit, defaultValue]);

  const [unit, setUnit] = useState<DurationUnit>(initialUnit);
  const [value, setLocalValue] = useState<string>(initialValue);

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

  const convertBanglaToEnglish = (text: string): string => {
    return text.replace(/[০-৯]/g, (match) => banglaToEnglish[match] || match);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const englishValue = convertBanglaToEnglish(inputValue);

    if (inputValue === "" || /^\d+$/.test(englishValue)) {
      setLocalValue(inputValue);
    }
  };

  // Handle unit change
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as DurationUnit;
    setUnit(newUnit);
    if (newUnit === "চলবে") {
      setLocalValue("");
    }
  };

  // ✅ Update RHF only if value actually changed
  useEffect(() => {
    let newValue = "";

    if (unit === "চলবে") {
      newValue = "চলবে";
    } else if (value && unit) {
      newValue = `${value} ${unit}`;
    }

    const currentValue = getValues(name);
    if (currentValue !== newValue) {
      setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
    }
  }, [value, unit, name, setValue, getValues]);

  return (
    <div
      className="w-full border bg-white text-sm flex"
      style={{ height: "52px", borderColor: "#A0B19E", borderRadius: "6px" }}
    >
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={unit === "চলবে" ? "" : "৭"}
        onWheel={(e) => e.preventDefault()}
        className="focus:outline-none rounded-s-sm rounded-e-none border-none h-[50px]"
        inputMode="numeric"
        pattern="[০-৯0-9]*"
        disabled={unit === "চলবে"}
        style={{
          backgroundColor: unit === "চলবে" ? "#f9fafb" : "white",
          cursor: unit === "চলবে" ? "not-allowed" : "text",
        }}
        tabIndex={unit === "চলবে" ? -1 : 0}
        readOnly={unit === "চলবে"}
      />
      <div
        style={{ width: "1px", height: "100%", backgroundColor: "#A0B19E" }}
      />
      <select
        value={unit}
        onChange={handleUnitChange}
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

// ✅ Prevent re-renders unless props change
export default React.memo(DurationInput);
