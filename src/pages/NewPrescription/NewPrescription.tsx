import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrescriptionHeader from "./_components/PrescriptionHeader";
import PrescriptionFooter from "./_components/PrescriptionFooter";
import { PrescriptionModals } from "./PrescriptionModals/PrescriptionModals";
import { usePrescriptionData } from "./hook/usePrescriptionData";
import { useGetPrescriptionPageSetupsQuery } from "@/redux/api/PreManagement/PrescriptionPageSetupApi";
import { useGetClinicTemplateQuery } from "@/redux/api/clinicalNoteTemplate/clinicalNoteTemplate";
import { DynamicPrescriptionSections } from "./DynamicPrescriptionSection";
import { useGetSinglePatientQuery } from "@/redux/api/patient/patient";
import { useParams } from "react-router-dom";

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


export default function NewPrescription() {
  const { patientId } = useParams<{ patientId: string }>()
  const { data: patientData, isLoading: isPatientLoading } = useGetSinglePatientQuery(patientId)
  const { prescriptionData, handlers, removeHandlers } = usePrescriptionData();
  const { data: prescriptionPageData, isLoading } =
    useGetPrescriptionPageSetupsQuery({});
  const { data: clinicalData } = useGetClinicTemplateQuery({});
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  const handlePrint = () => window.print();

  const handleSubmit = () => {
    const submissionData = {
      patientInformation: {
        id: patientId,
        name: patientData?.data?.name || "—",
        age: patientData?.data?.age || "—",
        gender: patientData?.data?.gender || "—",
        phoneNumber: patientData?.data?.phoneNumber || "—",
      },
      prescriptionData: {
        patientName: prescriptionData.patientName,
        age: prescriptionData.age,
        date: prescriptionData.date,
        chiefComplaint: prescriptionData.chiefComplaint,
        examinations: prescriptionData.examinations,
        diagnosis: prescriptionData.diagnosis,
        investigations: prescriptionData.investigations,
        history: prescriptionData.history,
        treatmentPlan: prescriptionData.treatmentPlan,
        coMorbidities: prescriptionData.coMorbidities,
        medications: prescriptionData.medications,
        advice: prescriptionData.advice,
        nextVisit: prescriptionData.nextVisit,
      },
    };

    console.log("=== PRESCRIPTION SUBMISSION DATA ===");
    console.log("Full Submission Object:", submissionData);
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

  if (isLoading) return <div>Loading...</div>;

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
        {/* Print and Submit Buttons */}
        <div className="flex justify-end gap-2 mb-4 no-print mr-2">
          <Button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
          >
            Submit Prescription
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
          {!isPatientLoading && (<div className="grid grid-cols-4 gap-8 justify-items-center max-w-5xl my-5 mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm">{patientData?.data?.name || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Age:</span>
              <span className="text-sm w-16">{patientData?.data?.age || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Gender:</span>
              <span className="text-sm">{patientData?.data?.gender || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Phone:</span>
              <span className="text-sm">{patientData?.data?.phoneNumber || "—"}</span>
            </div>
          </div>)}


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
