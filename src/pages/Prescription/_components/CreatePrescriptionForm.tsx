"use client";

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
import { Badge } from "@/components/ui/badge";
import BaseInput from "@/components/shared/BaseInput";

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
  type,
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
      setTimingCounts((prev) => {
        const newTimingCounts: Record<string, number> = { ...prev };
        medicineInputCount.forEach((item: any) => {
          if (!(item.content in newTimingCounts)) {
            newTimingCounts[item.content] = item.DosageSchedule?.length || 1;
          }
        });
        return newTimingCounts;
      });

      // Preserve existing values
      medicineInputCount.forEach((med: any) => {
        const count = med.DosageSchedule?.length || 1;
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
  }, [medicineInputCount, form]);

  const onExaminationOptions =
    InputOptions(onExaminations, "onExaminations") || [];
  const investigationOptions =
    InputOptions(investigations, "investigations") || [];
  const diagnosisOptions = InputOptions(diagnosis, "diagnosis") || [];
  const chiefComplaintOptions =
    InputOptions(chiefComplaint, "chiefComplaint") || [];
  const adviceOptions = InputOptions(advice, "advice") || [];


  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="p-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-900">
            Patient Information
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              key: "name",
              label: "Patient Name",
              value: patient?.patient?.name,
            },
            { key: "age", label: "Age", value: patient?.patient?.age },
            {
              key: "date",
              label: "Date",
              value: new Date().toLocaleDateString(),
            },
            { key: "Id", label: "Prescription ID", value: null },
          ].map((item) => (
            <div key={item.key} className="space-y-2">
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {item.label}
              </label>
              <div className="min-h-[40px] flex items-center">
                {item.value ? (
                  <span className="text-lg font-semibold text-gray-900">
                    {item.value}
                  </span>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-xs font-medium text-blue-600 border-blue-200 bg-blue-50"
                  >
                    Auto-generating
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-6 bg-green-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-900">
            Clinical Assessment
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {[
            {
              key: "Chief-Complaint",
              label: "Chief Complaint",
              options: chiefComplaintOptions,
            },
            {
              key: "On-Examinations",
              label: "On Examinations",
              options: onExaminationOptions,
            },
            { key: "Diagnosis", label: "Diagnosis", options: diagnosisOptions },
            {
              key: "Investigation",
              label: "Investigation",
              options: investigationOptions,
            },
          ].map((field) => {
            const fieldName = field.key.toLowerCase();
            const mergedOptions = [
              ...field.options,
              ...(dynamicOptions[fieldName] || []),
            ].filter(
              (option, index, self) =>
                index === self.findIndex((o) => o.value === option.value)
            );

            return (
              <div key={field.key} className="space-y-3">
                <ReactSelectCompo
                  label={field.label}
                  name={fieldName}
                  options={mergedOptions}
                  control={form.control}
                  isMulti
                  showSelectedBox
                  onCreateOption={(inputValue) =>
                    handleAdviceInputChange(inputValue, field.key)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-900">
            Medication Details
          </h3>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-5 bg-yellow-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Follow Up
                </h4>
              </div>
              <BaseInput
                name="nxVisit"
                placeholder="Enter Follow up details"
                type="text"
                classname="p-3 rounded-md bg-[#fdfdff] border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-5 bg-orange-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Patient Advice
                </h4>
              </div>
              <ReactSelectCompo
                label=""
                name="advice"
                options={adviceOptions || []}
                control={form.control}
                isMulti
                showSelectedBox
                onCreateOption={(inputValue) => handleAdviceChange(inputValue)}
              />
            </div>

            <div className="flex justify-end items-center gap-4  border-gray-200">
              <button
                type="submit"
                className="px-10 py-3 text-sm cursor-pointer font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
              >
                Save Prescription
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePrescriptionForm;
