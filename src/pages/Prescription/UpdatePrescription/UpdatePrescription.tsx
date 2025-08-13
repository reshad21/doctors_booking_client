/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import CreatePrescriptionForm from "../_components/CreatePrescriptionForm";
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi";
import { Card } from "@/components/ui/card";
import {
  useGetPerceptionBIdQuery,
  useUpdatePrescriptionMutation,
} from "@/redux/api/prescription/prescription";
import toast from "react-hot-toast";
import {
  useCreateChiefComplaintMutation,
  useCreateDiagnosisMutation,
  useCreateInvestigationMutation,
  useCreateOnExaminationsMutation,
} from "@/redux/api/manualData/manualData";
import { useCreateAdviceMutation } from "@/redux/api/advice/advice";
import {
  CreateAdviceFn,
  CreateFn,
} from "../_components/CreateFn";

const UpdatePrescription = () => {
  const [createOnExamination] = useCreateOnExaminationsMutation();
  const [createInvestigation] = useCreateInvestigationMutation();
  const [createDiagnosis] = useCreateDiagnosisMutation();
  const [createComplain] = useCreateChiefComplaintMutation();
  const [createAdvice] = useCreateAdviceMutation();
  const { data: preManagementData } = useGetPreManagementQuery(undefined);
  const [updatePrescription] = useUpdatePrescriptionMutation();
  const { prescriptionId } = useParams();
  const { data: prescription } = useGetPerceptionBIdQuery({
    prescriptionId: prescriptionId,
  });
  // const doctorId = useAppSelector((state) => state.admin?.id);
  const prescriptionData = useMemo(
    () => prescription?.data || {},
    [prescription]
  );

  const [medicineInputCount, setMedicineInputCount] = useState<
    Array<{ content: number; DosageSchedule: any[] }>
  >([]);

  // Always update medicineInputCount when prescriptionData.medicines changes
  useEffect(() => {
    if (
      prescriptionData.medicines &&
      Array.isArray(prescriptionData.medicines)
    ) {
      setMedicineInputCount(
        prescriptionData.medicines.map((med: any, idx: any) => ({
          content: idx + 1,
          DosageSchedule: med.DosageSchedule,
        }))
      );
    }
  }, [prescriptionData.medicines]);
  const form = useForm<any>({
    defaultValues: {},
  });
  console.log(prescriptionData);

  useEffect(() => {
    if (prescriptionData && Object.keys(prescriptionData).length > 0) {
      form.reset({
        nxVisit: prescriptionData.nextVisit,
        advice: prescriptionData.advice
          ? prescriptionData.advice
              ?.split("\n")
              ?.map((item: any) => item.replace(/^\d+\.\s*/, ""))
          : [],
        "chief-complaint": prescriptionData.chiefComplaint?.map(
          (c: any) => c.description
        ),
        "on-examinations": prescriptionData.onExaminations?.map(
          (e: any) => e.description
        ),
        diagnosis: prescriptionData?.diagnosis?.map((d: any) => d.description),
        investigation: prescriptionData?.investigation?.map(
          (i: any) => i.description
        ),
        ...(prescriptionData?.medicines?.reduce(
          (
            acc: Record<string, any>,
            med: {
              medicineName: string;
              DosageSchedule: Array<{
                dosage: string;
                day: string;
                time: string;
                comment: string;
              }>;
            },
            medIndex: number
          ) => {
            acc[`medicine-${medIndex + 1}`] = med.medicineName;

            med.DosageSchedule.forEach(
              (
                schedule: {
                  dosage: string;
                  day: string;
                  time: string;
                  comment: string;
                },
                scheduleIndex: number
              ) => {
                acc[`${scheduleIndex + 1}-dosage-${medIndex + 1}`] =
                  schedule.dosage;
                acc[`${scheduleIndex + 1}-duration-${medIndex + 1}`] =
                  schedule.day;
                acc[`${scheduleIndex + 1}-time-${medIndex + 1}`] =
                  schedule.time;
                acc[`${scheduleIndex + 1}-comment-${medIndex + 1}`] =
                  schedule.comment;
              }
            );

            return acc;
          },
          {}
        ) || {}),
      });
    }
  }, [form, prescriptionData]);

  const handleAddMedicineInput = () => {
    setMedicineInputCount((prev: any) => [
      ...prev,
      { content: prev.length + 1, DosageSchedule: [] },
    ]);
  };
  const handleRemoveMedicineInput = (contentToDelete: number) => {
    setMedicineInputCount((prev: any) =>
      prev.filter((item: any) => item.content !== contentToDelete)
    );
  };
  const onSubmit = async (data: any) => {
    // Step 1: Extract all medicine names (medicine-1, medicine-2, etc.)
    const medicineEntries = Object.entries(data)
      ?.filter(([key]) => key.startsWith("medicine-"))
      ?.map(([key, value]) => ({
        medicineId: key.split("-")[1], // Extract the number (1, 2, etc.)
        name: value,
      }));

    // Step 2: For each medicine, collect only currently visible dosages (ignore previous array/IDs)
    const medicines = medicineEntries?.map(({ medicineId, name }) => {
      const dosageCount = form.getValues()["timingCounts"]?.[medicineId] || 1;
      const DosageSchedule = [];
      for (let i = 1; i <= dosageCount; i++) {
        const dosage = data[`${i}-dosage-${medicineId}`];
        const day = data[`${i}-duration-${medicineId}`];
        const time = data[`${i}-time-${medicineId}`];
        const comment = data[`${i}-comment-${medicineId}`];
        if (dosage && day && time) {
          DosageSchedule.push({ dosage, day, time, comment });
        }
      }
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
      id: prescriptionId,
      medicines: Array.isArray(medicines) ? medicines : [],
      content: data.content,
      chiefComplaint: data["chief-complaint"],
      onExaminations: data["on-examinations"],
      diagnosis: data.diagnosis,
      nxVisit: data.nxVisit,
      investigation: data.investigation,
      advice: advice,
    };
console.log(transformedData);

    const res = (await updatePrescription(transformedData)) as any;
    console.log(res);
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
    const prev = form.getValues(fieldName as any) || [];
    form.setValue(fieldName as any, [...prev, inputValue]);
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
          patient={""}
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

export default UpdatePrescription;
