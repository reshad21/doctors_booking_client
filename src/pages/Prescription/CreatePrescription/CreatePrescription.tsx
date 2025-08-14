/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import CreatePrescriptionForm from "../_components/CreatePrescriptionForm";
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { useCreatePrescriptionMutation } from "@/redux/api/prescription/prescription";
import toast from "react-hot-toast";
import {
  useCreateChiefComplaintMutation,
  useCreateDiagnosisMutation,
  useCreateInvestigationMutation,
  useCreateOnExaminationsMutation,
} from "@/redux/api/manualData/manualData";
import { useCreateAdviceMutation } from "@/redux/api/advice/advice";
import { CreateAdviceFn, CreateFn } from "../_components/CreateFn";

const CreatePrescription = () => {
  const [createOnExamination] = useCreateOnExaminationsMutation();
  const [createInvestigation] = useCreateInvestigationMutation();
  const [createDiagnosis] = useCreateDiagnosisMutation();
  const [createComplain] = useCreateChiefComplaintMutation();
  const [createAdvice] = useCreateAdviceMutation();
  const { data: preManagementData } = useGetPreManagementQuery(undefined);
  const [createPrescription] = useCreatePrescriptionMutation();
  const { patientId } = useParams();
  const location = useLocation();
  const patient = location.state;
  const doctorId = useAppSelector((state) => state.admin?.id);
  console.log(doctorId);
  
  const [medicineInputCount, setMedicineInputCount] = useState([
    { content: 1 },
  ]);
  const form = useForm();

  const handleAddMedicineInput = () => {
    setMedicineInputCount((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleRemoveMedicineInput = (contentToDelete: number) => {
  setMedicineInputCount((prev) =>
    prev.filter((item) => item.content !== contentToDelete)
  );
  // Remove all related fields from form state
  const timingCount = form.getValues()["timingCounts"]?.[contentToDelete] || 1;
  for (let i = 1; i <= timingCount; i++) {
    form.unregister(`${i}-duration-${contentToDelete}`);
    form.unregister(`${i}-dosage-${contentToDelete}`);
    form.unregister(`${i}-time-${contentToDelete}`);
    form.unregister(`${i}-comment-${contentToDelete}`);
  }
  form.unregister(`medicine-${contentToDelete}`);
};
  const onSubmit = async (data: any) => {
    console.log(data);
    
    // Step 1: Extract all medicine names (medicine-1, medicine-2, etc.)
    const medicineEntries = Object.entries(data)
      .filter(([key]) => key.startsWith("medicine-"))
      .map(([key, value]) => ({
        medicineId: key.split("-")[1], // Extract the number (1, 2, etc.)
        name: value,
      }));
    // Step 2: For each medicine, find its dosage schedules
    const medicines = medicineEntries.map(({ medicineId, name }) => {
      // Find all fields that belong to this medicine's dosage schedules
      const dosageFields = Object.entries(data).filter(([fieldName]) => {
        // Field name format: dosageIndex-fieldType-medicineId (e.g., "1-duration-1")
        const parts = fieldName.split("-");
        return parts.length === 3 && parts[2] === medicineId;
      });
      // Group fields by dosage index (the first part of the field name)
      const dosageGroups = dosageFields.reduce<
        Record<string, Record<string, any>>
      >((acc, [fieldName, value]) => {
        const [dosageIndex, fieldType] = fieldName.split("-");

        if (!acc[dosageIndex]) {
          acc[dosageIndex] = {};
        }
        // Map field names to the desired structure
        acc[dosageIndex][
          fieldType === "doges"
            ? "dosage"
            : fieldType === "duration"
              ? "day"
              : fieldType
        ] = value;

        return acc;
      }, {});

      // Convert to array of dosage schedules
      const DosageSchedule = Object.values(dosageGroups);
      return {
        medicineName: name,
        DosageSchedule,
      };
    });
    const advice = data?.advice
      ?.map((name: string, index: number) => `${index + 1}. ${name}`)
      .join("\n");

    // Step 3: Combine with other form data
    const transformedData = {
      doctorId: doctorId,
      patientId,
      medicines,
      content: data.content,
      chiefComplaint: data["chief-complaint"],
      onExaminations: data["on-examinations"],
      diagnosis: data.diagnosis,
      nxVisit: data.nxVisit,
      investigation: data.investigation,
      advice: advice,
    };
    const res = (await createPrescription(transformedData)) as any;
    console.log(transformedData);
    
    console.log(res?.data);
    if (res?.data?.message) {
      toast.success(res?.data?.message);
      form.reset();
    } else {
      toast.error(res?.error?.data?.message || "Something went wrong");
    }
  };

  // State to hold dynamic options for each field
  const [dynamicOptions, setDynamicOptions] = useState<{
    [key: string]: { value: string; label: string }[];
  }>({
    "chief-complaint": [],
    "on-examinations": [],
    diagnosis: [],
    investigation: [],
  });

  // Handler to save new select options (for all fields)
  const handleSaveNewOption = async (inputValue: string, label: string) => {
    if (label == "Chief-Complaint") {
      await CreateFn(inputValue, createComplain);
    }
    if (label == "On-Examinations") {
      await CreateFn(inputValue, createOnExamination);
    }
    if (label == "Diagnosis") {
      await CreateFn(inputValue, createDiagnosis);
    }
    if (label == "Investigation") {
      await CreateFn(inputValue, createInvestigation);
    }

    const fieldName = label.toLowerCase();
    // Add to form value
    const prev = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...prev, inputValue]);
    // Add to dynamic options for the select
    setDynamicOptions((prevOptions) => ({
      ...prevOptions,
      [fieldName]: [
        ...prevOptions[fieldName],
        { value: inputValue, label: inputValue },
      ],
    }));
  };

  // Handler for advice field
  const handleSaveAdvice = (inputValue: string) => {
    CreateAdviceFn(inputValue, createAdvice);
    const prev = form.getValues("advice") || [];
    form.setValue("advice", [...prev, inputValue]);
  };

  return (
    <Card className=" bg-[#f4f6f9] px-5 rounded-sm">
      <div className="p-5 bg-white">
        <div className="pb-[30px]">
          <img src={preManagementData?.data?.[0]?.headerImage} alt="" />
        </div>
        <CreatePrescriptionForm
          form={form}
          onSubmit={onSubmit}
          patient={patient}
          medicineInputCount={medicineInputCount}
          handleRemoveMedicineInput={handleRemoveMedicineInput}
          handleAddMedicineInput={handleAddMedicineInput}
          handleAdviceInputChange={handleSaveNewOption}
          handleAdviceChange={handleSaveAdvice}
          dynamicOptions={dynamicOptions}
        />
        <div className="pt-[30px]">
          <img src={preManagementData?.data?.[0]?.footerImage} alt="" />
        </div>
      </div>
    </Card>
  );
};

export default CreatePrescription;
