/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import PrescriptionHeader from "./_components/PrescriptionHeader";
import PrescriptionFooter from "./_components/PrescriptionFooter";
import { PrescriptionModals } from "./PrescriptionModals/PrescriptionModals";
import { usePrescriptionData } from "./hook/usePrescriptionData";
import { useGetPrescriptionPageSetupsQuery } from "@/redux/api/PreManagement/PrescriptionPageSetupApi";
import { useGetClinicTemplateQuery } from "@/redux/api/clinicalNoteTemplate/clinicalNoteTemplate";
import { DynamicPrescriptionSections } from "./DynamicPrescriptionSection";
import { useGetSinglePatientQuery } from "@/redux/api/patient/patient";
import {
  useGetPrescriptionByIdQuery,
  useUpdatePrescriptionMutation,
} from "@/redux/api/prescription/prescription";
import toast from "react-hot-toast";
import LoadingSpinner from "@/loading/LoadingSpinner";

const defaultClinicalNotes = [
  { id: "left-1", title: "Chief Complaint", category: "left", isShow: true },
  { id: "left-2", title: "On Examinations", category: "left", isShow: true },
  { id: "left-3", title: "Diagnosis", category: "left", isShow: true },
  { id: "left-4", title: "Investigation", category: "left", isShow: true },
  { id: "left-5", title: "History", category: "left", isShow: true },
  { id: "left-6", title: "Treatment Plan", category: "left", isShow: true },
  { id: "left-7", title: "Co Morbidities", category: "left", isShow: true },
  { id: "right-1", title: "Medicine", category: "right", isShow: true },
  { id: "right-2", title: "Advice", category: "right", isShow: true },
  { id: "right-3", title: "Next Visit", category: "right", isShow: true },
];

