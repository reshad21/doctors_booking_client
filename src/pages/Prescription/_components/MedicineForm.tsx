/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState, useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import ReactSelectCompo from "./ReactSelectCompo";
import BaseInput from "@/components/shared/BaseInput";
import { Plus, X, AlertTriangle } from "lucide-react";
import DurationInput from "./DurationInput";
import MedicineSelect from "./MedicineSelect";
import { CreateFn, dosageOptions, timeOptions } from "./CreateFn";
import {
  useCreateMedicineDosagesMutation,
  useGetMedicinesDosagesQuery,
} from "@/redux/api/manualData/manualData";
import toast from "react-hot-toast";

interface MedicineItem {
  content: string;
  medicineName: string;
  DosageSchedule: Array<{
    day: string;
    dosage: string;
    time: string;
    comment: string;
  }>;
}

interface MedicineFormProps {
  type: string;
  onValidationError: (error: string) => void;
}

const MedicineForm = ({ type, onValidationError }: MedicineFormProps) => {
  const form = useFormContext();

  const [medicineInputCount, setMedicineInputCount] = useState<MedicineItem[]>([
    {
      content: Date.now().toString(),
      medicineName: "",
      DosageSchedule: [{ day: "", dosage: "", time: "", comment: "" }],
    },
  ]);

  const [timingCounts, setTimingCounts] = useState<Record<string, number>>({});
  const [duplicateErrors, setDuplicateErrors] = useState<
    Record<string, string>
  >({});
  
  // Add state for dynamic dosage options
// Remove unused state since allDosageOptions handles the merged options

  // Memoize medicine field names to prevent unnecessary changes
  const medicineFieldNames = useMemo(
    () => medicineInputCount?.map((item) => `medicine-${item.content}`) || [],
    [medicineInputCount]
  );

  const [createMedicineDosage] = useCreateMedicineDosagesMutation();
  const { data: medicinesDosages } = useGetMedicinesDosagesQuery({
    limit: 200,
  });

  // Watch all medicine fields for changes
  const medicineFieldValues = form.watch(medicineFieldNames);

  // Validate unique medicines
  const validateUniqueMedicines = useCallback(() => {
    if (!medicineInputCount || medicineInputCount.length <= 1) {
      return true;
    }

    const selectedMedicines = new Set<string>();
    const duplicates: string[] = [];

    medicineInputCount.forEach((item) => {
      const fieldValue = form.getValues(`medicine-${item.content}`);
      if (fieldValue) {
        const medicineValue = fieldValue.value || fieldValue;
        const medicineLabel = fieldValue.label || fieldValue;

        if (medicineValue && medicineValue.trim()) {
          if (selectedMedicines.has(medicineValue)) {
            duplicates.push(medicineLabel);
          } else {
            selectedMedicines.add(medicineValue);
          }
        }
      }
    });

    if (duplicates.length > 0) {
      const errorMessage = `Duplicate medicines found: ${duplicates.join(", ")}. Please select different medicines.`;
      onValidationError(errorMessage);
      return false;
    } else {
      onValidationError("");
      return true;
    }
  }, [medicineInputCount, form, onValidationError]);

  // Handle duplicate medicine validation
  useEffect(() => {
    const selected = new Set<string>();
    const errors: Record<string, string> = {};

    medicineInputCount?.forEach((item, idx) => {
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
    medicineInputCount?.forEach((item) => {
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
  }, [medicineInputCount, medicineFieldValues, form]);

  // Validate on form submission
  useEffect(() => {
    if (medicineInputCount && medicineInputCount.length > 1) {
      const timeoutId = setTimeout(() => {
        validateUniqueMedicines();
      }, 100);

      return () => clearTimeout(timeoutId);
    } else {
      onValidationError("");
    }
  }, [
    medicineInputCount,
    medicineFieldValues,
    validateUniqueMedicines,
    onValidationError,
  ]);

  // Initialize timing counts when medicineInputCount changes
  useEffect(() => {
    if (medicineInputCount && medicineInputCount.length > 0) {
      setTimingCounts((prev) => {
        const newTimingCounts: Record<string, number> = { ...prev };

        medicineInputCount.forEach((item) => {
          if (!(item.content in newTimingCounts)) {
            // Set timing count based on existing DosageSchedule or default to 1
            newTimingCounts[item.content] = item.DosageSchedule?.length || 1;
          }
        });

        // Remove timing counts for medicines that no longer exist
        Object.keys(newTimingCounts).forEach((key) => {
          if (!medicineInputCount.some((item) => item.content === key)) {
            delete newTimingCounts[key];
          }
        });

        return newTimingCounts;
      });
    }
  }, [medicineInputCount]);

  // Set form values from existing data when component mounts or data changes
  useEffect(() => {
    if (medicineInputCount && medicineInputCount.length > 0) {
      medicineInputCount.forEach((med) => {
        // Set medicine name if it exists
        if (med.medicineName && !form.getValues(`medicine-${med.content}`)) {
          form.setValue(`medicine-${med.content}`, med.medicineName);
        }

        // Set dosage schedule values
        if (med.DosageSchedule && med.DosageSchedule.length > 0) {
          med.DosageSchedule.forEach((ds, index) => {
            const idx = index + 1;
            if (ds.day) form.setValue(`${idx}-duration-${med.content}`, ds.day);
            if (ds.dosage)
              form.setValue(`${idx}-dosage-${med.content}`, ds.dosage);
            if (ds.time) form.setValue(`${idx}-time-${med.content}`, ds.time);
            if (ds.comment)
              form.setValue(`${idx}-comment-${med.content}`, ds.comment);
          });
        }
      });
    }
  }, [medicineInputCount, form]);

  const handleAddMedicineInput = useCallback(() => {
    // Store current form values
    const currentValues = form.getValues();

    const newId = Date.now().toString();
    setMedicineInputCount((prev) => [
      ...prev,
      {
        content: newId,
        medicineName: "",
        DosageSchedule: [{ day: "", dosage: "", time: "", comment: "" }],
      },
    ]);

    // Restore form values after a brief delay to ensure the new medicine is added
    setTimeout(() => {
      Object.keys(currentValues).forEach((key) => {
        const currentValue = form.getValues(key);
        if (
          currentValues[key] !== undefined &&
          currentValues[key] !== "" &&
          !currentValue
        ) {
          form.setValue(key, currentValues[key], { shouldValidate: false });
        }
      });
    }, 50);
  }, [form]);

  const handleRemoveMedicineInput = useCallback(
    (contentToDelete: string) => {
      // Store current values before removal
      const currentValues = form.getValues();

      setMedicineInputCount((prev) =>
        prev.filter((item) => item.content !== contentToDelete)
      );

      // Remove all related fields from form state
      const allFormValues = form.getValues();
      Object.keys(allFormValues).forEach((key) => {
        if (
          key.endsWith(`-${contentToDelete}`) ||
          key === `medicine-${contentToDelete}`
        ) {
          form.unregister(key);
        }
      });

      // Clean up form fields for the removed medicine
      Object.keys(currentValues).forEach((key) => {
        if (
          key.endsWith(`-${contentToDelete}`) ||
          key.startsWith(`${contentToDelete}-`)
        ) {
          form.unregister(key);
        }
      });
    },
    [form]
  );

  const addTimingSet = useCallback((id: string) => {
    setTimingCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  }, []);

  // Listen for initialization event from UpdatePrescription
  useEffect(() => {
    if (type === "update") {
      const handleInitialize = (event: CustomEvent) => {
        const { medicines } = event.detail;
        if (medicines && medicines.length > 0) {
          setMedicineInputCount(medicines);
        }
      };

      window.addEventListener(
        "initializeMedicineForm",
        handleInitialize as EventListener
      );

      return () => {
        window.removeEventListener(
          "initializeMedicineForm",
          handleInitialize as EventListener
        );
      };
    }
  }, [type]);

  const removeTimingSet = useCallback(
    (id: string) => {
      setTimingCounts((prev) => {
        const newCount = Math.max((prev[id] || 1) - 1, 1);

        // If we're removing a timing set, also clean up the form fields
        if (prev[id] && prev[id] > newCount) {
          const timingIndex = prev[id]; // This is the timing we're removing
          const fieldsToRemove = [
            `${timingIndex}-dosage-${id}`,
            `${timingIndex}-duration-${id}`,
            `${timingIndex}-time-${id}`,
            `${timingIndex}-comment-${id}`,
          ];

          fieldsToRemove.forEach((fieldName) => {
            form.unregister(fieldName);
          });
        }

        return {
          ...prev,
          [id]: newCount,
        };
      });
    },
    [form]
  );

  let dynamicMedicineCount = medicineInputCount;
  if (dynamicMedicineCount && dynamicMedicineCount.length === 0) {
    dynamicMedicineCount = [
      ...dynamicMedicineCount,
      { content: Date.now().toString(), medicineName: "", DosageSchedule: [] },
    ];
  }

  // Save new dosage option
  const handleSaveNewDosage = async (inputValue: string) => {
    try {
      await CreateFn(inputValue, createMedicineDosage);

      // Add to dynamic options
      // setDynamicDosageOptions((prevOptions) => [
      //   ...prevOptions,
      //   { value: inputValue, label: inputValue },
      // ]);
    } catch (error) {
      toast.error("Failed to save new dosage option");
      console.error("Error saving new dosage option:", error);
    }
  };

  // Merge API dosage options with dynamic options
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

  return (
    <div className="space-y-6">
      {dynamicMedicineCount?.map((item, _idx) => {
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
                                    options={allDosageOptions}
                                    control={form.control}
                                    showSelectedBox={false}
                                    onCreateOption={handleSaveNewDosage}
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
                                    placeholder="E.G. After food"
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
