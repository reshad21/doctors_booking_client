/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Tag } from "@/types/new-prescription.types";
import { useState } from "react";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { medicineOptions } from "@/constant/medication.constant";

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

  const [medications, setMedications] = useState<
    Array<{
      [x: string]: any;
      id: string;
      name: string;
      dosage: string;
      durationValue: string;
      durationUnit: string;
      instruction1: boolean;
      instruction2: boolean;
      instructionNotes: string;
      isInstruction: boolean;
      dosageValue: string;
      dosageUnit: string;
      frequencyValue: string;
      frequencyText: string;
      limitValue: string;
      limitUnit: string;
      beforeEating: boolean;
      afterEating: boolean;
    }>
  >([]);

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
        dosage: med.dosageValue ? `${med.dosageValue} ${med.dosageUnit}` : "",
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

  const toggleMedication = (name: string) => {
    if (isMedSelected(name)) {
      setMedications((prev) => prev.filter((m) => m.name !== name));
    } else {
      setMedications((prev) => [
        ...prev,
        {
          id: String(Date.now()) + Math.random().toString(16).slice(2),
          name,
          dosage: "",
          durationValue: "",
          durationUnit: "days",
          instruction1: false,
          instruction2: false,
          instructionNotes: "",
          isInstruction: false,
          dosageValue: "",
          dosageUnit: "piece", // Set default unit
          frequencyValue: "",
          frequencyUnit: "times", // Set default unit
          frequencyText: "",
          limitValue: "",
          limitUnit: "piece",
          beforeEating: false,
          afterEating: false,
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

  const parseDosageValues = (dosageString: string) => {
    return dosageString.split("+").map((v) => v.trim());
  };

  const renderStandardizedForm = (med: any) => {
    return (
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
          {/* Dosage Section */}
          <div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Schedule
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={med.dosageValue}
                  onChange={(e) =>
                    updateMedication(med.id, "dosageValue", e.target.value)
                  }
                  placeholder="5"
                  className="w-16 text-sm text-center"
                />
                <Select
                  value={med.dosageUnit}
                  onValueChange={(v) =>
                    updateMedication(med.id, "dosageUnit", v)
                  }
                >
                  <SelectTrigger className="w-32 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spoon">চামচ</SelectItem>
                    <SelectItem value="piece">টা</SelectItem>
                    <SelectItem value="drop">ড্রপ</SelectItem>
                    <SelectItem value="ampule">এম্পুল</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Frequency Section */}
          <div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Frequency
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={med.frequencyValue}
                  onChange={(e) =>
                    updateMedication(med.id, "frequencyValue", e.target.value)
                  }
                  placeholder="0"
                  className="w-16 text-center text-sm"
                />
                <Select
                  value={med.frequencyUnit}
                  onValueChange={(v) =>
                    updateMedication(med.id, "frequencyUnit", v)
                  }
                >
                  <SelectTrigger className="w-32 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="times">বার</SelectItem>
                    <SelectItem value="meals">বেলা</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Duration Section in second line */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-2">
          <div className="flex-1 min-w-[200px]">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Duration
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={med.durationValue}
                  onChange={(e) =>
                    updateMedication(med.id, "durationValue", e.target.value)
                  }
                  placeholder="0"
                  className="w-16 text-center text-sm"
                />
                <Select
                  value={med.durationUnit}
                  onValueChange={(v) =>
                    updateMedication(med.id, "durationUnit", v)
                  }
                >
                  <SelectTrigger className="w-32 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Display entered values */}
        {(med.dosageValue || med.frequencyValue || med.durationValue) && (
          <div className="text-sm text-gray-600 mt-2">
            <p>
              {med.dosageValue} {med.dosageUnit} {med.frequencyValue}{" "}
              {med.frequencyUnit} for {med.durationValue} {med.durationUnit}
              {med.beforeEating && " (Before eating)"}
              {med.afterEating && " (After eating)"}
              {med.instructionNotes && ` - Note: ${med.instructionNotes}`}
            </p>
          </div>
        )}

        {/* Instructions and Notes Section - Responsive Layout */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4">
          {/* Instruction Section - inline checkboxes */}
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              Instructions
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer min-w-[120px]">
                <input
                  type="checkbox"
                  checked={med.beforeEating}
                  onChange={(e) =>
                    updateMedication(med.id, "beforeEating", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-xs text-gray-600">Before eating</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer min-w-[120px]">
                <input
                  type="checkbox"
                  checked={med.afterEating}
                  onChange={(e) =>
                    updateMedication(med.id, "afterEating", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-xs text-gray-600">After eating</span>
              </label>
            </div>
          </div>

          {/* Instruction Notes Section */}
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              Notes
            </label>
            <Input
              type="text"
              placeholder="Additional notes"
              value={med.instructionNotes}
              onChange={(e) =>
                updateMedication(med.id, "instructionNotes", e.target.value)
              }
              className="w-full text-sm"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderMedicationForm = (med: any, medicationType: string) => {
    if (medicationType === "Tablet" || medicationType === "Capsule") {
      const dosageValues = med.dosage
        ? parseDosageValues(med.dosage)
        : ["", "", ""];

      return (
        <>
          <div className="space-y-2">
            <div className="flex justify-between">
              {/* Schedule*/}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Schedule
                </label>
                <div className="flex items-center gap-1.5">
                  <Input
                    value={dosageValues[0] || ""}
                    onChange={(e) => {
                      const newValues = [
                        e.target.value,
                        dosageValues[1] || "",
                        dosageValues[2] || "",
                      ];
                      updateMedication(med.id, "dosage", newValues.join(" + "));
                    }}
                    className="w-12 text-center text-sm"
                    placeholder="0"
                  />
                  <span className="text-gray-400 text-sm">+</span>
                  <Input
                    value={dosageValues[1] || ""}
                    onChange={(e) => {
                      const newValues = [
                        dosageValues[0] || "",
                        e.target.value,
                        dosageValues[2] || "",
                      ];
                      updateMedication(med.id, "dosage", newValues.join(" + "));
                    }}
                    className="w-12 text-center text-sm"
                    placeholder="0"
                  />
                  <span className="text-gray-400 text-sm">+</span>
                  <Input
                    value={dosageValues[2] || ""}
                    onChange={(e) => {
                      const newValues = [
                        dosageValues[0] || "",
                        dosageValues[1] || "",
                        e.target.value,
                      ];
                      updateMedication(med.id, "dosage", newValues.join(" + "));
                    }}
                    className="w-12 text-center text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Duration
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={med.durationValue}
                    onChange={(e) =>
                      updateMedication(med.id, "durationValue", e.target.value)
                    }
                    placeholder="0"
                    className="w-16 text-sm text-center"
                  />
                  <div className="w-32">
                    <Select
                      value={med.durationUnit}
                      onValueChange={(v) =>
                        updateMedication(med.id, "durationUnit", v)
                      }
                    >
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Instructions - inline checkboxes */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Instructions
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={med.instruction1}
                      onChange={(e) =>
                        updateMedication(
                          med.id,
                          "instruction1",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-xs text-gray-600">Before Meal</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={med.instruction2}
                      onChange={(e) =>
                        updateMedication(
                          med.id,
                          "instruction2",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-xs text-gray-600">After Meal</span>
                  </label>
                </div>
              </div>

              {/* Instruction Notes */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Notes
                </label>
                <Input
                  placeholder="Additional notes"
                  value={med.instructionNotes}
                  onChange={(e) =>
                    updateMedication(med.id, "instructionNotes", e.target.value)
                  }
                  className="w-full text-sm"
                />
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return renderStandardizedForm(med);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Medications"
      maxWidthClass="max-w-5xl"
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
            <div className="w-1/2 space-y-4">
              <div className="flex flex-wrap gap-2">
                {medicineOptions
                  .filter((opt) =>
                    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((filter) => (
                    <button
                      key={filter.name}
                      onClick={() => toggleMedication(filter.name)}
                      className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors ${
                        isMedSelected(filter.name)
                          ? "bg-green-50 border-green-600 text-green-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {isMedSelected(filter.name) && (
                        <span className="text-green-600">✓</span>
                      )}
                      {filter.name}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  ))}
              </div>

              {medicineOptions.filter((opt) =>
                opt.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No medications found matching "{searchQuery}"
                </p>
              )}
            </div>

            <div className="w-1/2 space-y-3 overflow-x-hidden">
              {medications.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  Select medications from the left to add them here
                </p>
              )}

              {medications.map((med, index) => {
                const medicationType = medicineOptions.find(
                  (m) => m.name === med.name
                )?.type;

                return (
                  <div
                    key={med.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        {index + 1}. {med.name} ({medicationType})
                      </span>
                      <button
                        onClick={() => removeMedication(med.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {renderMedicationForm(med, medicationType || "")}

                    {/* Unified summary display for all medication types */}
                    <div className="text-sm text-gray-600 pt-1">
                      {/* Tablet/Capsule: show combined dosage, duration, instructions */}
                      {(medicationType === "Tablet" ||
                        medicationType === "Capsule") &&
                        med.dosage && (
                          <div>
                            <span className="font-medium">
                              Dosage: {med.dosage}
                            </span>{" "}
                            <span>
                              for {med.durationValue} {med.durationUnit}
                            </span>
                            {med.instruction1 && <span> (Before Meal)</span>}
                            {med.instruction2 && <span> (After Meal)</span>}
                            {med.instructionNotes && (
                              <span> - Note: {med.instructionNotes}</span>
                            )}
                          </div>
                        )}
                      {/* Other types: show standardized summary */}
                      {medicationType !== "Tablet" &&
                        medicationType !== "Capsule" &&
                        (med.dosageValue ||
                          med.frequencyValue ||
                          med.durationValue) && (
                          <div>
                            <span className="font-medium">
                              {med.dosageValue} {med.dosageUnit}
                            </span>{" "}
                            <span>
                              {med.frequencyValue} {med.frequencyUnit}
                            </span>{" "}
                            <span>
                              for {med.durationValue} {med.durationUnit}
                            </span>
                            {med.beforeEating && <span> (Before eating)</span>}
                            {med.afterEating && <span> (After eating)</span>}
                            {med.instructionNotes && (
                              <span> - Note: {med.instructionNotes}</span>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "medication groups" && <div>Medicine groups</div>}
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
