/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import PrescriptionHeader from "./_components/PrescriptionHeader";
import PrescriptionFooter from "./_components/PrescriptionFooter";
import ReusableModal from "./_components/ReusableModal";
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

// Types
interface PrescriptionData {
  patientName: string;
  age: string;
  date: string;
  chiefComplaint: string[];
  examinations: string[];
  diagnosis: string[];
  investigations: string[];
  history: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  advice: string[];
  nextVisit: string;
}

interface ModalField {
  id: string;
  label: string;
  type?: "text" | "textarea" | "date";
  placeholder?: string;
  rows?: number;
}

interface ModalConfig {
  title: string;
  fields: ModalField[];
  buttonLabel: string;
}

// Modal configurations
const modalConfigs: Record<string, ModalConfig> = {
  patient: {
    title: "Patient Information",
    buttonLabel: "Save Patient Information",
    fields: [
      { id: "name", label: "Patient Name", placeholder: "Enter patient name" },
      { id: "age", label: "Age", placeholder: "Enter age" },
      { id: "date", label: "Date", type: "date" },
    ],
  },
  chiefComplaint: {
    title: "Chief Complaint",
    buttonLabel: "Add Complaint",
    fields: [
      {
        id: "complaint",
        label: "Complaint",
        type: "textarea",
        rows: 3,
        placeholder: "Enter chief complaint",
      },
    ],
  },
  examinations: {
    title: "Examinations",
    buttonLabel: "Add Examination",
    fields: [
      {
        id: "examination",
        label: "Examination Finding",
        type: "textarea",
        rows: 3,
        placeholder: "Enter examination findings",
      },
    ],
  },
  diagnosis: {
    title: "Diagnosis",
    buttonLabel: "Add Diagnosis",
    fields: [
      {
        id: "diagnosis",
        label: "Diagnosis",
        type: "textarea",
        rows: 3,
        placeholder: "Enter diagnosis",
      },
    ],
  },
  investigations: {
    title: "Investigations",
    buttonLabel: "Add Investigation",
    fields: [
      {
        id: "investigation",
        label: "Investigation",
        type: "textarea",
        rows: 3,
        placeholder: "Enter investigation details",
      },
    ],
  },
  history: {
    title: "History",
    buttonLabel: "Add History",
    fields: [
      {
        id: "history",
        label: "Medical History",
        type: "textarea",
        rows: 3,
        placeholder: "Enter medical history",
      },
    ],
  },
  medications: {
    title: "Medications",
    buttonLabel: "Add Medication",
    fields: [
      {
        id: "name",
        label: "Medication Name",
        placeholder: "Enter medication name",
      },
      { id: "dosage", label: "Dosage", placeholder: "e.g., 500mg" },
      { id: "frequency", label: "Frequency", placeholder: "e.g., Twice daily" },
      { id: "duration", label: "Duration", placeholder: "e.g., 7 days" },
    ],
  },
  advice: {
    title: "Advice",
    buttonLabel: "Add Advice",
    fields: [
      {
        id: "advice",
        label: "Medical Advice",
        type: "textarea",
        rows: 3,
        placeholder: "Enter medical advice",
      },
    ],
  },
  nextVisit: {
    title: "Next Visit",
    buttonLabel: "Set Next Visit",
    fields: [
      {
        id: "nextVisit",
        label: "Next Visit Details",
        type: "textarea",
        rows: 2,
        placeholder: "Enter next visit details",
      },
    ],
  },
};

