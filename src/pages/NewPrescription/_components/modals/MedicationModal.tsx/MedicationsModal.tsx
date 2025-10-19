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
      id: string;
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      unit: string;
      notes: string;
    }>
  >([]);

  const handleSubmit = () => {
    if (medications.length > 0) {
      const med = medications[0];
      onSubmit({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
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
          frequency: "",
          duration: "",
          unit: "",
          notes: "",
        },
      ]);
    }
  };

  const updateMedication = (id: string, field: string, value: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const renderMedicationForm = (med: any, medicationType: string) => {
    if (medicationType === "Tablet" || medicationType === "Capsule") {
      return (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Dosage
              </label>
              <div className="flex gap-x-5">
                <Input
                  value={med.dosage}
                  onChange={(e) =>
                    updateMedication(med.id, "dosage", e.target.value)
                  }
                  className="w-8"
                />
                <Input
                  value={med.dosage}
                  onChange={(e) =>
                    updateMedication(med.id, "dosage", e.target.value)
                  }
                  className="w-8"
                />
                <Input
                  value={med.dosage}
                  onChange={(e) =>
                    updateMedication(med.id, "dosage", e.target.value)
                  }
                  className="w-8"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Duration
              </label>
              <div className="flex justify-between">
                <Input
                  value={med.duration}
                  onChange={(e) =>
                    updateMedication(med.id, "duration", e.target.value)
                  }
                  className="w-16"
                />
                <Input
                  value={med.duration}
                  onChange={(e) =>
                    updateMedication(med.id, "duration", e.target.value)
                  }
                  className="w-16"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Frequency
              </label>
              <Input
                placeholder="Frequency"
                value={med.frequency}
                onChange={(e) =>
                  updateMedication(med.id, "frequency", e.target.value)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-medium text-gray-600">Notes</label>
              <Input
                placeholder="Notes"
                value={med.notes}
                onChange={(e) =>
                  updateMedication(med.id, "notes", e.target.value)
                }
              />
            </div>
          </div>
        </>
      );
    }

    if (medicationType === "Syrup") {
      return (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Volume (ml)
              </label>
              <Input
                placeholder="Volume"
                value={med.dosage}
                onChange={(e) =>
                  updateMedication(med.id, "dosage", e.target.value)
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Times per day
              </label>
              <Input
                placeholder="Times per day"
                value={med.frequency}
                onChange={(e) =>
                  updateMedication(med.id, "frequency", e.target.value)
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Days</label>
              <Input
                placeholder="Number of days"
                value={med.duration}
                onChange={(e) =>
                  updateMedication(med.id, "duration", e.target.value)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Unit</label>
              <Select
                value={med.unit}
                onValueChange={(v) => updateMedication(med.id, "unit", v)}
              >
                <SelectTrigger className="w-full text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {["ml", "tsp", "tbsp"].map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-medium text-gray-600">Notes</label>
              <Input
                placeholder="Notes"
                value={med.notes}
                onChange={(e) =>
                  updateMedication(med.id, "notes", e.target.value)
                }
              />
            </div>
          </div>
        </>
      );
    }

    if (medicationType === "Injection") {
      return (
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Dosage (units)
            </label>
            <Input
              placeholder="Units"
              value={med.dosage}
              onChange={(e) =>
                updateMedication(med.id, "dosage", e.target.value)
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Route</label>
            <Select
              value={med.frequency}
              onValueChange={(v) => updateMedication(med.id, "frequency", v)}
            >
              <SelectTrigger className="w-full text-left">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                {["IM", "IV", "SC"].map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Timing</label>
            <Input
              placeholder="When to inject"
              value={med.duration}
              onChange={(e) =>
                updateMedication(med.id, "duration", e.target.value)
              }
            />
          </div>
        </div>
      );
    }

    // Default form for other types
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            Instructions
          </label>
          <Input
            placeholder="How to use"
            value={med.dosage}
            onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Duration</label>
          <Input
            placeholder="For how long"
            value={med.duration}
            onChange={(e) =>
              updateMedication(med.id, "duration", e.target.value)
            }
          />
        </div>
      </div>
    );
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

                    {(med.dosage ||
                      med.frequency ||
                      med.duration ||
                      med.unit ||
                      med.notes) && (
                      <div className="text-sm text-gray-600">
                        {med.dosage && (
                          <span className="font-medium">{med.dosage} </span>
                        )}
                        {med.frequency && <span>{med.frequency} </span>}
                        {med.duration && <span>{med.duration} </span>}
                        {med.unit && <span>{med.unit} </span>}
                        {med.notes && (
                          <span className="text-gray-500">({med.notes})</span>
                        )}
                      </div>
                    )}
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
