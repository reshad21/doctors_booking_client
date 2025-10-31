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

const defaultClinicalNotes = [
  { id: "1", title: "Chief Complaint", category: "left", order: 1 },
  { id: "2", title: "On Examinations", category: "left", order: 2 },
  { id: "3", title: "Diagnosis", category: "left", order: 3 },
  { id: "4", title: "Investigation", category: "left", order: 4 },
  { id: "5", title: "History", category: "left", order: 5 },
  { id: "6", title: "Medicine", category: "right", order: 1 },
  { id: "7", title: "Advice", category: "right", order: 2 },
  { id: "8", title: "Next Visit", category: "right", order: 3 },
];



export default function NewPrescription() {
  const { prescriptionData, handlers, removeHandlers } = usePrescriptionData();
  const { data: prescriptionPageData, isLoading } =
    useGetPrescriptionPageSetupsQuery({});
  const { data: clinicalData } = useGetClinicTemplateQuery({});
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  const handlePrint = () => window.print();

  const headerData =
    prescriptionPageData?.data?.[0]?.PrescriptionHeader?.[0] || null;
  const footerData =
    prescriptionPageData?.data?.[0]?.PrescriptionFooter?.[0] || null;
  const bodySetupData =
    prescriptionPageData?.data?.[0]?.PrescriptionBodySetup?.[0] || null;

  console.log(prescriptionPageData, "prescriptionPageData");

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
        {/* Print Button */}
        <div className="flex justify-end mb-4 no-print mr-2">
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
          <div className="grid grid-cols-4 gap-8 justify-items-center max-w-5xl my-5 mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm">
                {prescriptionData.patientName || ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Age:</span>
              <span className="text-sm w-16">{prescriptionData.age || ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm">{prescriptionData.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">ID:</span>
              <span className="text-sm">{prescriptionData.date}</span>
            </div>
          </div>

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
