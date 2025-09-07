/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
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
  useCreateMedicineDosagesDayInputMutation,
  useCreateMedicineDosagesDayNameMutation,
  useGetMedicineDosagesDayInputQueryQuery,
  useGetMedicineDosagesDayNameQueryQuery,
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

  // New mutations and queries for dynamic selects
  const [createMedicineDosagesDayInput] =
    useCreateMedicineDosagesDayInputMutation();
  const [createMedicineDosagesDayName] =
    useCreateMedicineDosagesDayNameMutation();
  const { data: medicineDosagesDayInputs } =
    useGetMedicineDosagesDayInputQueryQuery({
      limit: 200,
    });
  const { data: medicineDosagesDayNames } =
    useGetMedicineDosagesDayNameQueryQuery({
      limit: 200,
    });

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

  // Merge day input options from API and static options
  const allDayInputOptions = useMemo(() => {
    const apiOptions =
      medicineDosagesDayInputs?.data?.map((item: any) => ({
        value: item.value,
        label: item.value,
      })) || [];

    const staticOptions = [
      { value: "চামচ", label: "চামচ" },
      { value: "মিলি", label: "মিলি" },
      { value: "ফোঁটা", label: "ফোঁটা" },
    ];

    return [...staticOptions, ...apiOptions].filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.value === option.value)
    );
  }, [medicineDosagesDayInputs]);

  // Merge day name options from API and static options
  const allDayNameOptions = useMemo(() => {
    const apiOptions =
      medicineDosagesDayNames?.data?.map((item: any) => ({
        value: item.value,
        label: item.value,
      })) || [];

    const staticOptions = [
      { value: "বার", label: "বার" },
      { value: "বেলা", label: "বেলা" },
    ];

    return [...staticOptions, ...apiOptions].filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.value === option.value)
    );
  }, [medicineDosagesDayNames]);

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
  const [frequencyValue, setFrequencyValue] = useState<string>("বার");

  // Ref to track if we're initializing to prevent circular updates
  const isInitializingRef = useRef(false);
  const initializedRef = useRef(false);
  const updateFormRef = useRef<NodeJS.Timeout | null>(null);
  // const updateFormRef = useRef<NodeJS.Timeout>();

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
  const unitFieldName = `unit-${medicineId}-${count}`;
  const frequencyFieldName = `frequency-${medicineId}-${count}`;
  const dosageNotesFieldName = `${count}-dosageNotes-${medicineId}`;

  // Read selected unit and frequency from form and keep local values in sync
  const watchedUnit: any = (form as any).watch?.(unitFieldName);
  const watchedFrequency: any = (form as any).watch?.(frequencyFieldName);
  const watchedDosageNotes: any = (form as any).watch?.(dosageNotesFieldName);

  // Initialize local state from dosageNotes ONLY ONCE when loading from backend
  useEffect(() => {
    // Add safety checks for options being loaded
    if (
      !isNonTabCap ||
      initializedRef.current ||
      !allDayInputOptions ||
      !allDayNameOptions
    )
      return;
    if (allDayInputOptions.length === 0 || allDayNameOptions.length === 0)
      return;

    console.log("DosageTimingRow Debug:", {
      isNonTabCap,
      watchedDosageNotes,
      dosageNotesFieldName,
      medicineId,
      count,
      allDayInputOptions: allDayInputOptions.length,
      allDayNameOptions: allDayNameOptions.length,
    });

    if (
      watchedDosageNotes &&
      Array.isArray(watchedDosageNotes) &&
      watchedDosageNotes.length > 0
    ) {
      const dosageNote = watchedDosageNotes[0]; // Take the first dosage note
      console.log("Setting dosageNote values:", dosageNote);

      isInitializingRef.current = true; // Prevent circular updates

      // Set local state values
      if (dosageNote.qty) setQtyText(dosageNote.qty);
      if (dosageNote.unit) setUnitValue(dosageNote.unit);
      if (dosageNote.freq) setFreqText(dosageNote.freq);
      if (dosageNote.freqUnit) setFrequencyValue(dosageNote.freqUnit);

      // IMPORTANT: Set form values for the select components
      if (dosageNote.unit) {
        const unitOption = allDayInputOptions.find(
          (opt) => opt.value === dosageNote.unit
        );
        console.log(
          "Setting unit option:",
          unitOption,
          "for value:",
          dosageNote.unit
        );
        if (unitOption) {
          form.setValue(unitFieldName, unitOption.value, {
            shouldDirty: false,
          });
        }
      }

      if (dosageNote.freqUnit) {
        const freqOption = allDayNameOptions.find(
          (opt) => opt.value === dosageNote.freqUnit
        );
        console.log(
          "Setting freq option:",
          freqOption,
          "for value:",
          dosageNote.freqUnit
        );
        if (freqOption) {
          form.setValue(frequencyFieldName, freqOption.value, {
            shouldDirty: false,
          });
        }
      }

      initializedRef.current = true;

      // Allow updates after a short delay
      setTimeout(() => {
        isInitializingRef.current = false;
      }, 100);
    }
  }, [
    isNonTabCap,
    watchedDosageNotes,
    dosageNotesFieldName,
    medicineId,
    count,
    allDayInputOptions,
    allDayNameOptions,
    unitFieldName,
    frequencyFieldName,
    form,
  ]);

  // Sync unit and frequency from form selects
  useEffect(() => {
    if (isInitializingRef.current) return;

    const nextUnit =
      (watchedUnit && (watchedUnit.value || watchedUnit)) || "চামচ";
    if (nextUnit !== unitValue) setUnitValue(nextUnit);
  }, [watchedUnit, unitValue]);

  useEffect(() => {
    if (isInitializingRef.current) return;

    const nextFrequency =
      (watchedFrequency && (watchedFrequency.value || watchedFrequency)) ||
      "বার";
    if (nextFrequency !== frequencyValue) setFrequencyValue(nextFrequency);
  }, [watchedFrequency, frequencyValue]);

  // Sync composed values into RHF fields when liquid mode (with debouncing)
  useEffect(() => {
    if (!isNonTabCap || isInitializingRef.current) return;

    // Debounce form updates to prevent excessive re-renders
    if (updateFormRef.current) {
      clearTimeout(updateFormRef.current);
    }

    updateFormRef.current = setTimeout(() => {
      const currentUnit =
        (watchedUnit && (watchedUnit.value || watchedUnit)) ||
        unitValue ||
        "চামচ";
      const currentFreqUnit =
        (watchedFrequency && (watchedFrequency.value || watchedFrequency)) ||
        frequencyValue ||
        "বার";

      // Create dosageNotes array for non-tab/cap medicines
      if (qtyText && freqText && currentUnit && currentFreqUnit) {
        const dosageNotes = [
          {
            qty: qtyText,
            unit: currentUnit,
            freq: freqText,
            freqUnit: currentFreqUnit,
          },
        ];

        const currentDosageNotes = form.getValues(dosageNotesFieldName);
        // Only update if different to prevent loops
        if (
          JSON.stringify(currentDosageNotes) !== JSON.stringify(dosageNotes)
        ) {
          form.setValue(dosageNotesFieldName, dosageNotes, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }

        // CLEAR the dosage field when we have dosageNotes (since dosage info is in dosageNotes)
        const currentDosage = form.getValues(dosageFieldName);
        if (currentDosage) {
          form.setValue(dosageFieldName, "", {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      } else {
        // Clear dosageNotes when inputs are empty
        const currentDosageNotes = form.getValues(dosageNotesFieldName);
        if (currentDosageNotes && currentDosageNotes.length > 0) {
          form.setValue(dosageNotesFieldName, [], {
            shouldDirty: true,
            shouldValidate: true,
          });
        }

        // Also clear dosage field when no data
        const currentDosage = form.getValues(dosageFieldName);
        if (currentDosage) {
          form.setValue(dosageFieldName, "", {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }

      // Clear separate time field for non tab/capsule
      const currentTime = form.getValues(timeFieldName);
      if (currentTime) {
        form.setValue(timeFieldName, "", {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }, 300); // 300ms debounce

    return () => {
      if (updateFormRef.current) {
        clearTimeout(updateFormRef.current);
      }
    };
  }, [
    isNonTabCap,
    qtyText,
    freqText,
    unitValue,
    frequencyValue,
    watchedUnit,
    watchedFrequency,
    dosageFieldName,
    timeFieldName,
    dosageNotesFieldName,
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

  const handleSaveNewDayInput = async (inputValue: string) => {
    try {
      await CreateFn(inputValue, createMedicineDosagesDayInput);
      toast.success("New day input option saved successfully");
    } catch (error) {
      toast.error("Failed to save new day input option");
      console.error("Error saving new day input option:", error);
      throw error;
    }
  };

  const handleSaveNewDayName = async (inputValue: string) => {
    try {
      await CreateFn(inputValue, createMedicineDosagesDayName);
      toast.success("New day name option saved successfully");
    } catch (error) {
      toast.error("Failed to save new day name option");
      console.error("Error saving new day name option:", error);
      throw error;
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-md">
          <div className="space-y-1 col-span-2">
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
                className="focus:outline-none border h-[53px] px-2 w-20"
                inputMode="numeric"
                pattern="[০-৯0-9]*"
                placeholder="২"
              />
              {/* Unit */}
              <div>
                <ReactSelectCompo
                  name={unitFieldName}
                  options={allDayInputOptions}
                  control={form.control}
                  showSelectedBox={false}
                  onCreateOption={handleSaveNewDayInput}
                />
              </div>
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
                className="focus:outline-none h-[53px] px-2 w-20"
                inputMode="numeric"
                pattern="[০-৯0-9]*"
                placeholder="২"
              />
              {/* Frequency */}
              <div>
                <ReactSelectCompo
                  name={frequencyFieldName}
                  options={allDayNameOptions}
                  control={form.control}
                  onCreateOption={handleSaveNewDayName}
                />
              </div>
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
