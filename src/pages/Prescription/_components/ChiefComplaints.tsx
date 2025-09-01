import { useState } from "react";
import { useFormContext } from "react-hook-form";
import ReactSelectCompo from "./ReactSelectCompo";
import {
  useGetChiefComplaintQuery,
  useGetDiagnosisQuery,
  useGetInvestigationQuery,
  useGetOnExaminationsQuery,
  useCreateChiefComplaintMutation,
  useCreateDiagnosisMutation,
  useCreateInvestigationMutation,
  useCreateOnExaminationsMutation,
} from "@/redux/api/manualData/manualData";
import { InputOptions, CreateFn } from "./CreateFn";
import toast from "react-hot-toast";

const ChiefComplaints = () => {
  const { control, getValues, setValue } = useFormContext();

  // local dynamic options state
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({
    "chief-complaint": [],
    "on-examinations": [],
    diagnosis: [],
    investigation: [],
  });

  // API fetch
  const { data: onExaminations } = useGetOnExaminationsQuery({ limit: 200 });
  const { data: investigations } = useGetInvestigationQuery({ limit: 200 });
  const { data: diagnosis } = useGetDiagnosisQuery({ limit: 200 });
  const { data: chiefComplaint } = useGetChiefComplaintQuery({ limit: 200 });

  // API mutations
  const [createOnExamination] = useCreateOnExaminationsMutation();
  const [createInvestigation] = useCreateInvestigationMutation();
  const [createDiagnosis] = useCreateDiagnosisMutation();
  const [createComplain] = useCreateChiefComplaintMutation();

  // Save new option (internal)
  const handleSaveNewOption = async (inputValue: string, label: string) => {
    try {
      if (label === "Chief-Complaint") {
        await CreateFn(inputValue, createComplain);
      }
      if (label === "On-Examinations") {
        await CreateFn(inputValue, createOnExamination);
      }
      if (label === "Diagnosis") {
        await CreateFn(inputValue, createDiagnosis);
      }
      if (label === "Investigation") {
        await CreateFn(inputValue, createInvestigation);
      }

      const fieldName = label.toLowerCase();

      // Add to form value
      const prev = getValues(fieldName) || [];
      setValue(fieldName, [...prev, inputValue]);

      // Add to dynamic options
      setDynamicOptions((prevOptions) => ({
        ...prevOptions,
        [fieldName]: [
          ...prevOptions[fieldName],
          { value: inputValue, label: inputValue },
        ],
      }));
    } catch (error) {
      toast.error("Failed to save new option");
      console.error("Error saving new option:", error);
    }
  };

  // Transform API data
  const onExaminationOptions =
    InputOptions(onExaminations, "onExaminations") || [];
  const investigationOptions =
    InputOptions(investigations, "investigations") || [];
  const diagnosisOptions = InputOptions(diagnosis, "diagnosis") || [];
  const chiefComplaintOptions =
    InputOptions(chiefComplaint, "chiefComplaint") || [];

  const fields = [
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
  ];

  return (
    <div className="p-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-6 bg-green-500 rounded-full"></div>
        <h3 className="text-xl font-semibold text-gray-900">
          Clinical Assessment
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        {fields.map((field) => {
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
                control={control}
                isMulti
                showSelectedBox
                onCreateOption={(inputValue) =>
                  handleSaveNewOption(inputValue, field.key)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChiefComplaints;
