/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
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

interface DosageTimingRowProps {
  medicineId: string;
  timingIndex: number;
}

const DosageTimingRow = ({ medicineId, timingIndex }: DosageTimingRowProps) => {
  const form = useFormContext();
  const count = timingIndex + 1;

  const [createMedicineDosage] = useCreateMedicineDosagesMutation();
  const { data: medicinesDosages } = useGetMedicinesDosagesQuery({
    limit: 200,
  });
  const [createMedicineTime] = useCreateMedicineTimeMutation();
  const { data: medicinesTimes } = useGetMedicinesTimeQuery({ limit: 200 });

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

              {component === "duration" && <DurationInput name={fieldName} />}

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
  );
};

export default DosageTimingRow;
