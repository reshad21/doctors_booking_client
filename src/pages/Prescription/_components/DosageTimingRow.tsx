/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import ReactSelectCompo from "./ReactSelectCompo";
import BaseInput from "@/components/shared/BaseInput";
import DurationInput from "./DurationInput";
import { CreateFn, dosageOptions, timeOptions } from "./CreateFn";
import {
  useCreateMedicineDosagesMutation,
  useCreateMedicineTimeMutation,
  useGetMedicinesDosagesQuery,
  useGetMedicinesTimeQuery,
} from "@/redux/api/manualData/manualData";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

interface DosageTimingRowProps {
  medicineId: string;
  timingIndex: number;
  dosageDescription?: string;
}

const DosageTimingRow = ({
  medicineId,
  timingIndex,
  dosageDescription,
}: DosageTimingRowProps) => {
  const form = useFormContext();
  const count = timingIndex + 1;

  const [createMedicineDosage] = useCreateMedicineDosagesMutation();
  const { data: medicinesDosages } = useGetMedicinesDosagesQuery({
    limit: 200,
  });
  const [createMedicineTime] = useCreateMedicineTimeMutation();
  const { data: medicinesTimes } = useGetMedicinesTimeQuery({ limit: 200 });

  // Determine if current medicine is non tablet/capsule (assumed liquid/others)
  const isNonTabCap = useMemo(() => {
    const desc = (dosageDescription || "").toLowerCase();
    return !(
      desc.includes("tab") ||
      desc.includes("tablet") ||
      desc.includes("cap") ||
      desc.includes("capsule")
    );
  }, [dosageDescription]);

  // Local states for liquid dosage style (e.g., ২ চামচ * ২ বার)
  const [qtyText, setQtyText] = useState<string>("");
  const [unitValue, setUnitValue] = useState<string>("চামচ");
  const [freqText, setFreqText] = useState<string>("");

  // Bangla number conversion
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
    (text: string): string =>
      text.replace(/[০-৯]/g, (m) => banglaToEnglish[m] || m),
    [banglaToEnglish]
  );

  const dosageFieldName = `${count}-dosage-${medicineId}`;
  const timeFieldName = `${count}-time-${medicineId}`;
  const commentFieldName = `${count}-comment-${medicineId}`;

  // Read selected unit from form and keep local unit in sync
  const watchedUnit: any = (form as any).watch?.(`unit-${medicineId}-${count}`);

  useEffect(() => {
    const nextUnit =
      (watchedUnit && (watchedUnit.value || watchedUnit)) || "চামচ";
    if (nextUnit !== unitValue) setUnitValue(nextUnit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedUnit]);

  // Sync composed values into RHF fields when liquid mode
  useEffect(() => {
    if (!isNonTabCap) return;

    // Build combined dosage value: "<qty> <unit> * <freq> বার"
    const combined =
      qtyText && freqText ? `${qtyText} ${unitValue} * ${freqText} বার` : "";
    if (form.getValues(dosageFieldName) !== combined) {
      form.setValue(dosageFieldName, combined, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    // Clear separate time field for non tab/capsule
    if (form.getValues(timeFieldName)) {
      form.setValue(timeFieldName, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [
    isNonTabCap,
    qtyText,
    unitValue,
    freqText,
    dosageFieldName,
    timeFieldName,
    commentFieldName,
    form,
  ]);

  const handleSaveNewDosage = async (inputValue: string) => {
    try {
      await CreateFn(inputValue, createMedicineDosage);
      toast.success("New dosage option saved successfully");
    } catch (error) {
      toast.error("Failed to save new dosage option");
      console.error("Error saving new dosage option:", error);
      throw error;
    }
  };

  const handleSaveNewTime = async (inputValue: string) => {
    try {
      await CreateFn(inputValue, createMedicineTime);
      toast.success("New time option saved successfully");
    } catch (error) {
      toast.error("Failed to save new time option");
      console.error("Error saving new time option:", error);
      throw error;
    }
  };

  // Merge dosage options from API and static options
  const allDosageOptions = useMemo(() => {
    const apiOptions =
      medicinesDosages?.data?.map((item: any) => ({
        value: item.value,
        label: item.value,
      })) || [];

    return [...dosageOptions, ...apiOptions].filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.value === option.value)
    );
  }, [medicinesDosages]);

  // Merge time options from API and static options
  const allTimeOptions = useMemo(() => {
    const apiOptions =
      medicinesTimes?.data?.map((item: any) => ({
        value: item.value,
        label: item.value,
      })) || [];

    return [...timeOptions, ...apiOptions].filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.value === option.value)
    );
  }, [medicinesTimes]);

  const fields = [
    {
      label: "Dosage",
      component: "select",
      options: allDosageOptions,
      onCreateOption: handleSaveNewDosage,
    },
    {
      label: "Duration",
      component: "duration",
    },
    {
      label: "Time",
      component: "select",
      options: allTimeOptions,
      onCreateOption: handleSaveNewTime,
    },
    {
      label: "Comment",
      component: "input",
      placeholder: "E.G. After food",
    },
  ];

  return (
    <>
      {!isNonTabCap && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-md">
          {fields.map(
            ({ label, component, options, onCreateOption, placeholder }) => {
              const fieldName = `${count}-${label.toLowerCase()}-${medicineId}`;
              return (
                <div key={label} className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    {label}
                  </label>
                  {component === "select" && (
                    <ReactSelectCompo
                      name={fieldName}
                      options={options || []}
                      control={form.control}
                      showSelectedBox={false}
                      onCreateOption={onCreateOption}
                    />
                  )}
                  {component === "duration" && (
                    <DurationInput name={fieldName} />
                  )}
                  {component === "input" && (
                    <BaseInput
                      name={fieldName}
                      placeholder={placeholder}
                      classname="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      )}

      {isNonTabCap && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-md">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Dosage</label>
            <div className=" bg-white text-sm flex items-center gap-2 px-1">
              {/* Quantity */}
              <Input
                type="text"
                value={qtyText}
                onChange={(e) => {
                  const raw = e.target.value;
                  const eng = convertBanglaToEnglish(raw);
                  if (raw === "" || /^\d+$/.test(eng)) {
                    setQtyText(raw);
                  }
                }}
                onWheel={(e) => e.preventDefault()}
                className="focus:outline-none border h-[48px] px-2 w-20"
                inputMode="numeric"
                pattern="[০-৯0-9]*"
                placeholder="২"
              />
              {/* Unit */}
              <select
                value={unitValue}
                onChange={(e) => setUnitValue(e.target.value)}
                className="focus-within:outline-none rounded-md border-slate-300 focus-visible:outline-none cursor-pointer px-2 h-[48px] border"
              >
                <option value="চামচ">চামচ</option>
                <option value="মিলি">মিলি</option>
                <option value="ফোঁটা">ফোঁটা</option>
              </select>
              *
              <Input
                type="text"
                value={freqText}
                onChange={(e) => {
                  const raw = e.target.value;
                  const eng = convertBanglaToEnglish(raw);
                  if (raw === "" || /^\d+$/.test(eng)) {
                    setFreqText(raw);
                  }
                }}
                onWheel={(e) => e.preventDefault()}
                className="focus:outline-none h-[48px] px-2 w-20"
                inputMode="numeric"
                pattern="[০-৯0-9]*"
                placeholder="২"
              />
              {/* Fixed 'বার' */}
              <select
                value="বার"
                className="focus-within:outline-none border rounded-md border-slate-300 focus-visible:outline-none cursor-default px-2 h-[48px] bg-transparent"
              >
                <option>বার</option>
                <option>বেলা</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Duration
            </label>
            <DurationInput name={`${count}-duration-${medicineId}`} />
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Comment</label>
            <BaseInput
              name={commentFieldName}
              placeholder="E.G. After food"
              classname="w-full rounded-md border h-[54px] border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DosageTimingRow;
