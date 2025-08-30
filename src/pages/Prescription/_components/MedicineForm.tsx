/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import ReactSelectCompo from "./ReactSelectCompo";
import BaseInput from "@/components/shared/BaseInput";
import { Plus, X, AlertTriangle } from "lucide-react";
import DurationInput from "./DurationInput";
import { useEffect, useState, useMemo } from "react";
import MedicineSelect from "./MedicineSelect";

const MedicineForm = ({
  form,
  medicineInputCount,
  timingCounts,
  dosageOptions,
  timeOptions,
  addTimingSet,
  removeTimingSet,
  handleAddMedicineInput,
  handleRemoveMedicineInput,
  type,
}: any) => {
  const [duplicateErrors, setDuplicateErrors] = useState<
    Record<string, string>
  >({});

  let dynamicMedicineCount = medicineInputCount;
  if (dynamicMedicineCount && dynamicMedicineCount.length == 0) {
    dynamicMedicineCount = [
      ...dynamicMedicineCount,
      { medicineName: "", DosageSchedule: [] },
    ];
  }

  // Memoize medicine field names to prevent unnecessary changes
  const medicineFieldNames = useMemo(
    () =>
      dynamicMedicineCount?.map((item: any) => `medicine-${item.content}`) ||
      [],
    [dynamicMedicineCount]
  );
  console.log(dynamicMedicineCount, 'dynamicMedicineCount')

  // Watch all medicine fields for changes
  const medicineFieldValues = form.watch(medicineFieldNames);

  useEffect(() => {
    const selected = new Set<string>();
    const errors: Record<string, string> = {};

    dynamicMedicineCount?.forEach((item: any, idx: number) => {
      const selectedValue = medicineFieldValues?.[idx];
      if (selectedValue) {
        const medicineValue = selectedValue.value || selectedValue;
        const medicineLabel = selectedValue.label || selectedValue;
        if (medicineValue && medicineValue.trim()) {
          if (selected.has(medicineValue)) {
            errors[item.content] = `"${medicineLabel}" is already selected`;
          } else {
            selected.add(medicineValue);
          }
        }
      }
    });

    // Only update state if errors actually changed
    setDuplicateErrors((prev) => {
      const prevKeys = Object.keys(prev);
      const newKeys = Object.keys(errors);
      if (
        prevKeys.length !== newKeys.length ||
        prevKeys.some((k) => prev[k] !== errors[k])
      ) {
        return errors;
      }
      return prev;
    });

    // Only set/clear errors if changed
    dynamicMedicineCount?.forEach((item: any) => {
      const fieldName = `medicine-${item.content}`;
      if (errors[item.content]) {
        if (
          form.getFieldState(fieldName)?.error?.message !== errors[item.content]
        ) {
          form.setError(fieldName, {
            type: "manual",
            message: errors[item.content],
          });
        }
      } else {
        if (form.getFieldState(fieldName)?.error) {
          form.clearErrors(fieldName);
        }
      }
    });
  }, [dynamicMedicineCount, medicineFieldValues, form]);

  return (
    <div className="space-y-6">
      {dynamicMedicineCount?.map((item: any, _idx: number) => {
        const hasError = duplicateErrors[item.content];

        return (
          <div
            className={`relative border rounded-lg bg-slate-100 p-4 ${
              hasError ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
            key={item.content}
          >
            {medicineInputCount.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  handleRemoveMedicineInput(item.content);
                }}
                className="absolute top-3 right-3 w-6 h-6 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-all duration-200"
                title="Remove Medicine"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <MedicineSelect
                  name={`medicine-${item.content}`}
                  control={form.control}
                  placeholder="Search medicine by name, generic name, or strength..."
                />

                {hasError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{hasError}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Dosage Schedule
                </label>

                {Array.from({ length: timingCounts[item.content] || 1 }).map(
                  (_, idx2) => {
                    const count = idx2 + 1;
                    return (
                      <div
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-md"
                        key={`${item.content}-${count}`}
                      >
                        {["Dosage", "Duration", "Time", "Comment"].map(
                          (label) => {
                            const fieldName = `${count}-${label.toLowerCase()}-${item.content}`;
                            return (
                              <div key={label} className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">
                                  {label}
                                </label>
                                {label === "Dosage" && (
                                  <ReactSelectCompo
                                    name={fieldName}
                                    options={dosageOptions}
                                    control={form.control}
                                    showSelectedBox={false}
                                  />
                                )}
                                {label === "Duration" && (
                                  <DurationInput
                                    name={`${count}-duration-${item.content}`}
                                  />
                                )}
                                {label === "Time" && (
                                  <ReactSelectCompo
                                    name={fieldName}
                                    options={timeOptions}
                                    control={form.control}
                                    showSelectedBox={false}
                                  />
                                )}
                                {label === "Comment" && (
                                  <BaseInput
                                    name={fieldName}
                                    placeholder="Ex: Take after meal"
                                    classname="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => addTimingSet(item.content)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Timing
                </button>
                {type === "create" && timingCounts[item.content] > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimingSet(item.content)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Remove Timing
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleAddMedicineInput}
        className="w-full py-3 text-sm font-medium text-gray-600 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
      >
        <Plus className="w-4 h-4 inline mr-2" />
        Add Another Medicine
      </button>
    </div>
  );
};

export default MedicineForm;
