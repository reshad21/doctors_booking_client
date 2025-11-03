import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { CoMorbiditiesTabs } from "./components/CoMorbiditiesTabs";
import { GroupTabs } from "./components/GroupTabs";

export interface CoMorbiditiesItem {
  id: string;
  label: string;
  notes: string;
}

export const CoMorbiditiesModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CoMorbiditiesItem) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"coMorbidities" | "groups">(
    "coMorbidities"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showInPrescription, setShowInPrescription] = useState(true);
  const [coMorbidities, setCoMorbidities] = useState<CoMorbiditiesItem[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (coMorbidities.length > 0) {
      coMorbidities.forEach((cm) => {
        onSubmit(cm);
      });
      onClose();
      return;
    }
    onClose();
  };

  const handleAddCoMorbidities = (label: string) => {
    const exists = coMorbidities.some((cm) => cm.label === label);
    if (!exists) {
      setCoMorbidities([
        ...coMorbidities,
        {
          id: String(Date.now()),
          label,
          notes: "",
        },
      ]);
    }
  };

  const handleRemoveCoMorbidities = (id: string) => {
    setCoMorbidities(coMorbidities.filter((cm) => cm.id !== id));
  };

  const handleUpdateCoMorbidities = (
    id: string,
    field: keyof CoMorbiditiesItem,
    value: string
  ) => {
    setCoMorbidities(
      coMorbidities.map((cm) => (cm.id === id ? { ...cm, [field]: value } : cm))
    );
  };

  const handleLoadGroupToCoMorbidities = (items: string[]) => {
    setActiveTab("coMorbidities");
    const newCoMorbidities: CoMorbiditiesItem[] = items.map((item) => ({
      id: `${Date.now()}-${item}`,
      label: item,
      notes: "",
    }));
    setCoMorbidities(newCoMorbidities);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-6xl"
      title="Add Co Morbidities"
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search co morbidities...",
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
              activeTab === "coMorbidities"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("coMorbidities")}
          >
            Co Morbidities
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
          {activeTab === "coMorbidities" && (
            <CoMorbiditiesTabs
              searchQuery={searchQuery}
              coMorbidities={coMorbidities}
              onToggleFilter={(label: string) => handleAddCoMorbidities(label)}
              onRemoveCoMorbidities={handleRemoveCoMorbidities}
              onUpdateCoMorbidities={handleUpdateCoMorbidities}
            />
          )}

          {activeTab === "groups" && (
            <GroupTabs
              searchQuery={searchQuery}
              onLoadGroup={handleLoadGroupToCoMorbidities}
            />
          )}
        </div>

        {activeTab === "coMorbidities" && (
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
