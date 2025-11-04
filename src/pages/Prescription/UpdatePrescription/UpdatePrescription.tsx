/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPreManagementQuery } from "@/redux/api/PreManagement/PreManagementApi";
import {
  useGetPrescriptionByIdQuery,
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
  const { data: prescription } = useGetPrescriptionByIdQuery({
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
      console.log("Prescription data loaded:", prescriptionData);
      console.log(
        "Medicines with dosageNotes:",
        prescriptionData.medicines?.map((med: any) => ({
          medicineName: med.medicineName,
          DosageSchedule: med.DosageSchedule?.map((ds: any) => ({
            dosage: ds.dosage,
            day: ds.day,
            dosageNotes: ds.dosageNotes,
          })),
        }))
      );

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
        (formValues as Record<string, any>)[`medicine-${contentId}`] =
          med.medicineName;

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
          console.log(schedule, "schedule")

          // Set dosageNotes if they exist
          if (schedule.dosageNotes && schedule.dosageNotes.length > 0) {
            console.log("Setting dosageNotes in form:", {
              fieldName: `${scheduleIndex + 1}-dosageNotes-${contentId}`,
              dosageNotes: schedule.dosageNotes,
              schedule,
            });
            (formValues as Record<string, any>)[
              `${scheduleIndex + 1}-dosageNotes-${contentId}`
            ] = schedule.dosageNotes;
          }
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
    console.log(data, "this is data");

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
            const dosageNotes = data[`${idx}-dosageNotes-${medicineIndex}`];

            // Skip completely empty schedule rows
            const hasDosageNotes =
              dosageNotes &&
              Array.isArray(dosageNotes) &&
              dosageNotes.length > 0;
            const hasRegularFields = dosage || day || time || comment;

            if (!hasDosageNotes && !hasRegularFields) return null;

            const schedule: any = {
              // For non-tablet/capsule medicines, don't include dosage if we have dosageNotes
              dosage: hasDosageNotes ? "" : dosage || "",
              day: day || "",
              time: time || "",
              comment: comment || "",
            };

            // Add dosageNotes if they exist
            if (hasDosageNotes) {
              schedule.dosageNotes = dosageNotes;
            }

            return schedule;
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

    console.log("Transformed data:", transformedData);

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
          <div className="p-6 bg-blue-50">
            <PatientInformation
              patient={prescriptionData?.patient}
              prescriptionId={prescriptionData?.prescriptionNo}
            />

            <FormProvider {...form}>
              <PrescriptionForm onSubmit={onSubmit} type="update" />
            </FormProvider>
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

export default UpdatePrescription;
