import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import { TreatmentPlanTabs } from "./components/TreatmentPlanTabs";
import { GroupTabs } from "./components/GroupTabs";

export interface TreatmentPlanItem {
  id: string;
  label: string;
  notes: string;
}

export const TreatmentPlanModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { treatmentPlan: string }) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"treatmentPlan" | "groups">(
    "treatmentPlan"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showInPrescription, setShowInPrescription] = useState(true);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlanItem[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (treatmentPlans.length > 0) {
      treatmentPlans.forEach((tp) => {
        const text = tp.notes ? `${tp.label} (${tp.notes})` : tp.label;
        onSubmit({ treatmentPlan: text });
      });
      onClose();
      return;
    }
    onClose();
  };

  const handleAddTreatmentPlan = (label: string) => {
    const exists = treatmentPlans.some((tp) => tp.label === label);
    if (!exists) {
      setTreatmentPlans([
        ...treatmentPlans,
        {
          id: String(Date.now()),
          label,
          notes: "",
        },
      ]);
    }
  };

  const handleRemoveTreatmentPlan = (id: string) => {
    setTreatmentPlans(treatmentPlans.filter((tp) => tp.id !== id));
  };

  const handleUpdateTreatmentPlan = (
    id: string,
    field: keyof TreatmentPlanItem,
    value: string
  ) => {
    setTreatmentPlans(
      treatmentPlans.map((tp) => (tp.id === id ? { ...tp, [field]: value } : tp))
    );
  };

  const handleLoadGroupToTreatmentPlans = (items: string[]) => {
    setActiveTab("treatmentPlan");
    const newTreatmentPlans: TreatmentPlanItem[] = items.map((item) => ({
      id: `${Date.now()}-${item}`,
      label: item,
      notes: "",
    }));
    setTreatmentPlans(newTreatmentPlans);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-6xl"
      title="Add Treatment Plan"
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search treatment plan...",
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
              activeTab === "treatmentPlan"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("treatmentPlan")}
          >
            Treatment Plan
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
          {activeTab === "treatmentPlan" && (
            <TreatmentPlanTabs
              searchQuery={searchQuery}
              treatmentPlans={treatmentPlans}
              onToggleFilter={(label: string) => handleAddTreatmentPlan(label)}
              onRemoveTreatmentPlan={handleRemoveTreatmentPlan}
              onUpdateTreatmentPlan={handleUpdateTreatmentPlan}
            />
          )}

          {activeTab === "groups" && (
            <GroupTabs
              searchQuery={searchQuery}
              onLoadGroup={handleLoadGroupToTreatmentPlans}
            />
          )}
        </div>

        {activeTab === "treatmentPlan" && (
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

