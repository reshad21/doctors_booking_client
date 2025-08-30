/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import PrescriptionForm from "../_components/PrescriptionForm";

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
    {
      content: Date.now().toString(),
      medicineName: "",
      DosageSchedule: [{ day: "", dosage: "", time: "", comment: "" }],
    },
  ]);

  const backendData = location.state?.backendData || {};
  const form = useForm({
    defaultValues: backendData,
  });

  const handleAddMedicineInput = () => {
    const newId = Date.now().toString();
    setMedicineInputCount((prev) => [
      ...prev,
      {
        content: newId,
        medicineName: "",
        DosageSchedule: [{ day: "", dosage: "", time: "", comment: "" }],
      },
    ]);
  };

  const handleRemoveMedicineInput = (contentToDelete: string) => {
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
  };

  const onSubmit = async (data: any) => {
    const medicineEntries = Object.entries(data)
      .filter(([key]) => key.startsWith("medicine-"))
      .map(([key, value]) => ({
        medicineId: key.split("-")[1],
        name: value,
      }));

    // Step 2: For each medicine, find its dosage schedules
    const medicines = medicineEntries.map(({ medicineId, name }) => {
      // Find all fields that belong to this medicine's dosage schedules
      const dosageFields = Object.entries(data).filter(([fieldName]) => {
        const parts = fieldName.split("-");
        return parts.length === 3 && parts[2] === medicineId;
      });

      const dosageGroups = dosageFields.reduce<
        Record<string, Record<string, any>>
      >((acc, [fieldName, value]) => {
        const [dosageIndex, fieldType] = fieldName.split("-");

        if (!acc[dosageIndex]) {
          acc[dosageIndex] = {};
        }

        acc[dosageIndex][
          fieldType === "dosage"
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
      medicines: medicines.filter((m) => m.medicineName), // Filter out empty medicines
      content: data.content,
      chiefComplaint: data["chief-complaint"],
      onExaminations: data["on-examinations"],
      diagnosis: data.diagnosis,
      nextVisit: data.nextVisit,
      investigation: data.investigation,
      advice: data?.advice,
    };

    try {
      const res = (await createPrescription(transformedData)) as any;

      if (res?.data?.message) {
        toast.success(res?.data?.message);
        navigate(`/dashboard/view-prescription/${patientId}`);
        form.reset();
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred while creating the prescription");
      console.error("Prescription creation error:", error);
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
    } catch (error) {
      toast.error("Failed to save new option");
      console.error("Error saving new option:", error);
    }
  };

  // Handler for advice field
  const handleSaveAdvice = async (inputValue: string) => {
    try {
      await CreateAdviceFn(inputValue, createAdvice);
      const prev = form.getValues("advice") || [];
      form.setValue("advice", [...prev, inputValue]);
    } catch (error) {
      toast.error("Failed to save advice");
      console.error("Error saving advice:", error);
    }
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
            <PrescriptionForm
              form={form}
              onSubmit={onSubmit}
              patient={patient}
              medicineInputCount={medicineInputCount}
              handleRemoveMedicineInput={handleRemoveMedicineInput}
              handleAddMedicineInput={handleAddMedicineInput}
              handleAdviceInputChange={handleSaveNewOption}
              handleAdviceChange={handleSaveAdvice}
              setMedicineInputCount={setMedicineInputCount}
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
