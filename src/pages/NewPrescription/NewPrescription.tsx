import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrescriptionHeader from "./_components/PrescriptionHeader";
import PrescriptionFooter from "./_components/PrescriptionFooter";
import {
  ChiefComplaintSection,
  ExaminationsSection,
  DiagnosisSection,
  InvestigationSection,
  HistorySection,
  MedicationsSection,
  AdviceSection,
  NextVisitSection,
} from "./PrescriptionSections/PrescriptionSections";
import { PrescriptionModals } from "./PrescriptionModals/PrescriptionModals";
import { usePrescriptionData } from "./hook/usePrescriptionData";
import { useGetPrescriptionPageSetupsQuery } from "@/redux/api/PreManagement/PrescriptionPageSetupApi";

export default function NewPrescription() {
  const { prescriptionData, handlers, removeHandlers } = usePrescriptionData();
  const { data, isLoading } = useGetPrescriptionPageSetupsQuery({});
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  const handlePrint = () => window.print();

  const headerData = data?.data?.[0]?.PrescriptionHeader?.[0] || null;
  const footerData = data?.data?.[0]?.PrescriptionFooter?.[0] || null;

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

          <div className="grid grid-cols-2 gap-8 border p-5 mx-2 border-[#C3C3C3] rounded">
            {/* Left Column */}
            <div className="space-y-4">
              <ChiefComplaintSection
                items={prescriptionData.chiefComplaint}
                onAddClick={() => openModal("chiefComplaint")}
                onRemoveItem={removeHandlers.chiefComplaint}
              />

              <HistorySection
                items={prescriptionData.history}
                onAddClick={() => openModal("history")}
                onRemoveItem={removeHandlers.history}
              />

              <ExaminationsSection
                items={prescriptionData.examinations}
                onAddClick={() => openModal("examinations")}
                onRemoveItem={removeHandlers.examination}
              />

              <DiagnosisSection
                items={prescriptionData.diagnosis}
                onAddClick={() => openModal("diagnosis")}
                onRemoveItem={removeHandlers.diagnosis}
              />

              <InvestigationSection
                items={prescriptionData.investigations}
                onAddClick={() => openModal("investigations")}
                onRemoveItem={removeHandlers.investigation}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <MedicationsSection
                medications={prescriptionData.medications}
                onAddClick={() => openModal("medications")}
                onRemoveItem={removeHandlers.medication}
              />

              <AdviceSection
                items={prescriptionData.advice}
                onAddClick={() => openModal("advice")}
                onRemoveItem={removeHandlers.advice}
              />

              <NextVisitSection
                nextVisit={prescriptionData.nextVisit}
                onAddClick={() => openModal("nextVisit")}
              />
            </div>
          </div>

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
