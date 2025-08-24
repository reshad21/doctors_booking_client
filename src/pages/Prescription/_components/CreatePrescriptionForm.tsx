/* eslint-disable react-hooks/exhaustive-deps */
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
import { AlertTriangle } from "lucide-react";

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
  const [formError, setFormError] = useState<string>("");

  const { data: onExaminations } = useGetOnExaminationsQuery({ limit: 200 });
  const { data: investigations } = useGetInvestigationQuery({ limit: 200 });
  const { data: diagnosis } = useGetDiagnosisQuery({ limit: 200 });
  const { data: chiefComplaint } = useGetChiefComplaintQuery({ limit: 200 });
  const { data: advice } = useGetAdviceQuery({});

  console.log(patient, "patient in update prescription")

  // Validate unique medicines
  const validateUniqueMedicines = () => {
    if (!medicineInputCount || medicineInputCount.length <= 1) {
      return true;
    }

    const selectedMedicines = new Set<string>();
    const duplicates: string[] = [];

    medicineInputCount.forEach((item: any) => {
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
      setFormError(
        `Duplicate medicines found: ${duplicates.join(", ")}. Please select different medicines.`
      );
      return false;
    } else {
      setFormError("");
      return true;
    }
  };

  const handleSubmit = (data: any) => {
    setFormError("");

    if (!validateUniqueMedicines()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    onSubmit(data);
  };

  const watchedMedicineFields =
    medicineInputCount?.map((item: any) => `medicine-${item.content}`) || [];
  form.watch(watchedMedicineFields);

  useEffect(() => {
    if (medicineInputCount && medicineInputCount.length > 1) {
      setTimeout(() => {
        validateUniqueMedicines();
      }, 100);
    } else {
      setFormError("");
    }
  }, [medicineInputCount, form.watch(watchedMedicineFields)]);

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
          form.setValue(`${idx}-duration-${med.content}`, ds.day || "");
          form.setValue(`${idx}-dosage-${med.content}`, ds.dosage || "");
          form.setValue(`${idx}-time-${med.content}`, ds.time || "");
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
      {/* Show form-level error for duplicate medicines */}
      {formError && (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Validation Error</span>
          </div>
          <p className="mt-1 text-sm text-red-600">{formError}</p>
        </div>
      )}

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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
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

            <div className="flex justify-end items-center gap-4 border-gray-200">
              <button
                type="submit"
                disabled={!!formError}
                className={`px-10 py-3 text-sm cursor-pointer font-semibold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                  formError
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                }`}
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
