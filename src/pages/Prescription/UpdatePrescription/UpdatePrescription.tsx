/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
import { CreateAdviceFn, CreateFn } from "../_components/CreateFn";
import { ChevronLeft } from "lucide-react";

const UpdatePrescription = () => {
  const [createOnExamination] = useCreateOnExaminationsMutation();
  const [createInvestigation] = useCreateInvestigationMutation();
  const [createDiagnosis] = useCreateDiagnosisMutation();
  const [createComplain] = useCreateChiefComplaintMutation();
  const [createAdvice] = useCreateAdviceMutation();
  const { data: preManagementData } = useGetPreManagementQuery(undefined);
  const [updatePrescription] = useUpdatePrescriptionMutation();
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const { data: prescription } = useGetPerceptionBIdQuery({
    prescriptionId: prescriptionId,
  });
  // const doctorId = useAppSelector((state) => state.admin?.id);
  const prescriptionData = useMemo(
    () => prescription?.data || {},
    [prescription]
  );
  console.log(prescriptionData);


  const [medicineInputCount, setMedicineInputCount] = useState(
    prescriptionData.medicines && prescriptionData.medicines.length >= 0
      ? prescriptionData.medicines.map((med: any, idx: number) => ({
        content: idx + 1,
        DosageSchedule: med.DosageSchedule,
      }))
      : [{ content: 1, DosageSchedule: [] }]
  );

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

  useEffect(() => {
    if (prescriptionData && Object.keys(prescriptionData).length > 0) {
      form.reset({
        nxVisit: prescriptionData.nextVisit,
        advice: prescriptionData.advice?.map((c: any) => c.description),
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
    const medicines: any[] = [];
    // Loop through each medicine
    Object.keys(data)
      .filter((key) => key.startsWith("medicine-"))
      .forEach((medicineKey) => {
        const medicineIndex = medicineKey.split("-")[1];
        const medicineName = data[medicineKey];
        if (!medicineName) return;

        // Find all schedule indexes for this medicine
        const scheduleIndexes = [
          ...new Set(
            Object.keys(data)
              .filter((k) => k.endsWith(`-${medicineIndex}`)) // match medicine index at end
              .map((k) => k.split("-")[0]) // get schedule index (first part)
          ),
        ].sort((a, b) => Number(a) - Number(b));

        // Build dosage schedules
        const schedules = scheduleIndexes
          .map((idx) => {
            const dosage = data[`${idx}-dosage-${medicineIndex}`];
            const day = data[`${idx}-duration-${medicineIndex}`];
            const time = data[`${idx}-time-${medicineIndex}`];
            const comment = data[`${idx}-comment-${medicineIndex}`];

            // Skip completely empty schedule rows
            if (!dosage && !day && !time && !comment) return null;

            return {
              id: crypto.randomUUID(),
              dosage: dosage || "",
              day: day || "",
              time: time || "",
              comment: comment || "",
            };
          })
          .filter(Boolean);

        medicines.push({
          medicineName,
          DosageSchedule: schedules,
        });
      });

    // Now build final payload
    const transformedData = {
      id: prescriptionId,
      nextVisit: data.nxVisit || "",
      advice: Array.isArray(data.advice) ? data.advice : [],
      chiefComplaint: Array.isArray(data["chief-complaint"])
        ? data["chief-complaint"]
        : [],
      onExaminations: Array.isArray(data["on-examinations"])
        ? data["on-examinations"]
        : [],
      investigation: Array.isArray(data.investigation)
        ? data.investigation
        : [],
      diagnosis: Array.isArray(data.diagnosis) ? data.diagnosis : [],
      medicines,
    };

    const res = (await updatePrescription(transformedData)) as any;
    console.log(res);
    if (res?.data?.message) {
      toast.success(res?.data?.message);
      navigate(`/dashboard/view-prescription/${prescriptionData?.patient?.id}`);
      form.reset();
    } else {
      toast.error(res?.error?.data?.message || "Something went wrong");
    }
  };
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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Card className="bg-[#f4f6f9] px-5 rounded-sm">
      {/* Back Button - Inside the card */}
      <div className="p-3 pb-0">
        <button
          onClick={handleGoBack}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        >
          <ChevronLeft className="size-4" />
          Back
        </button>
      </div>

      <div className="p-5 bg-white">
        <div className="pb-[30px]">
          <img src={preManagementData?.data?.[0]?.headerImage} alt="" />
        </div>
        <CreatePrescriptionForm
          form={form}
          onSubmit={onSubmit}
          patient={prescriptionData}
          medicineInputCount={medicineInputCount}
          handleRemoveMedicineInput={handleRemoveMedicineInput}
          handleAddMedicineInput={handleAddMedicineInput}
          handleAdviceInputChange={handleSaveNewOption}
          handleAdviceChange={handleSaveAdvice}
          dynamicOptions={dynamicOptions}
          setMedicineInputCount={setMedicineInputCount}
        />
        <div className="pt-[30px]">
          <img src={preManagementData?.data?.[0]?.footerImage} alt="" />
        </div>
      </div>
    </Card>
  );
};

export default UpdatePrescription;
