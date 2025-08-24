/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreatePrescriptionForm from "../_components/CreatePrescriptionForm";
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi";
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
import BackButton from "@/components/shared/BackButton";

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
  const navigate = useNavigate();

  const [medicineInputCount, setMedicineInputCount] = useState([
    { content: 1 },
  ]);
  // Example: Suppose you have backendData with keys like '1-duration-1': '09 দিন'
  // You should build defaultValues from backend data
  // For demonstration, let's assume you have a variable backendData
  // Replace this with your actual backend data mapping logic
  const backendData = location.state?.backendData || {};
  const form = useForm({
    defaultValues: backendData
  });

  const handleAddMedicineInput = () => {
    setMedicineInputCount((prev) => [...prev, { content: prev.length + 1 }]);
  };

  const handleRemoveMedicineInput = (contentToDelete: number) => {
    setMedicineInputCount((prev) =>
      prev.filter((item) => item.content !== contentToDelete)
    );
    // Remove all related fields from form state
    const timingCount =
      form.getValues()["timingCounts"]?.[contentToDelete] || 1;
    for (let i = 1; i <= timingCount; i++) {
      form.unregister(`${i}-duration-${contentToDelete}`);
      form.unregister(`${i}-dosage-${contentToDelete}`);
      form.unregister(`${i}-time-${contentToDelete}`);
      form.unregister(`${i}-comment-${contentToDelete}`);
    }
    form.unregister(`medicine-${contentToDelete}`);
  };


  const onSubmit = async (data: any) => {
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

      // Convert to array of dosage schedules and filter out empty/invalid ones
      let DosageSchedule = Object.values(dosageGroups);
      DosageSchedule = DosageSchedule.filter(
        (ds: any) => (ds.dosage && ds.day) || ds.day === "চলবে"
      );
      return {
        medicineName: name,
        DosageSchedule,
      };
    });

    // Step 3: Combine with other form data
    const transformedData = {
      doctorId: doctorId,
      patientId,
      medicines: medicines[0].medicineName ? medicines : [],
      content: data.content,
      chiefComplaint: data["chief-complaint"],
      onExaminations: data["on-examinations"],
      diagnosis: data.diagnosis,
      nxVisit: data.nxVisit,
      investigation: data.investigation,
      advice: data?.advice,
    };
    
    const res = (await createPrescription(transformedData)) as any;

    if (res?.data?.message) {
      toast.success(res?.data?.message);
      navigate(`/dashboard/view-prescription/${patientId}`);
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-center">
              {preManagementData?.data?.[0]?.headerImage && (
                <img
                  src={
                    preManagementData.data[0].headerImage || "/placeholder.svg"
                  }
                  alt="Clinic Header"
                  className="object-contain"
                />
              )}
            </div>
          </div>

          <div className="p-6">
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
              type="create"
            />
          </div>

          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-center">
              {preManagementData?.data?.[0]?.footerImage && (
                <img
                  src={
                    preManagementData.data[0].footerImage || "/placeholder.svg"
                  }
                  alt="Clinic Footer"
                  className="object-contain opacity-70"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;
