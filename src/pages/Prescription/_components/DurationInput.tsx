/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from "@/components/ui/input";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import React from "react";
import { cn } from "@/lib/utils";

type DurationUnit = "দিন" | "সপ্তাহ" | "মাস" | "বছর" | "চলবে";

type DurationInputProps = {
  name: string;
  defaultUnit?: DurationUnit;
  defaultValue?: number;
  className?: string;
};

const DurationInput = ({
  name,
  defaultUnit = "দিন",
  defaultValue,
  className,
}: DurationInputProps) => {
  const { register, setValue } = useFormContext();

  // ✅ Properly subscribe to form value changes
  const formValue = useWatch({ name });

  // Initialize defaults
  const { initialUnit, initialValue } = useMemo(() => {
    const unit: DurationUnit = defaultUnit;
    const val: string =
      defaultValue !== undefined && defaultValue !== null
        ? String(defaultValue)
        : "";
    return { initialUnit: unit, initialValue: val };
  }, [defaultUnit, defaultValue]);

  const [unit, setUnit] = useState<DurationUnit>(initialUnit);
  const [value, setLocalValue] = useState<string>(initialValue);

  // Bangla to English number mapping
  const banglaToEnglish: { [key: string]: string } = useMemo(
    () => ({
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
    }),
    []
  );

  const convertBanglaToEnglish = useCallback(
    (text: string): string => {
      return text.replace(/[০-৯]/g, (match) => banglaToEnglish[match] || match);
    },
    [banglaToEnglish]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const englishValue = convertBanglaToEnglish(inputValue);

      if (inputValue === "" || /^\d+$/.test(englishValue)) {
        setLocalValue(inputValue);
      }
    },
    [convertBanglaToEnglish]
  );

  // Handle unit change
  const handleUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newUnit = e.target.value as DurationUnit;
      setUnit(newUnit);
      if (newUnit === "চলবে") {
        setLocalValue("");
      }
    },
    []
  );

  // ✅ Sync local state with external form value (resets, editing, etc.)
  useEffect(() => {
    if (typeof formValue === "string") {
      if (formValue === "চলবে") {
        setUnit("চলবে");
        setLocalValue("");
      } else if (formValue !== "") {
        const match = formValue.match(/^([০-৯0-9]+)\s*(দিন|সপ্তাহ|মাস|বছর)$/);
        if (match) {
          setLocalValue(match[1]);
          setUnit(match[2] as DurationUnit);
        }
      }
    }
  }, [formValue]);

  // ✅ Update form when local state changes
  useEffect(() => {
    let newValue = "";
    if (unit === "চলবে") {
      newValue = "চলবে";
    } else if (value && unit) {
      newValue = `${value} ${unit}`;
    }

    if (formValue !== newValue) {
      setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
    }
  }, [value, unit]);

  return (
    <div
      className={cn(`w-full border bg-white text-sm flex`, className)}
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