// Helper function to transform API prescription data to usePrescriptionData format
const transformPrescriptionData = (apiData: any) => {
  console.log(apiData, "apiData")
  if (!apiData || Object.keys(apiData).length === 0) return null;

  const transformed: any = {
    chiefComplaint: { complaints: [] },
    examinations: { examinations: [], generalExam: {} },
    diagnosis: { diagnosis: [] },
    investigations: { investigations: [] },
    history: {},
    treatmentPlan: { treatmentPlan: [] },
    coMorbidities: { coMorbidities: [] },
    medications: { medications: [] },
    advices: { advices: [] },
    nextVisit: { nextVisit: {} },
  };

  // Transform Chief Complaint
  if (apiData.chiefComplaint && Array.isArray(apiData.chiefComplaint)) {
    transformed.chiefComplaint.complaints = apiData.chiefComplaint.map(
      (item: any) => ({
        id: item.id || Math.random().toString(),
        label: item.label || "",
        duration: item.duration || "",
        unit: item.unit || "",
        notes: item.notes || "",
      })
    );
  }

  // Transform On Examinations
  if (apiData.onExaminations && Array.isArray(apiData.onExaminations)) {
    transformed.examinations.examinations = apiData.onExaminations.map(
      (item: any) => ({
        id: item.id || Math.random().toString(),
        label: item.label || "",
        notes: item.notes || "",
      })
    );
  }

  // Transform Diagnosis
  if (apiData.diagnosis && Array.isArray(apiData.diagnosis)) {
    transformed.diagnosis.diagnosis = apiData.diagnosis.map((item: any) => {
      return {
        id: item.id || Math.random().toString(),
        label: item.label || "",
        notes: item.notes || "",
      };
    });
  }

  // Transform Investigation
  if (apiData.investigation && Array.isArray(apiData.investigation)) {
    transformed.investigations.investigations = apiData.investigation.map(
      (item: any) => {
        // API has label and notes directly, not description
        return {
          id: item.id || Math.random().toString(),
          label: item.label || "",
          notes: item.notes || "",
        };
      }
    );
  }

  // Transform Treatment Plan
  if (apiData.treatmentPlan && Array.isArray(apiData.treatmentPlan)) {
    transformed.treatmentPlan.treatmentPlan = apiData.treatmentPlan.map(
      (item: any) => ({
        id: item.id || Math.random().toString(),
        label: item.label || "",
        notes: item.notes || "",
      })
    );
  }

  // Transform Co Morbidities
  if (apiData.coMorbidities && Array.isArray(apiData.coMorbidities)) {
    transformed.coMorbidities.coMorbidities = apiData.coMorbidities.map(
      (item: any) => ({
        id: item.id || Math.random().toString(),
        label: item.label || "",
        notes: item.notes || "",
      })
    );
  }
  
  if (apiData.medicines && Array.isArray(apiData.medicines)) {
    const medicationInstructionsMap = new Map();
    if (apiData.medication && Array.isArray(apiData.medication)) {
      apiData.medication.forEach((medItem: any) => {
        if (medItem.instructionNotes && medItem.instructionNotes.medicationId) {
          medicationInstructionsMap.set(medItem.instructionNotes.medicationId, medItem.instructionNotes);
        }
      });
    }

    transformed.medications.medications = apiData.medicines
      .filter((med: any) => med.medicineName || med.name)
      .map((med: any) => {
        let dosage = "";
        let frequency = "";
        let duration = "";
        let instructions: string | { beforeEating: boolean; afterEating: boolean; notes: string } = "";

        // Check if this medicine has instructionNotes linked via medicationId
        const instructionNotes = medicationInstructionsMap.get(med.id);
        if (instructionNotes) {
          // Use structured format for instructions
          instructions = {
            beforeEating: instructionNotes.beforeEating || false,
            afterEating: instructionNotes.afterEating || false,
            notes: instructionNotes.notes || "",
          };
        }

        if (med.DosageSchedule && med.DosageSchedule.length > 0) {
          // If there are multiple schedules, combine dosage values with "+"
          const dosageValues = med.DosageSchedule
            .map((schedule: any) => {
              if (schedule.dosageNotes && schedule.dosageNotes.length > 0) {
                // Handle liquid medicines with dosageNotes
                return schedule.dosageNotes
                  .map((note: any) => `${note.qty} ${note.unit}`)
                  .join(" + ");
              }
              return schedule.dosage || "";
            })
            .filter(Boolean);

          dosage = dosageValues.join(" + ") || "";

          // Get frequency from first schedule
          const firstSchedule = med.DosageSchedule[0];
          frequency = firstSchedule.time || "";
          duration = firstSchedule.day || "";
          // Only use comment if instructionNotes is not available
          if (!instructionNotes && firstSchedule.comment) {
            instructions = firstSchedule.comment;
          }
        } else {
          // Fallback to direct medicine properties
          dosage = med.dosage || "";
          frequency = med.time || "";
          duration = med.day || "";
          // Only use comment if instructionNotes is not available
          if (!instructionNotes && med.comment) {
            instructions = med.comment;
          }
        }

        return {
          name: med.medicineName || med.name || "",
          dosage,
          frequency,
          duration,
          ...(instructions && { instructions }),
        };
      });
  } else if (apiData.medication && Array.isArray(apiData.medication)) {
    // Fallback: if only medication array exists (without medicines), try to process it
    // This handles cases where medication items might have nested medicine data
    console.log("Processing medication array as fallback (no medicines array found)");
    transformed.medications.medications = apiData.medication
      .filter((medItem: any) => {
        // Check if medication item has medicine data or nested medicine object
        const hasMedicineData = medItem.medicineName || 
                              medItem.name || 
                              medItem.medicine?.medicineName ||
                              medItem.medicine?.name ||
                              (medItem.medicine && typeof medItem.medicine === 'object');
        return hasMedicineData;
      })
      .map((medItem: any) => {
        // If medication item has instructionNotes, use it
        let instructions: string | { beforeEating: boolean; afterEating: boolean; notes: string } = "";
        if (medItem.instructionNotes) {
          instructions = {
            beforeEating: medItem.instructionNotes.beforeEating || false,
            afterEating: medItem.instructionNotes.afterEating || false,
            notes: medItem.instructionNotes.notes || "",
          };
        }

        // Try to get medicine data from various possible locations
        const medicine = medItem.medicine || medItem;
        return {
          name: medItem.medicineName || 
                medItem.name || 
                medicine?.medicineName || 
                medicine?.name || 
                "",
          dosage: medItem.dosage || 
                  medicine?.dosage || 
                  (medicine?.DosageSchedule && medicine.DosageSchedule[0]?.dosage) || 
                  "",
          frequency: medItem.time || 
                    medItem.frequency || 
                    medicine?.time || 
                    (medicine?.DosageSchedule && medicine.DosageSchedule[0]?.time) || 
                    "",
          duration: medItem.day || 
                   medItem.duration || 
                   medicine?.day || 
                   (medicine?.DosageSchedule && medicine.DosageSchedule[0]?.day) || 
                   "",
          ...(instructions && { instructions }),
        };
      })
      .filter((med: any) => med.name); // Only keep items with a name
    
    if (transformed.medications.medications.length === 0) {
      console.warn("No medications found - medication array exists but contains no medicine data");
    }
  } else {
    console.warn("No medicines or medication array found in API response");
  }

  // Transform Advice
  if (apiData.advice && Array.isArray(apiData.advice)) {
    transformed.advices.advices = apiData.advice.map((item: any) => {
      // API has label and notes directly, not description
      return {
        id: item.id || Math.random().toString(),
        label: item.label || "",
        notes: item.notes || "",
      };
    });
  }

  // Transform History
  if (apiData.history && Array.isArray(apiData.history)) {
    // History might have different structures, transform based on what's available
    transformed.history = {
      general: [],
      personal: [],
      family: [],
      drugs: [],
      investigations: [],
    };
    // Only process history items that have actual data (not just IDs)
    apiData.history.forEach((item: any) => {
      // Check if item has actual history data fields
      if (item.label || item.notes || item.description || 
          (item.general && Array.isArray(item.general)) ||
          (item.personal && Array.isArray(item.personal)) ||
          (item.family && Array.isArray(item.family)) ||
          (item.drugs && Array.isArray(item.drugs)) ||
          (item.investigations && Array.isArray(item.investigations))) {
        
        // Handle structured history data
        if (item.general && Array.isArray(item.general)) {
          transformed.history.general = item.general.map((g: any) => ({
            id: g.id || Math.random().toString(),
            label: g.label || "",
            duration: g.duration || "",
            unit: g.unit || "",
            notes: g.notes || "",
          }));
        }
        if (item.personal && Array.isArray(item.personal)) {
          transformed.history.personal = item.personal.map((p: any) => ({
            id: p.id || Math.random().toString(),
            label: p.label || "",
            duration: p.duration || "",
            unit: p.unit || "",
            notes: p.notes || "",
          }));
        }
        if (item.family && Array.isArray(item.family)) {
          transformed.history.family = item.family.map((f: any) => ({
            id: f.id || Math.random().toString(),
            label: f.label || "",
            duration: f.duration || "",
            unit: f.unit || "",
            notes: f.notes || "",
          }));
        }
        if (item.drugs && Array.isArray(item.drugs)) {
          transformed.history.drugs = item.drugs;
        }
        if (item.investigations && Array.isArray(item.investigations)) {
          transformed.history.investigations = item.investigations.map((inv: any) => ({
            id: inv.id || Math.random().toString(),
            label: inv.label || "",
            notes: inv.notes || "",
          }));
        }
        
        // Handle flat history structure (single item with label/notes)
        if (item.label || item.notes) {
          if (!transformed.history.general) {
            transformed.history.general = [];
          }
          transformed.history.general.push({
            id: item.id || Math.random().toString(),
            label: item.label || "",
            duration: item.duration || "",
            unit: item.unit || "",
            notes: item.notes || "",
          });
        }
      }
      // If item only has id/timestamps (empty placeholder), skip it
    });
  }

  // Transform Next Visit
  if (apiData.nextVisit) {
    transformed.nextVisit.nextVisit = {
      durationValue: apiData.nextVisit.durationValue || "",
      durationType: apiData.nextVisit.durationType || "",
      notes: apiData.nextVisit.notes || "",
      showInReport: apiData.nextVisit.showInReport || false,
      withPatient: apiData.nextVisit.withPatient || false,
    };
  }

  return transformed;
};

