import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { InvestigationGroupTabs } from "./components/InvestigationGroupTabs";
import { InvestigationTabs } from "./components/InvestigationTabs";

export interface InvestigationItem {
  id: string;
  label: string;
  notes: string;
  result: string;
}

export const InvestigationModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { investigations: InvestigationItem[] }) => void;
  tags?: Array<{ id: string; label: string; category?: string }>;
}) => {
  const [activeTab, setActiveTab] = useState<"investigation" | "groups">(
    "investigation"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showInPrescription, setShowInPrescription] = useState(true);
  const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ investigations });
    onClose();
  };

  const handleAddInvestigation = (label: string) => {
    const exists = investigations.some((a) => a.label === label);
    if (!exists) {
      setInvestigations([
        ...investigations,
        {
          id: String(Date.now()),
          label,
          notes: "",
          result: "",
        },
      ]);
    }
  };

  const handleRemoveInvestigation = (id: string) => {
    setInvestigations(investigations.filter((a) => a.id !== id));
  };

  const handleUpdateInvestigation = (
    id: string,
    field: keyof InvestigationItem,
    value: string
  ) => {
    setInvestigations(
      investigations.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleLoadGroupToInvestigations = (items: string[]) => {
    setActiveTab("investigation");
    const newInvestigations: InvestigationItem[] = items.map((item) => ({
      id: `${Date.now()}-${item}`,
      label: item,
      notes: "",
      result: "",
    }));
    setInvestigations(newInvestigations);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-6xl"
      title="Add Investigation"
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search investigation...",
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
              activeTab === "investigation"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("investigation")}
          >
            Investigation
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
          {activeTab === "investigation" && (
            <InvestigationTabs
              searchQuery={searchQuery}
              investigations={investigations}
              onToggleFilter={handleAddInvestigation}
              onRemoveInvestigation={handleRemoveInvestigation}
              onUpdateInvestigation={handleUpdateInvestigation}
            />
          )}

          {activeTab === "groups" && (
            <InvestigationGroupTabs
              searchQuery={searchQuery}
              onLoadGroup={handleLoadGroupToInvestigations}
            />
          )}
        </div>

        {activeTab === "investigation" && (
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
