/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi";
import { Card } from "@/components/ui/card";
import {
  useGetPerceptionBIdQuery,
  useUpdatePrescriptionMutation,
} from "@/redux/api/prescription/prescription";
import toast from "react-hot-toast";
import PrescriptionForm from "../_components/PrescriptionForm";
import PatientInformation from "../_components/PatientInformation";
import BackButton from "@/components/shared/BackButton";

const UpdatePrescription = () => {
  const { data: preManagementData } = useGetPreManagementQuery(undefined);
  const [updatePrescription] = useUpdatePrescriptionMutation();
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const { data: prescription } = useGetPerceptionBIdQuery({
    prescriptionId: prescriptionId,
  });

  const prescriptionData = useMemo(
    () => prescription?.data || {},
    [prescription]
  );

  const form = useForm<any>({
    defaultValues: {},
  });

  useEffect(() => {
    if (prescriptionData && Object.keys(prescriptionData).length > 0) {
      // Create a reference to store medicine content IDs
      const medicineContentIds: string[] = [];

      // Generate unique content IDs for each medicine
      prescriptionData.medicines?.forEach(() => {
        medicineContentIds.push(
          Date.now().toString() + Math.random().toString(36).substring(2, 9)
        );
      });

      // Build the form values object
      const formValues = {
        nextVisit: prescriptionData.nextVisit,
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
      };

      // Add medicine data with content IDs
      prescriptionData.medicines?.forEach((med: any, index: number) => {
        const contentId = medicineContentIds[index];

        // Set medicine name with content ID - just use the string value, not an object
        (formValues as Record<string, any>)[`medicine-${contentId}`] = med.medicineName;

        // Set dosage schedules with content ID
        med.DosageSchedule.forEach((schedule: any, scheduleIndex: number) => {
          (formValues as Record<string, any>)[
            `${scheduleIndex + 1}-dosage-${contentId}`
          ] = schedule.dosage;
          (formValues as Record<string, any>)[
            `${scheduleIndex + 1}-duration-${contentId}`
          ] = schedule.day;
          (formValues as Record<string, any>)[
            `${scheduleIndex + 1}-time-${contentId}`
          ] = schedule.time;
          (formValues as Record<string, any>)[
            `${scheduleIndex + 1}-comment-${contentId}`
          ] = schedule.comment || "";
        });
      });

      // Reset form with the new values
      form.reset(formValues);

      // Initialize MedicineForm with the medicine data
      window.dispatchEvent(
        new CustomEvent("initializeMedicineForm", {
          detail: {
            medicines: prescriptionData.medicines?.map(
              (med: any, index: number) => ({
                content: medicineContentIds[index],
                medicineName: med.medicineName,
                DosageSchedule: med.DosageSchedule.map((ds: any) => ({
                  day: ds.day || "",
                  dosage: ds.dosage || "",
                  time: ds.time || "",
                  comment: ds.comment || "",
                })),
              })
            ),
          },
        })
      );
    }
  }, [form, prescriptionData]);

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
              // id: crypto.randomUUID(),
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
      nextVisit: data.nextVisit || "",
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

    if (res?.data?.message) {
      toast.success(res?.data?.message);
      navigate(`/dashboard/view-prescription/${prescriptionData?.patient?.id}`);
      form.reset();
    } else {
      toast.error(res?.error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Card className="bg-[#f4f6f9] px-5 rounded-sm">
      <BackButton className="w-24" />

      <div className="p-5 bg-white">
        <div className="pb-[30px]">
          <img src={preManagementData?.data?.[0]?.headerImage} alt="" />
        </div>
        <PatientInformation
          patient={prescriptionData?.patient}
          prescriptionId={prescriptionData?.prescriptionNo}
        />

        {/* FIXED: Wrap PrescriptionForm with FormProvider */}
        <FormProvider {...form}>
          <PrescriptionForm onSubmit={onSubmit} type="update" />
        </FormProvider>

        <div className="pt-[30px]">
          <img src={preManagementData?.data?.[0]?.footerImage} alt="" />
        </div>
      </div>
    </Card>
  );
};

export default UpdatePrescription;
