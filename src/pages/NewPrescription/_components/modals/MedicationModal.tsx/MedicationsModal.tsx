import type { Tag } from "@/types/new-prescription.types";
import { useState } from "react";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: "", dosage: "", frequency: "", duration: "" });
      onClose();
    }
  };

  const handleTagSelect = (tag: Tag) => {
    handleChange("name", tag.label);
  };

  const medicineOptions = [
    "Fexo",
    "Paracetamol",
    "Ibuprofen",
    "Amoxicillin",
    "Cetirizine",
    "Azithromycin",
    "Loratadine",
    "Metformin",
    "Amlodipine",
  ];
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
        {/* Tabs */}
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
            {/* Left Side - Filter Tags */}
            <div className="w-1/2 space-y-4">
              <div className="flex flex-wrap gap-2">
                {medicineOptions.map((filter) => (
                  <button
                    key={filter}
                    // onClick={() => onToggleFilter(filter)}
                    className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors`}
                    // className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded-md border transition-colors ${
                    //   isFilterSelected(filter)
                    //     ? "bg-green-50 border-green-600 text-green-700"
                    //     : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    // }`}
                  >
                    {/* {isFilterSelected(filter) && (
                      <span className="text-green-600">✓</span>
                    )} */}
                    {filter}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Medicine Schedule */}
            <div className="w-1/2 space-y-3 overflow-x-hidden">right side</div>
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