export default function EditPrescription() {
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const navigate = useNavigate();
  const { data: prescription, isLoading: isPrescriptionLoading } =
    useGetPrescriptionByIdQuery({ prescriptionId: prescriptionId || "" });
  const [updatePrescription] = useUpdatePrescriptionMutation();
  const { prescriptionData, handlers, removeHandlers, rawPrescriptionData } =
    usePrescriptionData();
  const { data: prescriptionPageData, isLoading } =
    useGetPrescriptionPageSetupsQuery({});
  const { data: clinicalData } = useGetClinicTemplateQuery({});
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const prescriptionApiData = prescription?.data || {};
  const patientId = prescriptionApiData?.patientId || prescriptionApiData?.patient?.id;

  const { data: patientData, isLoading: isPatientLoading } =
    useGetSinglePatientQuery(patientId);

  console.log(prescriptionApiData, "prescriptionApiData")

  // Initialize prescription data from API
  useEffect(() => {
    if (
      prescriptionApiData &&
      Object.keys(prescriptionApiData).length > 0 &&
      !isInitialized
    ) {
      const transformed = transformPrescriptionData(prescriptionApiData);

      if (transformed) {
        // Initialize each section using the handlers
        if (transformed.chiefComplaint?.complaints?.length > 0) {
          handlers.chiefComplaint(transformed.chiefComplaint);
        }

        if (transformed.examinations?.examinations?.length > 0) {
          handlers.examinations(transformed.examinations);
        }

        if (transformed.diagnosis?.diagnosis?.length > 0) {
          transformed.diagnosis.diagnosis.forEach((item: any) => {
            handlers.diagnosis(item);
          });
        }

        if (transformed.investigations?.investigations?.length > 0) {
          handlers.investigation(transformed.investigations);
        }

        // Only call history handler if there's actual history data
        if (transformed.history && (
          (transformed.history.general && transformed.history.general.length > 0) ||
          (transformed.history.personal && transformed.history.personal.length > 0) ||
          (transformed.history.family && transformed.history.family.length > 0) ||
          (transformed.history.drugs && transformed.history.drugs.length > 0) ||
          (transformed.history.investigations && transformed.history.investigations.length > 0)
        )) {
          handlers.history(transformed.history);
        }

        if (transformed.treatmentPlan?.treatmentPlan?.length > 0) {
          transformed.treatmentPlan.treatmentPlan.forEach((item: any) => {
            handlers.treatmentPlan(item);
          });
        }

        if (transformed.coMorbidities?.coMorbidities?.length > 0) {
          transformed.coMorbidities.coMorbidities.forEach((item: any) => {
            handlers.coMorbidities(item);
          });
        }

        if (transformed.medications?.medications?.length > 0) {
          transformed.medications.medications.forEach((med: any) => {
            handlers.medications(med);
          });
        }

        if (transformed.advices?.advices?.length > 0) {
          handlers.advice(transformed.advices);
        }

        if (transformed.nextVisit?.nextVisit) {
          handlers.nextVisit(transformed.nextVisit);
        }
      }

      setIsInitialized(true);
    }
  }, [prescriptionApiData, isInitialized, handlers]);

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  const handlePrint = () => window.print();

  const handleSubmit = async () => {
    try {
      const payload = {
        id: prescriptionId,
        patientId,
        ...rawPrescriptionData,
      };

      const res = await updatePrescription(payload).unwrap();

      console.log("Prescription updated successfully:", res);
      toast.success("Prescription updated successfully!");
      navigate(`/dashboard/view-prescription/${patientId}`);
    } catch (err: any) {
      console.error("Failed to update prescription:", err);
      toast.error(err?.data?.message || "Something went wrong while updating the prescription.");
    }
  };

  const headerData =
    prescriptionPageData?.data?.[0]?.PrescriptionHeader?.[0] || null;
  const footerData =
    prescriptionPageData?.data?.[0]?.PrescriptionFooter?.[0] || null;
  const bodySetupData =
    prescriptionPageData?.data?.[0]?.PrescriptionBodySetup?.[0] || null;

  const clinicalNotesFromApi = clinicalData?.data?.notes || [];

  const clinicalNotes =
    clinicalNotesFromApi && clinicalNotesFromApi.length > 0
      ? clinicalNotesFromApi
      : defaultClinicalNotes;

  if (isLoading || isPrescriptionLoading || !isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-slate-100">
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto pt-2 print-container">
        {/* Print and Update Buttons */}
        <div className="flex justify-end gap-2 mb-4 no-print mr-2">
          <Button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
          >
            Update Prescription
          </Button>
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 cursor-pointer text-white"
          >
            <Printer className="h-4 w-4" />
            Print Prescription
          </Button>
        </div>

        <div>
          {/* Header */}
          <PrescriptionHeader data={headerData} />

          {/* Patient Information */}
          {!isPatientLoading && (
            <div className="grid grid-cols-4 gap-8 justify-items-center max-w-5xl my-5 mx-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">
                  {patientData?.data?.name || prescriptionApiData?.patient?.name || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Age:</span>
                <span className="text-sm w-16">
                  {patientData?.data?.age || prescriptionApiData?.patient?.age || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Gender:</span>
                <span className="text-sm">
                  {patientData?.data?.gender ||
                    prescriptionApiData?.patient?.gender ||
                    "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm">
                  {patientData?.data?.phoneNumber ||
                    prescriptionApiData?.patient?.phoneNumber ||
                    "—"}
                </span>
              </div>
            </div>
          )}

          <DynamicPrescriptionSections
            clinicalNotes={clinicalNotes}
            prescriptionData={prescriptionData}
            handlers={handlers}
            removeHandlers={removeHandlers}
            openModal={openModal}
            bodySetup={bodySetupData}
          />

          {/* Footer */}
          <PrescriptionFooter data={footerData} />
        </div>

        {/* All Modals */}
        <PrescriptionModals
          activeModal={activeModal}
          onClose={closeModal}
          handlers={handlers}
          prescriptionData={prescriptionData}
        />
      </div>
    </div>
  );
}

