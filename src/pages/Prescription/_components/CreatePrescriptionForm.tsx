/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ReactSelectCompo from "./ReactSelectCompo";
import MedicineForm from "./MedicineForm";
import { X } from "lucide-react";
import { Form } from "@/components/ui/form";
import {
  useGetChiefComplaintQuery,
  useGetDiagnosisQuery,
  useGetInvestigationQuery,
  useGetOnExaminationsQuery,
} from "@/redux/api/manualData/manualData";
import { dosageOptions, InputOptions, timeOptions } from "./CreateFn";
import { useGetAdviceQuery } from "@/redux/api/advice/advice";

type OptionType = {
  value: string;
  label: string;
};
const medicineOptions: OptionType[] = [
  { value: "paracetamol", label: "Paracetamol" },
  { value: "ibuprofen", label: "Ibuprofen" },
  { value: "amoxicillin", label: "Amoxicillin" },
];
import { useEffect } from "react";
const CreatePrescriptionForm = ({
  form,
  onSubmit,
  patient,
  handleAdviceChange,
  medicineInputCount,
  handleRemoveMedicineInput,
  handleAddMedicineInput,
  handleAdviceInputChange,
  dynamicOptions = {},
}: any) => {
  const [timingCounts, setTimingCounts] = useState<Record<string, number>>({});

  // Initialize timingCounts from medicineInputCount (for update mode)
  useEffect(() => {
    if (medicineInputCount && medicineInputCount.length > 0) {
      const initialCounts: Record<string, number> = {};
      medicineInputCount?.forEach((item: any) => {
        if (item.DosageSchedule && Array.isArray(item.DosageSchedule)) {
          initialCounts[item.content] = item.DosageSchedule.length;
        } else {
          initialCounts[item.content] = 1;
        }
      });
      setTimingCounts(initialCounts);
    }
  }, [medicineInputCount]);
  const { data: onExaminations } = useGetOnExaminationsQuery(undefined);
  const { data: investigations } = useGetInvestigationQuery(undefined);
  const { data: diagnosis } = useGetDiagnosisQuery(undefined);
  const { data: chiefComplaint } = useGetChiefComplaintQuery(undefined);
  const { data: advice } = useGetAdviceQuery(undefined);

  const handleAdviceSave = (value: string) => {
    handleAdviceChange(value);
  };

  const handleAdviceSaveInput = (value: string, label: string) => {
    handleAdviceInputChange(value, label);
  };

  // Sync all visible timing set values with the form state
  const syncAllTimingSetValues = () => {
    medicineInputCount?.forEach((med: any) => {
      const count = timingCounts[med.content] || 1;
      for (let i = 0; i < count; i++) {
        const idx = i + 1;
        const ds =
          med.DosageSchedule && med.DosageSchedule[i]
            ? med.DosageSchedule[i]
            : {};
        form.setValue(`${idx}-duration-${med.content}`, ds.day || "");
        form.setValue(`${idx}-dosage-${med.content}`, ds.dosage || "");
        form.setValue(`${idx}-time-${med.content}`, ds.time || "");
        form.setValue(`${idx}-comment-${med.content}`, ds.comment || "");
      }
    });
  };

  useEffect(() => {
    // If this is update mode (medicineInputCount has DosageSchedule), sync values
    if (
      medicineInputCount &&
      medicineInputCount.some(
        (item: any) =>
          Array.isArray(item.DosageSchedule) && item.DosageSchedule.length > 0
      )
    ) {
      syncAllTimingSetValues();
    }
  }, []);

  const addTimingSet = (medicineId: string) => {
    setTimingCounts((prev) => ({
      ...prev,
      [medicineId]: (prev[medicineId] || 0) + 1,
    }));
  };

  const removeTimingSet = (medicineId: string) => {
    setTimingCounts((prev) => {
      const currentCount = prev[medicineId] || 1;
      const newCount = Math.max(currentCount - 1, 1);
      // Unregister the last timing set fields for this medicine
      if (currentCount > 1) {
        const idx = currentCount; // 1-based
        ["duration", "dosage", "time", "comment"]?.forEach((field) => {
          form.unregister(`${idx}-${field}-${medicineId}`);
        });
      }
      return {
        ...prev,
        [medicineId]: newCount,
      };
    });
  };
  const onExaminationOptions =
    InputOptions(onExaminations, "onExaminations") || [];
  const investigationOptions =
    InputOptions(investigations, "investigations") || [];
  const diagnosisOptions = InputOptions(diagnosis, "diagnosis") || [];
  const chiefComplaintOptions =
    InputOptions(chiefComplaint, "chiefComplaint") || [];
  const adviceOptions = InputOptions(advice, "advice") || [];

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Patient Info Section */}
      <div className="flex justify-between items-center w-full">
        {["name", "age", "date", "Id"].map((item) => (
          <div className="w-[48%] sm:w-[22%] min-w-[150px]" key={item}>
            <div className="flex items-center gap-2">
              <label className="font-semibold text-xs">{item}</label>
              <span className="border-b border-dashed w-full">
                {item === "name" && patient?.patient?.name}
                {item === "age" && patient?.patient?.age}
                {item === "date" && "2323"}
                {item === "Id" && (
                  <span className="text-[10px] bg-green-600 text-green-100 p-1 rounded-md">
                    generating
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Multi-Select Section */}
      <div>
        <div className="w-full grid grid-cols-2 gap-4">
          {[
            "Chief-Complaint",
            "On-Examinations",
            "Diagnosis",
            "Investigation",
          ].map((label) => {
            const fieldName = label.toLowerCase();
            const staticOptions =
              label === "Chief-Complaint"
                ? chiefComplaintOptions || []
                : label === "On-Examinations"
                  ? onExaminationOptions || []
                  : label === "Diagnosis"
                    ? diagnosisOptions || []
                    : investigationOptions || [];
            const mergedOptions = [
              ...staticOptions,
              ...(dynamicOptions[fieldName] || []),
            ];
            return (
              <ReactSelectCompo
                key={label}
                label={label}
                name={fieldName}
                options={mergedOptions}
                control={form.control}
                isMulti
                showSelectedBox
                onCreateOption={(inputValue) =>
                  handleAdviceSaveInput &&
                  handleAdviceSaveInput(inputValue, label)
                }
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <hr className="text-gray-400 w-[50%]" />
        <X size={15} className="text-gray-400" />
        <hr className="text-gray-400 w-[50%]" />
      </div>

      {/* Medicine Form Section */}
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <MedicineForm
              form={form}
              onSubmit={onSubmit}
              medicineInputCount={medicineInputCount}
              timingCounts={timingCounts}
              medicineOptions={medicineOptions}
              dosageOptions={dosageOptions}
              timeOptions={timeOptions}
              addTimingSet={addTimingSet}
              removeTimingSet={removeTimingSet}
              handleRemoveMedicineInput={handleRemoveMedicineInput}
              handleAddMedicineInput={handleAddMedicineInput}
              handleAdviceSave={handleAdviceSave}
              handleAdviceSaveInput={handleAdviceSaveInput}
            />

            <ReactSelectCompo
              label="Advice"
              name={"advice"}
              options={adviceOptions || []}
              control={form.control}
              isMulti
              showSelectedBox
              onCreateOption={(inputValue) =>
                handleAdviceSave && handleAdviceSave(inputValue)
              }
            />
            {/* Save / Cancel */}
            <div className="flex justify-start items-start gap-4 max-w-sm">
              <button
                type="submit"
                className="bg-brand font-semibold text-xs text-white px-5 py-2 rounded-sm"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-[#FB160A] text-xs text-white px-5 py-2 rounded-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePrescriptionForm;
