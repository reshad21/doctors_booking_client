import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { DiagnosisTabs } from "./components/DiagnosisTabs";
import { GroupTabs } from "./components/GroupTabs";

export interface DiagnosisItem {
  id: string;
  label: string;
  notes: string;
}

export const DiagnosisModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { diagnosis: string }) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"diagnosis" | "groups">(
    "diagnosis"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showInPrescription, setShowInPrescription] = useState(true);
  const [diagnoses, setDiagnoses] = useState<DiagnosisItem[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Keep existing NewPrescription handler compatibility by calling onSubmit for each diagnosis string
    if (diagnoses.length > 0) {
      diagnoses.forEach((d) => {
        const text = d.notes ? `${d.label} (${d.notes})` : d.label;
        onSubmit({ diagnosis: text });
      });
      onClose();
      return;
    }
    // fallback: no diagnoses selected
    onClose();
  };

  const handleAddDiagnosis = (label: string) => {
    const exists = diagnoses.some((d) => d.label === label);
    if (!exists) {
      setDiagnoses([
        ...diagnoses,
        {
          id: String(Date.now()),
          label,
          notes: "",
        },
      ]);
    }
  };

  const handleRemoveDiagnosis = (id: string) => {
    setDiagnoses(diagnoses.filter((d) => d.id !== id));
  };

  const handleUpdateDiagnosis = (
    id: string,
    field: keyof DiagnosisItem,
    value: string
  ) => {
    setDiagnoses(
      diagnoses.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleLoadGroupToDiagnoses = (items: string[]) => {
    setActiveTab("diagnosis");
    const newDiagnoses: DiagnosisItem[] = items.map((item) => ({
      id: `${Date.now()}-${item}`,
      label: item,
      notes: "",
    }));
    setDiagnoses(newDiagnoses);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-6xl"
      title="Add Diagnosis"
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search diagnosis...",
      }}
      prescriptionToggle={{
        checked: showInPrescription,
        onChange: setShowInPrescription,
      }}
    >
<div className="flex flex-col h-full max-h-[calc(90vh-120px)]">
        <div className="flex gap-3 p-4 pb-0 flex-shrink-0">
          <Button
            className={`flex-1 py-3 px-6 cursor-pointer rounded-lg font-medium transition-colors ${
              activeTab === "diagnosis"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("diagnosis")}
          >
            Diagnosis
          </Button>
          <Button
            className={`flex-1 py-3 px-6 cursor-pointer rounded-lg font-medium transition-colors ${
              activeTab === "groups"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("groups")}
          >
            Groups
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0">
          {activeTab === "diagnosis" && (
            <DiagnosisTabs
              searchQuery={searchQuery}
              diagnoses={diagnoses}
              onToggleFilter={(label: string) => handleAddDiagnosis(label)}
              onRemoveDiagnosis={handleRemoveDiagnosis}
              onUpdateDiagnosis={handleUpdateDiagnosis}
            />
          )}

          {activeTab === "groups" && (
            <GroupTabs
              searchQuery={searchQuery}
              onLoadGroup={handleLoadGroupToDiagnoses}
            />
          )}
        </div>

        {activeTab === "diagnosis" && (
          <Modal.Footer>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Add to Prescription
            </Button>
          </Modal.Footer>
        )}
      </div>
    </Modal>
  );
};
