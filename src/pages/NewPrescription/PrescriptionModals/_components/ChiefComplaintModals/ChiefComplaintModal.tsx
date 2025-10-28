import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { GroupsTab } from "./_components/GroupTabs";
import { ComplaintTab } from "./_components/ComplaintTabs";

interface ComplaintItem {
  id: string;
  label: string;
  duration: string;
  unit: string;
  notes: string;
}

export const ChiefComplaintModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { complaints: ComplaintItem[] }) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"complaint" | "groups">(
    "complaint"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showInPrescription, setShowInPrescription] = useState(true);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ complaints });
    onClose();
  };

  const handleAddComplaint = (label: string) => {
    const exists = complaints.some((c) => c.label === label);
    if (!exists) {
      setComplaints([
        ...complaints,
        {
          id: String(Date.now()),
          label,
          duration: "",
          unit: "",
          notes: "",
        },
      ]);
    }
  };

  const handleRemoveComplaint = (id: string) => {
    setComplaints(complaints.filter((c) => c.id !== id));
  };

  const handleUpdateComplaint = (
    id: string,
    field: keyof ComplaintItem,
    value: string
  ) => {
    setComplaints(
      complaints.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const toggleFilter = (filter: string) => {
    const existingComplaint = complaints.find((c) => c.label === filter);
    if (existingComplaint) {
      setComplaints(complaints.filter((c) => c.label !== filter));
    } else {
      handleAddComplaint(filter);
    }
  };

  const handleLoadGroupToComplaints = (symptoms: string[]) => {
    setActiveTab("complaint");
    const newComplaints: ComplaintItem[] = symptoms.map((symptom) => ({
      id: `${Date.now()}-${symptom}`,
      label: symptom,
      duration: "",
      unit: "Days",
      notes: "",
    }));
    setComplaints(newComplaints);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-6xl"
      title="Add Chief Complaint (C/C)"
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search...",
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
            onClick={() => setActiveTab("complaint")}
            className={`flex-1 py-3 px-6 cursor-pointer rounded-lg font-medium transition-colors ${activeTab === "complaint"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Chief Complaint
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 py-3 px-6 cursor-pointer rounded-lg font-medium transition-colors ${activeTab === "groups"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Chief Complaint Groups
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-2">
        {activeTab === "complaint" && (
          <ComplaintTab
            searchQuery={searchQuery}
            complaints={complaints}
            onToggleFilter={toggleFilter}
            onRemoveComplaint={handleRemoveComplaint}
            onUpdateComplaint={handleUpdateComplaint}
          />
        )}

        {activeTab === "groups" && (
          <GroupsTab
            searchQuery={searchQuery}
            onLoadGroup={handleLoadGroupToComplaints}
          />
        )}
      </div>

      {activeTab === "complaint" && (
        <Modal.Footer>
          <Button
            onClick={handleSubmit}
            className="bg-green-700 hover:bg-green-800 text-white px-8"
          >
            Save
          </Button>
          <Button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            Close
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};