// Sample tags for different prescription sections
const prescriptionTags = {
  chiefComplaint: [
    { id: "cc1", label: "Chest pain", category: "Cardiac" },
    { id: "cc2", label: "Shortness of breath", category: "Respiratory" },
    { id: "cc3", label: "Headache", category: "Neurological" },
    { id: "cc4", label: "Abdominal pain", category: "GI" },
    { id: "cc5", label: "Fever", category: "General" },
    { id: "cc6", label: "Cough", category: "Respiratory" },
    { id: "cc7", label: "Nausea", category: "GI" },
    { id: "cc8", label: "Dizziness", category: "Neurological" },
  ],
  examinations: [
    { id: "ex1", label: "Normal heart sounds", category: "Cardiac" },
    { id: "ex2", label: "Clear lung fields", category: "Respiratory" },
    { id: "ex3", label: "Soft abdomen", category: "GI" },
    { id: "ex4", label: "No lymphadenopathy", category: "General" },
    { id: "ex5", label: "Normal reflexes", category: "Neurological" },
    { id: "ex6", label: "No edema", category: "General" },
  ],
  diagnosis: [
    { id: "dx1", label: "Hypertension", category: "Cardiac" },
    { id: "dx2", label: "Type 2 Diabetes", category: "Endocrine" },
    {
      id: "dx3",
      label: "Upper respiratory infection",
      category: "Respiratory",
    },
    { id: "dx4", label: "Gastritis", category: "GI" },
    { id: "dx5", label: "Migraine", category: "Neurological" },
  ],
  medications: [
    { id: "med1", label: "Paracetamol 500mg", category: "Analgesic" },
    { id: "med2", label: "Amoxicillin 250mg", category: "Antibiotic" },
    { id: "med3", label: "Omeprazole 20mg", category: "PPI" },
    { id: "med4", label: "Metformin 500mg", category: "Antidiabetic" },
    { id: "med5", label: "Amlodipine 5mg", category: "Antihypertensive" },
    { id: "med6", label: "Aspirin 75mg", category: "Antiplatelet" },
  ],
  advice: [
    { id: "adv1", label: "Take rest", category: "General" },
    { id: "adv2", label: "Drink plenty of fluids", category: "General" },
    { id: "adv3", label: "Avoid spicy food", category: "Dietary" },
    { id: "adv4", label: "Regular exercise", category: "Lifestyle" },
    { id: "adv5", label: "Monitor blood pressure", category: "Monitoring" },
  ],
};

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

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    formData: {} as Record<string, string>,
  });

  // Modal handlers
  const openModal = (type: string) => {
    setModalState({
      isOpen: true,
      type,
      formData: {},
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: "",
      formData: {},
    });
  };

  const handleFormDataChange = (data: Record<string, string>) => {
    setModalState((prev) => ({ ...prev, formData: data }));
  };

  const handleModalSubmit = (data: Record<string, string>) => {
    setPrescriptionData((prev) => {
      const updated = { ...prev };

      switch (modalState.type) {
        case "patient":
          return {
            ...updated,
            patientName: data.name,
            age: data.age,
            date: data.date,
          };

        case "chiefComplaint":
          return {
            ...updated,
            chiefComplaint: [...prev.chiefComplaint, data.complaint],
          };

        case "examinations":
          return {
            ...updated,
            examinations: [...prev.examinations, data.examination],
          };

        case "diagnosis":
          return {
            ...updated,
            diagnosis: [...prev.diagnosis, data.diagnosis],
          };

        case "investigations":
          return {
            ...updated,
            investigations: [...prev.investigations, data.investigation],
          };

        case "history":
          return {
            ...updated,
            history: [...prev.history, data.history],
          };

        case "medications":
          return {
            ...updated,
            medications: [
              ...prev.medications,
              {
                name: data.name,
                dosage: data.dosage,
                frequency: data.frequency,
                duration: data.duration,
              },
            ],
          };

        case "advice":
          return {
            ...updated,
            advice: [...prev.advice, data.advice],
          };

        case "nextVisit":
          return {
            ...updated,
            nextVisit: data.nextVisit,
          };

        default:
          return updated;
      }
    });
    closeModal();
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

  const handleTagSelect = (tag: any) => {
    const fieldMapping: Record<string, string> = {
      chiefComplaint: "complaint",
      examinations: "examination",
      diagnosis: "diagnosis",
      medications: "name",
      advice: "advice",
    };

    const fieldId = fieldMapping[modalState.type];
    if (fieldId) {
      handleFormDataChange({ ...modalState.formData, [fieldId]: tag.label });
    }
  };

  const getTagsForModalType = (type: string) => {
    switch (type) {
      case "chiefComplaint":
        return prescriptionTags.chiefComplaint;
      case "examinations":
        return prescriptionTags.examinations;
      case "diagnosis":
        return prescriptionTags.diagnosis;
      case "medications":
        return prescriptionTags.medications;
      case "advice":
        return prescriptionTags.advice;
      default:
        return [];
    }
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

        <ReusableModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          config={modalConfigs[modalState.type] || modalConfigs.patient}
          formData={modalState.formData}
          onFormDataChange={handleFormDataChange}
          showSearch={
            modalState.type !== "patient" && modalState.type !== "nextVisit"
          }
          tags={getTagsForModalType(modalState.type)}
          onTagSelect={handleTagSelect}
          searchPlaceholder={`Search ${modalState.type}...`}
        />
      </div>
    </div>
  );
}
