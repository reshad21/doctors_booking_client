import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PrescriptionHeader from "./_components/PrescriptionHeader";
import PrescriptionFooter from "./_components/PrescriptionFooter";
import ReusableModal from "./_components/ReusableModal";

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

// Section Component for better organization
interface SectionProps {
  title: string;
  children: React.ReactNode;
  onAddClick: () => void;
  minHeight?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  onAddClick,
  minHeight = "40px",
}) => (
  <div className="prescription-section">
    <div className="flex items-center gap-2 mb-2">
      <h3
        className={`section-title ${title === "Rx" ? "text-lg font-bold" : ""}`}
      >
        {title}
      </h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddClick}
        className="p-1 h-5 w-5 text-blue-600 hover:bg-blue-50"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
    <div className={`prescription-content text-sm`} style={{ minHeight }}>
      {children}
    </div>
  </div>
);

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

  // Render list items
  const renderListItems = (items: string[]) => (
    <>
      {items.map((item, index) => (
        <div key={index} className="mb-1">
          - {item}
        </div>
      ))}
    </>
  );

  // Render medications
  const renderMedications = () => (
    <>
      {prescriptionData.medications.map((med, index) => (
        <div key={index} className="mb-3">
          <div className="flex items-start gap-2">
            <span className="rx-number">{index + 1}.</span>
            <div>
              <div className="font-medium">{med.name}</div>
              <div className="text-xs text-gray-600 ml-4">
                {med.dosage} - {med.frequency} - {med.duration}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-lg">
          {/* Header */}
          <PrescriptionHeader />

          {/* Patient Information */}
          <div className="grid grid-cols-3 gap-8 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Name:</span>
             
              <span className="patient-info-line text-sm">
                {prescriptionData.patientName || ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Age:</span>
              <span className="patient-info-line text-sm w-16">
                {prescriptionData.age || ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Date:</span>
              <span className="patient-info-line text-sm">
                {prescriptionData.date}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              <Section
                title="Chief Complaint"
                onAddClick={() => openModal("chiefComplaint")}
              >
                {renderListItems(prescriptionData.chiefComplaint)}
              </Section>

              <Section
                title="On Examinations"
                onAddClick={() => openModal("examinations")}
              >
                {renderListItems(prescriptionData.examinations)}
              </Section>

              <Section
                title="Diagnosis"
                onAddClick={() => openModal("diagnosis")}
              >
                {renderListItems(prescriptionData.diagnosis)}
              </Section>

              <Section
                title="Investigation"
                onAddClick={() => openModal("investigations")}
              >
                {renderListItems(prescriptionData.investigations)}
              </Section>

              <Section title="History" onAddClick={() => openModal("history")}>
                {renderListItems(prescriptionData.history)}
              </Section>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <Section
                title="Rx"
                onAddClick={() => openModal("medications")}
                minHeight="200px"
              >
                {renderMedications()}
              </Section>

              <Section
                title="Advice"
                onAddClick={() => openModal("advice")}
                minHeight="60px"
              >
                {renderListItems(prescriptionData.advice)}
              </Section>

              <Section
                title="Next Visit"
                onAddClick={() => openModal("nextVisit")}
              >
                {prescriptionData.nextVisit}
              </Section>
            </div>
          </div>

          {/* Footer */}
          <PrescriptionFooter />
        </div>

        {/* Single Reusable Modal */}
        <ReusableModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          config={modalConfigs[modalState.type] || modalConfigs.patient}
          formData={modalState.formData}
          onFormDataChange={handleFormDataChange}
        />
      </div>
    </div>
  );
}