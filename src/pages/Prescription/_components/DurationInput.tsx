import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

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
  console.log(name, 'DurationInput rendered', defaultUnit, defaultValue)
  const { register, setValue, getValues } = useFormContext();
  // If backend returns 'চলবে', show it accordingly
  const initial = getValues(name);
  // Parse initial value if it is like '৭ দিন' or '7 দিন'
  let initialUnit: DurationUnit = defaultUnit;
  let initialValue: string = defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : "";
  if (typeof initial === "string" && initial !== "" && initial !== "চলবে") {
    const match = initial.match(/^([০-৯0-9]+)\s*(দিন|সপ্তাহ|মাস|বছর)$/);
    if (match) {
      initialValue = match[1];
      initialUnit = match[2] as DurationUnit;
    }
  } else if (initial === "চলবে") {
    initialUnit = "চলবে";
    initialValue = "";
  }
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

    // Convert to English for validation only
    const englishValue = convertBanglaToEnglish(inputValue);

    // Validate that it's a valid number, but store the original input
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

  // Update RHF whenever local state changes
  useEffect(() => {
    if (unit === "চলবে") {
      setValue(name, "চলবে", {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else if (value && unit) {
      setValue(name, `${value} ${unit}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else if (unit) {
      setValue(name, "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [value, unit, name, setValue]);

  // If backend value changes to 'চলবে', update UI accordingly
  useEffect(() => {
    if (initial === "চলবে") {
      setUnit("চলবে");
      setLocalValue("");
    }
  }, [initial]);

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

export default DurationInput;
