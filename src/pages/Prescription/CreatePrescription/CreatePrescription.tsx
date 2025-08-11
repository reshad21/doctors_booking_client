/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import CreatePrescriptionForm from "../_components/CreatePrescriptionForm";
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { useCreatePrescriptionMutation } from "@/redux/api/prescription/prescription";

const CreatePrescription = () => {
  const { data: preManagementData } = useGetPreManagementQuery(undefined);
  const [createPrescription] = useCreatePrescriptionMutation();
  const { patientId } = useParams();
  const location = useLocation();
  const patient = location.state;
  const doctorId = useAppSelector((state) => state.admin);
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
  };
  const onSubmit = async (data: any) => {
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
      doctorId,
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
    const res = await createPrescription(transformedData);
    console.log(res);
    // Now you can send transformedData to your API
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
        />
        <div className="pt-[30px]">
          <img src={preManagementData?.data?.[0]?.footerImage} alt="" />
        </div>
      </div>
    </Card>
  );
};

export default CreatePrescription;
