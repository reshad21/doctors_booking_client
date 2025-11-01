/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChiefComplaintModal } from "./_components/ChiefComplaintModals/ChiefComplaintModal";
import { ExaminationsModal } from "./_components/ExaminationModal/ExaminationModal";
import { PatientModal } from "../_components/modals/PatientModal";
import { MedicationsModal } from "./_components/MedicationModal.tsx/MedicationsModal";
import { NextVisitModal } from "./_components/NextVisitModal/NextVisitModal";
import { prescriptionTags } from "@/constant/prescription-tags";
import { HistoryModal } from "./_components/HistoryModal/HistoryModal";
import { DiagnosisModal } from "./_components/DiagnosisModal/DiagnosisModal";
import { InvestigationModal } from "./_components/InvestigationModal/InvestigationModal";
import { AdviceModal } from "./_components/AdviceModal/AdviceModal";

interface PrescriptionModalsProps {
  activeModal: string | null;
  onClose: () => void;
  handlers: {
    patient: (data: any) => void;
    chiefComplaint: (data: any) => void;
    examinations: (data: any) => void;
    diagnosis: (data: any) => void;
    investigation: (data: any) => void;
    history: (data: any) => void;
    medications: (data: any) => void;
    advice: (data: any) => void;
    nextVisit: (data: any) => void;
  };
  prescriptionData: {
    patientName: string;
    age: string;
    date: string;
  };
}

export function PrescriptionModals({
  activeModal,
  onClose,
  handlers,
  prescriptionData,
}: PrescriptionModalsProps) {
  return (
    <>
      <PatientModal
        isOpen={activeModal === "patient"}
        onClose={onClose}
        onSubmit={handlers.patient}
        initialData={{
          name: prescriptionData.patientName,
          age: prescriptionData.age,
          date: prescriptionData.date,
        }}
      />

      <ChiefComplaintModal
        isOpen={activeModal === "chiefComplaint"}
        onClose={onClose}
        onSubmit={handlers.chiefComplaint}
      />

      <ExaminationsModal
        isOpen={activeModal === "examinations"}
        onClose={onClose}
        onSubmit={handlers.examinations}
      />

      <DiagnosisModal
        isOpen={activeModal === "diagnosis"}
        onClose={onClose}
        onSubmit={handlers.diagnosis}
      />

      <InvestigationModal
        isOpen={activeModal === "investigations"}
        onClose={onClose}
        onSubmit={handlers.investigation}
      />

      <HistoryModal
        isOpen={activeModal === "history"}
        onClose={onClose}
        onSubmit={handlers.history}
      />

      <MedicationsModal
        isOpen={activeModal === "medications"}
        onClose={onClose}
        onSubmit={handlers.medications}
      />

      <AdviceModal
        isOpen={activeModal === "advice"}
        onClose={onClose}
        onSubmit={(data: any) => {
          if (data && Array.isArray(data.advices)) {
            handlers.advice({ advices: data.advices });
          } else if (data && data.advice) {
            handlers.advice({ advice: data.advice });
          }
        }}
        tags={prescriptionTags.advice}
      />

      <NextVisitModal
        isOpen={activeModal === "nextVisit"}
        onClose={onClose}
        onSubmit={handlers.nextVisit}
      />
    </>
  );
}
