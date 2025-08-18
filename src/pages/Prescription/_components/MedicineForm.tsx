/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactSelectCompo from "./ReactSelectCompo";
import BaseInput from "@/components/shared/BaseInput";
import { Plus, X } from "lucide-react";

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
  const medicineOptions = [
    { value: "paracetamol", label: "Paracetamol" },
    { value: "ibuprofen", label: "Ibuprofen" },
    { value: "amoxicillin", label: "Amoxicillin" },
  ];
  let dynamicMedicineCount = medicineInputCount;
  if (dynamicMedicineCount && dynamicMedicineCount.length == 0) {
    dynamicMedicineCount = [
      ...dynamicMedicineCount,
      { medicineName: "", DosageSchedule: [] },
    ];
  }
  return (
    <div className="space-y-6">
      {dynamicMedicineCount?.map((item: any, _idx: number) => (
        <div
          className="relative border border-gray-200 rounded-lg p-4"
          key={item.content}
        >
          {medicineInputCount.length > 1 && (
            <button
              type="button"
              onClick={() => {
                handleRemoveMedicineInput(item.content);
                const allKeys = Object.keys(form.getValues());
                allKeys.forEach((key) => {
                  if (
                    key.endsWith(`-${item.content}`) ||
                    key.startsWith(`${item.content}-`)
                  ) {
                    form.unregister(key);
                  }
                });
              }}
              className="absolute top-3 right-3 w-6 h-6 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-all duration-200"
              title="Remove Medicine"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Medicine Name
              </label>
              <ReactSelectCompo
                name={`medicine-${item.content}`}
                options={medicineOptions}
                control={form.control}
                showSelectedBox={false}
              />
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
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-md"
                      key={`${item.content}-${count}`}
                    >
                      {["Duration", "Dosage", "Time", "Comment"].map(
                        (label) => {
                          const fieldName = `${count}-${label.toLowerCase()}-${item.content}`;
                          return (
                            <div key={label} className="space-y-1">
                              <label className="text-xs font-medium text-gray-600">
                                {label}
                              </label>
                              {label === "Duration" && (
                                <BaseInput
                                  name={fieldName}
                                  placeholder="Ex: 7 days"
                                  classname="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              )}
                              {label === "Dosage" && (
                                <ReactSelectCompo
                                  name={fieldName}
                                  options={dosageOptions}
                                  control={form.control}
                                  showSelectedBox={false}
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
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                  Remove Timing
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

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
