/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { PrescriptionData } from "@/types/new-prescription.types";
import type { NextVisitItem } from "../PrescriptionModals/_components/NextVisitModal/NextVisitModal";

interface ComplaintItem {
  id: string;
  label: string;
  duration: string;
  unit: string;
  notes: string;
}

export type GeneralItem = ComplaintItem;
export type PersonalItem = ComplaintItem;
export type FamilyItem = ComplaintItem;

interface HistoryData {
  general?: GeneralItem[];
  personal?: PersonalItem[];
  family?: FamilyItem[];
  drugs?: string[];
  investigations?: IncomingInvestigation[];
}

type ExaminationItem = {
  id: string;
  label: string;
  notes: string;
};

type GeneralExamination = {
  bloodPressure: string;
  diastolic: string;
  pulse: string;
  pulseType: "Regular" | "Irregular" | "Drop-Beat";
  temperature: string;
  temperatureType: "Normal" | "Abnormal";
  weight: string;
  height: {
    feet: string;
    inch: string;
  };
  showInPrescription: boolean;
};

type CoMorbiditiesItem = {
  id: string;
  label: string;
  notes: string;
};

type DiagnosisItem = {
  id: string;
  label: string;
  notes: string;
};

interface MedicationInstructions {
  beforeEating: boolean;
  afterEating: boolean;
  notes: string;
}

interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: MedicationInstructions;
  showInPrescription?: boolean;
}

type AdviceItem = {
  id: string;
  label: string;
  notes: string;
};

type TreatmentPlanItem = {
  id: string;
  label: string;
  notes: string;
};

type IncomingInvestigation = {
  id: string;
  label: string;
  notes: string;
};

// Raw data types for storing incoming data before formatting
export interface RawPrescriptionData {
  patient?: {
    name: string;
    age: string;
    date: string;
  };
  chiefComplaint?: {
    complaints: ComplaintItem[];
  };
  examinations?: {
    examinations: ExaminationItem[];
    generalExam: GeneralExamination;
  };
  diagnosis?: {
    diagnosis: DiagnosisItem[];
  };
  investigations?: {
    investigations: IncomingInvestigation[];
  };
  history?: HistoryData;
  treatmentPlan?: {
    treatmentPlan: TreatmentPlanItem[];
  };
  coMorbidities?: {
    coMorbidities: CoMorbiditiesItem[];
  };
  medications?: {
    medications: MedicationItem[];
  };
  advice?: {
    advices?: AdviceItem[];
  };
  nextVisit?: {
    nextVisit: NextVisitItem;
  };
}

