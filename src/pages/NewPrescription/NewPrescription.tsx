/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
import { ChiefComplaintModal } from "./_components/modals/ChiefComplaintModals/ChiefComplaintModal";
import { ExaminationsModal } from "./_components/modals/ExaminationModal/ExaminationModal";
import { PatientModal } from "./_components/modals/PatientModal";
import { MedicationsModal } from "./_components/modals/MedicationModal.tsx/MedicationsModal";
import { AdviceModal } from "./_components/modals/AdviceModal/AdviceModal";
import { prescriptionTags } from "@/constant/prescription-tags";
import type { PrescriptionData } from "@/types/new-prescription.types";
import { DiagnosisModal } from "./_components/modals/DiagnosisModal/DiagnosisModal";
import { InvestigationModal } from "./_components/modals/InvestigationModal/InvestigationModal";
import { NextVisitModal } from "./_components/modals/NextVisitModal/NextVisitModal";
import type { NextVisitItem } from "./_components/modals/NextVisitModal/NextVisitModal";
import { HistoryModal } from "./_components/modals/HistoryModal/HistoryModal";

interface ComplaintItem {
  id: string;
  label: string;
  duration: string;
  unit: string;
  notes: string;
}

export default function NewPrescription() {
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>({
    patientName: "",
    age: "",
    date: new Date().toLocaleDateString("en-GB"),
    chiefComplaint: [],
    examinations: [],
    diagnosis: [],
    investigations: [],
    history: [],
    medications: [],
    advice: [],
    nextVisit: "",
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (type: string) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Submit handlers for each modal
  const handlePatientSubmit = (data: {
    name: string;
    age: string;
    date: string;
  }) => {
    setPrescriptionData((prev) => ({
      ...prev,
      patientName: data.name,
      age: data.age,
      date: data.date,
    }));
  };

  const handleChiefComplaintSubmit = (data: {
    complaints: ComplaintItem[];
  }) => {
    const formatted = data.complaints.map((item) => {
      const dur = item.duration ? `${item.duration}` : "";
      const unit = item.unit ? ` ${item.unit}` : "";
      const notes = item.notes ? ` (${item.notes})` : "";

      const middle = dur ? `${dur}${unit}`.trim() : unit.trim();
      return `${item.label}${middle ? ` ${middle}` : ""}${notes}`.trim();
    });
    setPrescriptionData((prev) => {
      const existingSet = new Set(
        prev.chiefComplaint.map((c) => c.trim().toLowerCase())
      );

      const toAdd = formatted.filter(
        (f) => !existingSet.has(f.trim().toLowerCase())
      );

      return {
        ...prev,
        chiefComplaint: [...prev.chiefComplaint, ...toAdd],
      };
    });
  };

  const handleExaminationsSubmit = (data: { examination: string }) => {
    setPrescriptionData((prev) => ({
      ...prev,
      examinations: [...prev.examinations, data.examination],
    }));
  };

  const handleDiagnosisSubmit = (data: { diagnosis: string }) => {
    setPrescriptionData((prev) => ({
      ...prev,
      diagnosis: [...prev.diagnosis, data.diagnosis],
    }));
  };

  const handleInvestigationSubmit = (
    data:
      | {
          investigations: Array<{
            id: string;
            label: string;
            notes: string;
            result: string;
          }>;
        }
      | { investigations: string[] }
  ) => {
    if (Array.isArray(data.investigations)) {
      const formattedInvestigations = data.investigations.map((inv) => {
        if (typeof inv === "string") return inv;
        const result = inv.result ? ` [Result: ${inv.result}]` : "";
        return `${inv.label}${result}`;
      });

      setPrescriptionData((prev) => ({
        ...prev,
        investigations: [...prev.investigations, ...formattedInvestigations],
      }));
    }
  };

  type IncomingInvestigation = {
    id: string;
    label: string;
    notes: string;
    result: string;
  };

  const handleHistorySubmit = (
    data:
      | { history: string }
      | {
          general?: ComplaintItem[];
          drugs?: string[];
          investigations?: Array<IncomingInvestigation>;
          personal?: ComplaintItem[];
          family?: ComplaintItem[];
        }
  ) => {
    // Helper to format complaint-like items (used for general/personal/family)
    const formatComplaint = (item: ComplaintItem) => {
      const dur = item.duration ? `${item.duration}` : "";
      const unit = item.unit ? ` ${item.unit}` : "";
      const notes = item.notes ? ` (${item.notes})` : "";
      const middle = dur ? `${dur}${unit}`.trim() : unit.trim();
      return `${item.label}${middle ? ` ${middle}` : ""}${notes}`.trim();
    };

    if ("history" in data) {
      setPrescriptionData((prev) => ({
        ...prev,
        history: [...prev.history, data.history],
      }));
      return;
    }

    // Structured history — turn into one or more string entries to store in prescriptionData.history
    const sections: string[] = [];

    if (data.general && data.general.length > 0) {
      const items = data.general.map((g) => formatComplaint(g));
      sections.push(`G/o: ${items.join("; ")}`);
    }

    if (data.drugs && data.drugs.length > 0) {
      sections.push(`D/o: ${data.drugs.join(", ")}`);
    }

    if (data.investigations && data.investigations.length > 0) {
      const items = data.investigations.map((inv) => {
        const res = inv.result ? ` [Result: ${inv.result}]` : "";
        return `${inv.label}${res}`;
      });
      sections.push(`I/o: ${items.join("; ")}`);
    }

    if (data.personal && data.personal.length > 0) {
      const items = data.personal.map((p) => formatComplaint(p));
      sections.push(`P/o: ${items.join("; ")}`);
    }

    if (data.family && data.family.length > 0) {
      const items = data.family.map((f) => formatComplaint(f));
      sections.push(`F/o: ${items.join("; ")}`);
    }

    if (sections.length > 0) {
      setPrescriptionData((prev) => ({
        ...prev,
        history: [...prev.history, ...sections],
      }));
    }
  };

  const handleMedicationsSubmit = (data: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: {
      beforeEating: boolean;
      afterEating: boolean;
      notes: string;
    };
  }) => {
    const formatInstructions = (instr: any): string => {
      if (!instr) return "";
      if (typeof instr === "string") return instr;
      const parts: string[] = [];
      if (instr.beforeEating) parts.push("Before eating");
      if (instr.afterEating) parts.push("After eating");
      if (instr.notes) parts.push(instr.notes);
      return parts.join("; ").trim();
    };

    const medicationEntry = {
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      duration: data.duration,
      instructions: formatInstructions((data as any).instructions),
    };

    setPrescriptionData((prev) => ({
      ...prev,
      medications: [...prev.medications, medicationEntry],
    }));
  };

  const handleAdviceSubmit = (
    data:
      | { advice: string }
      | {
          advices: Array<
            { id?: string; label: string; notes?: string } | string
          >;
        }
  ) => {
    console.log(data, "advice from new prescription");
    if ((data as any).advices && Array.isArray((data as any).advices)) {
      // Preserve label and notes (if present). Store as a single string so existing UI
      // (which expects string[]) can display both.
      const advArr: string[] = (data as any).advices.map((a: any) => {
        if (typeof a === "string") return a;
        const label = a.label ?? "";
        const notes = a.notes ?? "";
        return notes && String(notes).trim()
          ? `${String(label).trim()} (${String(notes).trim()})`
          : String(label).trim();
      });
      setPrescriptionData((prev) => ({
        ...prev,
        advice: [...prev.advice, ...advArr],
      }));
      return;
    }

    // fallback for single advice string
    const adv = (data as any).advice ?? (data as any).adviceText ?? "";
    if (adv) {
      setPrescriptionData((prev) => ({
        ...prev,
        advice: [...prev.advice, String(adv)],
      }));
    }
  };

  const handleNextVisitSubmit = (data: { nextVisit: NextVisitItem }) => {
    const nv = data.nextVisit;
    // Format into the string representation used in the UI
    const formatted =
      `${nv.durationValue} ${nv.durationType} পর${nv.notes ? ` ${nv.notes}` : ""}${nv.showInReport ? " রিপোর্ট" : ""}${nv.withPatient ? " সহ আসবেন" : ""}`.trim();
    setPrescriptionData((prev) => ({
      ...prev,
      nextVisit: formatted,
    }));
  };

  // Remove item handlers
  const removeChiefComplaint = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      chiefComplaint: prev.chiefComplaint.filter((_, i) => i !== index),
    }));
  };

  const removeExamination = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      examinations: prev.examinations.filter((_, i) => i !== index),
    }));
  };

  const removeDiagnosis = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      diagnosis: prev.diagnosis.filter((_, i) => i !== index),
    }));
  };

  const removeInvestigation = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      investigations: prev.investigations.filter((_, i) => i !== index),
    }));
  };

  const removeHistory = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      history: prev.history.filter((_, i) => i !== index),
    }));
  };

  const removeMedication = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const removeAdvice = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      advice: prev.advice.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <div className="max-w-5xl mx-auto pt-4">
        <div className="rounded-lg">
          {/* Header */}
          <PrescriptionHeader />

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
                onRemoveItem={removeChiefComplaint}
              />

              <ExaminationsSection
                items={prescriptionData.examinations}
                onAddClick={() => openModal("examinations")}
                onRemoveItem={removeExamination}
              />

              <DiagnosisSection
                items={prescriptionData.diagnosis}
                onAddClick={() => openModal("diagnosis")}
                onRemoveItem={removeDiagnosis}
              />

              <InvestigationSection
                items={prescriptionData.investigations}
                onAddClick={() => openModal("investigations")}
                onRemoveItem={removeInvestigation}
              />

              <HistorySection
                items={prescriptionData.history}
                onAddClick={() => openModal("history")}
                onRemoveItem={removeHistory}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <MedicationsSection
                medications={prescriptionData.medications}
                onAddClick={() => openModal("medications")}
                onRemoveItem={removeMedication}
              />

              <AdviceSection
                items={prescriptionData.advice}
                onAddClick={() => openModal("advice")}
                onRemoveItem={removeAdvice}
              />

              <NextVisitSection
                nextVisit={prescriptionData.nextVisit}
                onAddClick={() => openModal("nextVisit")}
              />
            </div>
          </div>

          {/* Footer */}
          <PrescriptionFooter />
        </div>

        <PatientModal
          isOpen={activeModal === "patient"}
          onClose={closeModal}
          onSubmit={handlePatientSubmit}
          initialData={{
            name: prescriptionData.patientName,
            age: prescriptionData.age,
            date: prescriptionData.date,
          }}
        />

        <ChiefComplaintModal
          isOpen={activeModal === "chiefComplaint"}
          onClose={closeModal}
          onSubmit={handleChiefComplaintSubmit}
        />

        <ExaminationsModal
          isOpen={activeModal === "examinations"}
          onClose={closeModal}
          onSubmit={handleExaminationsSubmit}
          tags={prescriptionTags.examinations}
        />

        <DiagnosisModal
          isOpen={activeModal === "diagnosis"}
          onClose={closeModal}
          onSubmit={handleDiagnosisSubmit}
        />

        <InvestigationModal
          isOpen={activeModal === "investigations"}
          onClose={closeModal}
          onSubmit={handleInvestigationSubmit}
        />

        <HistoryModal
          isOpen={activeModal === "history"}
          onClose={closeModal}
          onSubmit={handleHistorySubmit}
        />

        <MedicationsModal
          isOpen={activeModal === "medications"}
          onClose={closeModal}
          onSubmit={handleMedicationsSubmit}
        />

        <AdviceModal
          isOpen={activeModal === "advice"}
          onClose={closeModal}
          // AdviceModal may call onSubmit with { advices: AdviceItem[] } or { advices: string[] }
          onSubmit={(data: any) => {
            // Normalize to shape expected by handleAdviceSubmit
            if (data && Array.isArray(data.advices)) {
              handleAdviceSubmit({ advices: data.advices });
            } else if (data && data.advice) {
              handleAdviceSubmit({ advice: data.advice });
            }
          }}
          tags={prescriptionTags.advice}
        />

        <NextVisitModal
          isOpen={activeModal === "nextVisit"}
          onClose={closeModal}
          onSubmit={handleNextVisitSubmit}
        />
      </div>
    </div>
  );
}
