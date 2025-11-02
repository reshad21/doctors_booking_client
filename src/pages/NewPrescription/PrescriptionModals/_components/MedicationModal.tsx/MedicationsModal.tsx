/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Tag } from "@/types/new-prescription.types";
import { useState } from "react";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import MedicationList from "./MedicationList";
import MedicationEditor from "./MedicationEditor";
import { MedicineGroupsTab } from "./MedicineGroupTabs";

export const MedicationsModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: {
      beforeEating: boolean;
      afterEating: boolean;
      notes: string;
    };
    showInPrescription?: boolean;
  }) => void;
  tags?: Tag[];
}) => {
  const [activeTab, setActiveTab] = useState<
    "medication" | "medication groups"
  >("medication");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInPrescription, setShowInPrescription] = useState(true);
  const [medications, setMedications] = useState<any[]>([]);

  const handleSubmit = () => {
    if (medications.length > 0) {
      const med = medications[0];

      // Build instruction string
      let instructionStr = "";
      if (med.beforeEating) instructionStr += "Before eating ";
      if (med.afterEating) instructionStr += "After eating ";
      if (med.instructionNotes) instructionStr += `- ${med.instructionNotes}`;

      onSubmit({
        name: med.name,
        dosage: med.dosage
          ? `${med.dosage}`
          : `${med.dosageValue} ${med.dosageUnit}`,
        frequency: med.frequencyValue
          ? `${med.frequencyValue} ${med.frequencyUnit}`
          : "",
        duration: med.durationValue
          ? `${med.durationValue} ${med.durationUnit}`
          : "",
        instructions: {
          beforeEating: med.beforeEating,
          afterEating: med.afterEating,
          notes: instructionStr.trim(),
        },
        showInPrescription: showInPrescription,
      });
      setMedications([]);
      onClose();
    }
  };

  const isMedSelected = (name: string) =>
    medications.some((m) => m.name === name);

  const toggleMedication = (
    name: string,
    type: "Tablet" | "Capsule" | "Other"
  ) => {
    if (isMedSelected(name)) {
      setMedications((prev) => prev.filter((m) => m.name !== name));
    } else {
      setMedications((prev) => [
        ...prev,
        {
          id: String(Date.now()) + Math.random().toString(16).slice(2),
          name,
          type, // Store the classified type
          dosage: "",
          durationValue: "",
          durationUnit: "days",
          beforeEating: false,
          afterEating: false,
          instructionNotes: "",
          isInstruction: false,
          dosageValue: "",
          dosageUnit: "piece",
          frequencyValue: "",
          frequencyUnit: "times",
          frequencyText: "",
          limitValue: "",
          limitUnit: "piece",
        },
      ]);
    }
  };
  const updateMedication = (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Medications"
      maxWidthClass="max-w-6xl"
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search medications...",
      }}
      prescriptionToggle={{
        checked: showInPrescription,
        onChange: setShowInPrescription,
      }}
    >
      <div className="p-4 pb-4 space-y-4">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("medication")}
            className={`flex-1 py-3 px-6 rounded-lg cursor-pointer font-medium transition-colors ${
              activeTab === "medication"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Medicine
          </button>
          <button
            onClick={() => setActiveTab("medication groups")}
            className={`flex-1 py-3 px-6 rounded-lg cursor-pointer font-medium transition-colors ${
              activeTab === "medication groups"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Medicine Groups
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        {activeTab === "medication" && (
          <div className="flex gap-6 pb-6">
            <MedicationList
              searchQuery={searchQuery}
              toggleMedication={toggleMedication}
              isMedSelected={isMedSelected}
            />
            <MedicationEditor
              medications={medications}
              removeMedication={removeMedication}
              updateMedication={updateMedication}
            />
          </div>
        )}

        {activeTab === "medication groups" && (
          <MedicineGroupsTab
            searchQuery={searchQuery}
            onLoadGroup={(medications) => {
              // medications is now an array of {name: string, type: 'Tablet' | 'Capsule' | 'Other'}
              medications.forEach((med) => {
                toggleMedication(med.name, med.type);
              });
              setActiveTab("medication");
            }}
          />
        )}
      </div>

      <Modal.Footer>
        <Button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6"
        >
          Add Medication
        </Button>
        <Button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 text-white px-6"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
