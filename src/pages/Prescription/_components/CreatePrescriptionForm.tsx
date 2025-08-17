/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ReactSelectCompo from "./ReactSelectCompo";
import MedicineForm from "./MedicineForm";
import { Form } from "@/components/ui/form";
import { dosageOptions, InputOptions, timeOptions } from "./CreateFn";
import {
  useGetChiefComplaintQuery,
  useGetDiagnosisQuery,
  useGetInvestigationQuery,
  useGetOnExaminationsQuery,
} from "@/redux/api/manualData/manualData";
import { useGetAdviceQuery } from "@/redux/api/advice/advice";

const CreatePrescriptionForm = ({
  form,
  onSubmit,
  patient,
  handleAdviceChange,
  medicineInputCount,
  handleRemoveMedicineInput,
  handleAddMedicineInput,
  handleAdviceInputChange,
  setMedicineInputCount,
  dynamicOptions = {},
  type
}: any) => {
  const [timingCounts, setTimingCounts] = useState<Record<string, number>>({});
  const { data: onExaminations } = useGetOnExaminationsQuery(undefined);
  const { data: investigations } = useGetInvestigationQuery(undefined);
  const { data: diagnosis } = useGetDiagnosisQuery(undefined);
  const { data: chiefComplaint } = useGetChiefComplaintQuery(undefined);
  const { data: advice } = useGetAdviceQuery(undefined);
  // Sync timingCounts whenever medicineInputCount changes
  useEffect(() => {
    if (medicineInputCount && medicineInputCount.length > 0) {
      const newTimingCounts: Record<string, number> = { ...timingCounts };
      medicineInputCount.forEach((item: any) => {
        if (!(item.content in newTimingCounts)) {
          newTimingCounts[item.content] = item.DosageSchedule?.length || 1;
        }
      });
      setTimingCounts(newTimingCounts);

      // Preserve existing values, only set default if undefined
      medicineInputCount.forEach((med: any) => {
        const count = newTimingCounts[med.content];
        for (let i = 0; i < count; i++) {
          const idx = i + 1;
          const ds = med.DosageSchedule?.[i] || {};
          if (form.getValues(`${idx}-duration-${med.content}`) === undefined)
            form.setValue(`${idx}-duration-${med.content}`, ds.day || "");
          if (form.getValues(`${idx}-dosage-${med.content}`) === undefined)
            form.setValue(`${idx}-dosage-${med.content}`, ds.dosage || "");
          if (form.getValues(`${idx}-time-${med.content}`) === undefined)
            form.setValue(`${idx}-time-${med.content}`, ds.time || "");
          if (form.getValues(`${idx}-comment-${med.content}`) === undefined)
            form.setValue(`${idx}-comment-${med.content}`, ds.comment || "");
        }
      });
    }
  }, [medicineInputCount]);

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
                ? chiefComplaintOptions
                : label === "On-Examinations"
                  ? onExaminationOptions
                  : label === "Diagnosis"
                    ? diagnosisOptions
                    : investigationOptions;
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
                  handleAdviceInputChange(inputValue, label)
                }
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <hr className="text-gray-400 w-[50%]" />
        <div className="text-gray-400">✕</div>
        <hr className="text-gray-400 w-[50%]" />
      </div>

      {/* Medicine Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <MedicineForm
            form={form}
            medicineInputCount={medicineInputCount}
            timingCounts={timingCounts}
            dosageOptions={dosageOptions}
            timeOptions={timeOptions}
            type={type}
            addTimingSet={(id: string) =>
              setTimingCounts((prev) => ({
                ...prev,
                [id]: (prev[id] || 1) + 1,
              }))
            }
            removeTimingSet={(id: string) =>
              setTimingCounts((prev) => ({
                ...prev,
                [id]: Math.max((prev[id] || 1) - 1, 1),
              }))
            }
            handleAddMedicineInput={handleAddMedicineInput}
            handleRemoveMedicineInput={handleRemoveMedicineInput}
            setMedicineInputCount={setMedicineInputCount}
          />

          <ReactSelectCompo
            label="Advice"
            name="advice"
            options={adviceOptions || []}
            control={form.control}
            isMulti
            showSelectedBox
            onCreateOption={(inputValue) => handleAdviceChange(inputValue)}
          />

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
  );
};

export default CreatePrescriptionForm;