export function usePrescriptionData() {
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>({
    patientName: "",
    age: "",
    date: new Date().toLocaleDateString("en-GB"),
    chiefComplaint: [],
    examinations: [],
    diagnosis: [],
    investigations: [],
    history: [],
    treatmentPlan: [],
    coMorbidities: [],
    medications: [],
    advice: [],
    nextVisit: "",
  });

  // Store raw incoming data before formatting
  const [rawPrescriptionData, setRawPrescriptionData] =
    useState<RawPrescriptionData>({});

  // Patient handlers
  const handlePatientSubmit = (data: {
    name: string;
    age: string;
    date: string;
  }) => {
    // Store raw data
    setRawPrescriptionData((prev) => ({
      ...prev,
      patient: data,
    }));

    // Log raw data to console
    console.log("Raw Patient Data:", data);

    setPrescriptionData((prev) => ({
      ...prev,
      patientName: data.name,
      age: data.age,
      date: data.date,
    }));
  };

  // Chief Complaint handlers
  const handleChiefComplaintSubmit = (data: {
    complaints: ComplaintItem[];
  }) => {
    // Store raw data
    setRawPrescriptionData((prev) => ({
      ...prev,
      chiefComplaint: data,
    }));

    // Log raw data to console
    console.log("Raw Chief Complaint Data:", data);

    const formatted = data.complaints.map((item) => {
      const dur = item.duration ? `${item.duration}` : "";
      const unit = item.unit ? ` ${item.unit}` : "";
      const notes = item.notes ? ` (${item.notes})` : "";
      const middle = dur ? `${dur}${unit}`.trim() : unit.trim();
      return `${item.label} ${middle ? `for ${middle}` : ""}${notes}`.trim();
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

  const removeChiefComplaint = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      chiefComplaint: prev.chiefComplaint.filter((_, i) => i !== index),
    }));
  };

  // Examinations handlers
  const handleExaminationsSubmit = (data: {
    examinations: ExaminationItem[];
    generalExam: GeneralExamination;
  }) => {
    // Store raw data
    setRawPrescriptionData((prev) => ({
      ...prev,
      examinations: {
        generalExam: data.generalExam,
        examinations: data.examinations,
      },
    }));

    // Log raw data to console
    console.log("Raw Examinations Data:", data);

    const formattedExaminations = data.examinations.map(
      (item) => item.label + (item.notes ? ` (${item.notes})` : "")
    );
    const {
      bloodPressure,
      diastolic,
      pulse,
      pulseType,
      temperature,
      temperatureType,
      weight,
      height,
      showInPrescription,
    } = data.generalExam;

    let generalExamStr = "";
    if (showInPrescription) {
      generalExamStr = [
        bloodPressure && diastolic
          ? `BP: ${bloodPressure}/${diastolic} mmHg`
          : "",
        pulse ? `Pulse: ${pulse} ${pulseType}` : "",
        temperature ? `Temp: ${temperature} ${temperatureType}` : "",
        weight ? `Weight: ${weight} kg` : "",
        height.feet || height.inch
          ? `Height: ${height.feet}'${height.inch}"`
          : "",
      ]
        .filter(Boolean)
        .join(", ");
    }

    setPrescriptionData((prev) => ({
      ...prev,
      examinations: [
        ...formattedExaminations,
        ...(generalExamStr ? [generalExamStr] : []),
      ],
    }));
  };

  const removeExamination = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      examinations: prev.examinations.filter((_, i) => i !== index),
    }));
  };

  // Diagnosis handlers
  const handleDiagnosisSubmit = (diagnosisItem: DiagnosisItem) => {
    setRawPrescriptionData((prev) => ({
      ...prev,
      diagnosis: {
        diagnosis: prev.diagnosis?.diagnosis
          ? [...prev.diagnosis.diagnosis, diagnosisItem]
          : [diagnosisItem],
      },
    }));

    console.log("Raw Diagnosis Data:", diagnosisItem);

    setPrescriptionData((prev) => ({
      ...prev,
      diagnosis: [
        ...(prev.diagnosis || []),
        diagnosisItem.notes
          ? `${diagnosisItem.label} (${diagnosisItem.notes})`
          : diagnosisItem.label,
      ],
    }));
  };

  const removeDiagnosis = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      diagnosis: prev.diagnosis.filter((_, i) => i !== index),
    }));
  };

  // Investigation handlers
  const handleInvestigationSubmit = (data: {
    investigations: IncomingInvestigation[];
  }) => {
    setRawPrescriptionData((prev) => ({
      ...prev,
      investigations: data,
    }));

    console.log("Raw Investigation Data:", data);

    if (Array.isArray(data.investigations)) {
      const formattedInvestigations = data.investigations.map((inv) => {
        if (typeof inv === "string") return inv;
        const result = inv.notes ? ` ${inv.notes}` : "";
        return `${inv.label}${result}`;
      });

      setPrescriptionData((prev) => ({
        ...prev,
        investigations: [...prev.investigations, ...formattedInvestigations],
      }));
    }
  };

  const removeInvestigation = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      investigations: prev.investigations.filter((_, i) => i !== index),
    }));
  };

  // History handlers
  const formatComplaint = (item: ComplaintItem) => {
    const dur = item.duration ? `${item.duration}` : "";
    const unit = item.unit ? ` ${item.unit}` : "";
    const notes = item.notes ? ` (${item.notes})` : "";
    const middle = dur ? `${dur}${unit}`.trim() : unit.trim();
    return `${item.label}${middle ? ` ${middle}` : ""}${notes}`.trim();
  };

  const handleHistorySubmit = (data: HistoryData) => {
    setRawPrescriptionData((prev) => ({
      ...prev,
      history: data,
    }));

    const sections: string[] = [];

    if (data.general && data.general.length > 0) {
      const items = data.general.map((g) => formatComplaint(g));
      sections.push(`G/O: ${items.join("; ")}`);
    }

    if (data.drugs && data.drugs.length > 0) {
      sections.push(`D/O: ${data.drugs.join(", ")}`);
    }

    if (data.investigations && data.investigations.length > 0) {
      const items = data.investigations.map((inv) => {
        const res = inv.notes ? ` ${inv.notes}` : "";
        return `${inv.label}${res}`;
      });
      sections.push(`I/O: ${items.join("; ")}`);
    }

    if (data.personal && data.personal.length > 0) {
      const items = data.personal.map((p) => formatComplaint(p));
      sections.push(`P/O: ${items.join("; ")}`);
    }

    if (data.family && data.family.length > 0) {
      const items = data.family.map((f) => formatComplaint(f));
      sections.push(`F/O: ${items.join("; ")}`);
    }

    if (sections.length > 0) {
      setPrescriptionData((prev) => ({
        ...prev,
        history: [...prev.history, ...sections],
      }));
    }
  };

  const removeHistory = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      history: prev.history.filter((_, i) => i !== index),
    }));
  };

  // Treatment Plan handlers
  const handleTreatmentPlanSubmit = (data: TreatmentPlanItem) => {
    setRawPrescriptionData((prev) => ({
      ...prev,
      treatmentPlan: {
        treatmentPlan: [...(prev.treatmentPlan?.treatmentPlan || []), data],
      },
    }));

    // Log raw data
    console.log("Raw Treatment Plan Data:", data);

    const formattedTreatment = `${data.label}${data.notes ? ` ${data.notes}` : ""}`;

    setPrescriptionData((prev) => ({
      ...prev,
      treatmentPlan: [...prev.treatmentPlan, formattedTreatment],
    }));
  };

  const removeTreatmentPlan = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      treatmentPlan: prev.treatmentPlan.filter((_, i) => i !== index),
    }));
  };

  // Co Morbidities handlers
  const handleCoMorbiditiesSubmit = (data: CoMorbiditiesItem) => {
    setRawPrescriptionData((prev) => ({
      ...prev,
      coMorbidities: {
        coMorbidities: [...(prev.coMorbidities?.coMorbidities || []), data],
      },
    }));

    // Log raw data to console
    console.log("Raw Co-Morbidities Data:", data);

    const formattedTreatment = `${data.label}${data.notes ? ` ${data.notes}` : ""}`;

    setPrescriptionData((prev) => ({
      ...prev,
      coMorbidities: [...prev.coMorbidities, formattedTreatment],
    }));
  };

  const removeCoMorbidities = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      coMorbidities: prev.coMorbidities.filter((_, i) => i !== index),
    }));
  };

  // Medications handlers
  const handleMedicationsSubmit = (data: MedicationItem | MedicationItem[]) => {
    const medsArray = Array.isArray(data) ? data : [data];

    setRawPrescriptionData((prev) => ({
      ...prev,
      medications: {
        medications: [...(prev.medications?.medications || []), ...medsArray],
      },
    }));

    // Log raw data to console
    console.log("Raw Medications Data:", data);

    const formatInstructions = (instr: any): string => {
      if (!instr) return "";
      if (typeof instr === "string") return instr;
      const parts: string[] = [];
      if (instr.beforeEating) parts.push("Before eating");
      if (instr.afterEating) parts.push("After eating");
      if (instr.notes) parts.push(instr.notes);
      return parts.join("; ").trim();
    };

    // Handle both single medication and array of medications
    const medicationsToAdd = Array.isArray(data) ? data : [data];

    const medicationEntries = medicationsToAdd.map((med) => ({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
      instructions: formatInstructions((med as any).instructions),
    }));

    setPrescriptionData((prev) => ({
      ...prev,
      medications: [...prev.medications, ...medicationEntries],
    }));
  };

  const removeMedication = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  // Advice handlers
  const handleAdviceSubmit = (data: { advice: AdviceItem[] }) => {
    setRawPrescriptionData((prev) => ({
      ...prev,
      advices: data,
    }));

    // Log raw data to console
    console.log("Raw Advice Data:", data);

    if ((data as any).advices && Array.isArray((data as any).advices)) {
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

    const adv = (data as any).advice ?? (data as any).adviceText ?? "";
    if (adv) {
      setPrescriptionData((prev) => ({
        ...prev,
        advice: [...prev.advice, String(adv)],
      }));
    }
  };

  const removeAdvice = (index: number) => {
    setPrescriptionData((prev) => ({
      ...prev,
      advice: prev.advice.filter((_, i) => i !== index),
    }));
  };

  // Next Visit handlers
  const handleNextVisitSubmit = (data: { nextVisit: NextVisitItem }) => {
    // Store raw data
    setRawPrescriptionData((prev) => ({
      ...prev,
      nextVisit: data,
    }));

    // Log raw data to console
    console.log("Raw Next Visit Data:", data);

    const nv = data.nextVisit;
    const formatted =
      `${nv.durationValue} ${nv.durationType} পর${nv.notes ? ` ${nv.notes}` : ""}${nv.showInReport ? " রিপোর্ট সহ" : ""}${nv.withPatient ? " আসবেন" : ""}`.trim();
    setPrescriptionData((prev) => ({
      ...prev,
      nextVisit: formatted,
    }));
  };

  const removeNextVisit = () => {
    setPrescriptionData((prev) => ({
      ...prev,
      nextVisit: "",
    }));
  };

  return {
    prescriptionData,
    rawPrescriptionData,
    handlers: {
      patient: handlePatientSubmit,
      chiefComplaint: handleChiefComplaintSubmit,
      examinations: handleExaminationsSubmit,
      diagnosis: handleDiagnosisSubmit,
      investigation: handleInvestigationSubmit,
      history: handleHistorySubmit,
      treatmentPlan: handleTreatmentPlanSubmit,
      coMorbidities: handleCoMorbiditiesSubmit,
      medications: handleMedicationsSubmit,
      advice: handleAdviceSubmit,
      nextVisit: handleNextVisitSubmit,
    },
    removeHandlers: {
      chiefComplaint: removeChiefComplaint,
      examination: removeExamination,
      diagnosis: removeDiagnosis,
      investigation: removeInvestigation,
      history: removeHistory,
      treatmentPlan: removeTreatmentPlan,
      coMorbidities: removeCoMorbidities,
      medication: removeMedication,
      advice: removeAdvice,
      nextVisit: removeNextVisit,
    },
  };
}
