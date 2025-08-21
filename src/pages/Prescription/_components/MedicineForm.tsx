/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ReactSelectCompo from "./ReactSelectCompo";
import MedicineSelect from "./MedicineSelect.tsx";
import BaseInput from "@/components/shared/BaseInput";
import { Plus, X, AlertTriangle } from "lucide-react";
import DurationInput from "./DurationInput";
import { useGetMedicinesListQuery } from "@/redux/api/manualData/manualData";
import { useEffect, useState } from "react";

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
  const { data: medicineData, isLoading } = useGetMedicinesListQuery({
    limit: 50000,
  });

  const medicines = medicineData?.data?.data || [];
  const [selectedMedicines, setSelectedMedicines] = useState<Set<string>>(
    new Set()
  );
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

  // Track selected medicines and validate duplicates
  useEffect(() => {
    const selected = new Set<string>();
    const errors: Record<string, string> = {};

    // Collect all selections and check for duplicates
    dynamicMedicineCount?.forEach((item: any) => {
      const fieldName = `medicine-${item.content}`;
      const selectedValue = form.getValues(fieldName);

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

    setSelectedMedicines(selected);
    setDuplicateErrors(errors);

    // Set form errors for duplicate medicines
    dynamicMedicineCount?.forEach((item: any) => {
      const fieldName = `medicine-${item.content}`;
      if (errors[item.content]) {
        form.setError(fieldName, {
          type: "manual",
          message: errors[item.content],
        });
      } else {
        form.clearErrors(fieldName);
      }
    });
  }, [dynamicMedicineCount, form]);


  // Filter medicines to exclude already selected ones (except for current field)
  // Note: With 36k medicines, we'll let MedicineSelect handle filtering during search
  // This reduces the initial processing load
  const getFilteredMedicines = (currentItemContent: string) => {
    // For large datasets, we'll pass all medicines and handle filtering in MedicineSelect
    // during search to avoid processing 36k items upfront
    if (medicines.length > 10000) {
      return medicines;
    }

    const currentFieldName = `medicine-${currentItemContent}`;
    const currentValue = form.getValues(currentFieldName);

    return medicines.filter((medicine: any) => {
      const abbreviatedForm = getAbbreviatedDosageForm(
        medicine.dosageDescription
      );
      const displayName = abbreviatedForm
        ? `${abbreviatedForm} ${medicine.brandName} ${medicine.strength}`
        : `${medicine.brandName} ${medicine.strength}`;

      // Always include the currently selected medicine for this field
      if (currentValue) {
        const currentMedicineValue = currentValue.value || currentValue;
        if (currentMedicineValue === displayName) {
          return true;
        }
      }

      // Exclude medicines selected in other fields
      return !selectedMedicines.has(displayName);
    });
  };

  // Function to get abbreviated dosage form (moved here so it's accessible)
  const getAbbreviatedDosageForm = (dosageDescription: string) => {
    if (!dosageDescription) return "";

    const dosageMap: { [key: string]: string } = {
      tablet: "Tab.",
      capsule: "Cap.",
      syrup: "Syp.",
      injection: "Inj.",
      cream: "Cr.",
      ointment: "Oint.",
      drops: "Drp.",
      suspension: "Susp.",
      solution: "Sol.",
      powder: "Pwd.",
      gel: "Gel",
      lotion: "Lot.",
      spray: "Spr.",
      inhaler: "Inh.",
      suppository: "Supp.",
      patch: "Patch",
    };

    const description = dosageDescription.toLowerCase();

    // Find matching dosage form
    for (const [key, abbreviation] of Object.entries(dosageMap)) {
      if (description.includes(key)) {
        return abbreviation;
      }
    }

    // If no match found, return first word capitalized with period
    const firstWord = dosageDescription.split(" ")[0];
    return (
      firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase() + "."
    );
  };


  const handleMedicineChange = (value: any, itemContent: string) => {
    const fieldName = `medicine-${itemContent}`;

    form.clearErrors(fieldName);

    // Set the new value
    form.setValue(fieldName, value);

    // For large datasets, validate immediately without waiting
    if (medicines.length > 10000) {
      // Immediate validation for better UX with large datasets
      const allSelected = new Set<string>();

      dynamicMedicineCount?.forEach((item: any) => {
        const currentFieldName = `medicine-${item.content}`;
        let fieldValue;

        if (item.content === itemContent) {
          fieldValue = value;
        } else {
          fieldValue = form.getValues(currentFieldName);
        }

        if (fieldValue) {
          const medicineValue = fieldValue.value || fieldValue;
          if (medicineValue && medicineValue.trim()) {
            if (allSelected.has(medicineValue)) {
              form.setError(currentFieldName, {
                type: "manual",
                message: `This medicine is already selected`,
              });

            } else {
              allSelected.add(medicineValue);
              form.clearErrors(currentFieldName);
            }
          }
        }
      });
    } else {
      // For smaller datasets, use the existing trigger mechanism
      setTimeout(() => {
        form.trigger(fieldName);
      }, 0);
    }
  };

  return (
    <div className="space-y-6">
      {dynamicMedicineCount?.map((item: any, _idx: number) => {
        const filteredMedicines = getFilteredMedicines(item.content);
        const hasError = duplicateErrors[item.content];

        return (
          <div
            className={`relative border rounded-lg p-4 ${
              hasError ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
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
                <MedicineSelect
                  name={`medicine-${item.content}`}
                  control={form.control}
                  medicines={filteredMedicines}
                  isLoading={isLoading}
                  placeholder="Search medicine by name, generic name, or strength..."
                  onChange={(value: any) =>
                    handleMedicineChange(value, item.content)
                  }
                />

                {/* Show duplicate error message */}
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
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-md"
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
