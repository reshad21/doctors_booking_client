import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InvestigationTab,
  type InvestigationItem,
} from "./_components/InvestigationTab";
import type { ComplaintItem } from "@/types/complaint.types";
import { ComplaintTab } from "./_components/ComplaintTab";
import { DrugTab } from "./_components/DrugTab";


export const HistoryModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    general: ComplaintItem[];
    drugs: string[];
    investigations: InvestigationItem[];
    personal: ComplaintItem[];
    family: ComplaintItem[];
  }) => void;
}) => {
  const [activeTab, setActiveTab] = useState<
    "general" | "drug" | "investigation" | "personal" | "family"
  >("general");

  const [searchQuery, setSearchQuery] = useState("");
  const [showInPrescription, setShowInPrescription] = useState(true);

  // Data stores for each tab
  const [general, setGeneral] = useState<ComplaintItem[]>([]);
  const [personal, setPersonal] = useState<ComplaintItem[]>([]);
  const [family, setFamily] = useState<ComplaintItem[]>([]);
  const [drugs, setDrugs] = useState<string[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);

  if (!isOpen) return null;

  // Generic handlers for complaints
  const handleAddComplaintTo = (
    listSetter: React.Dispatch<React.SetStateAction<ComplaintItem[]>>,
    label: string
  ) => {
    listSetter((prev) => {
      const exists = prev.some((p) => p.label === label);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: String(Date.now()) + "-" + label,
          label,
          duration: "",
          unit: "",
          notes: "",
        },
      ];
    });
  };

  const handleRemoveComplaintFrom = (
    listSetter: React.Dispatch<React.SetStateAction<ComplaintItem[]>>,
    id: string
  ) => {
    listSetter((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateComplaintFrom = (
    listSetter: React.Dispatch<React.SetStateAction<ComplaintItem[]>>,
    id: string,
    field: keyof ComplaintItem,
    value: string
  ) => {
    listSetter((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Drugs handlers
  const toggleDrug = (name: string) => {
    setDrugs((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  };

  // Investigations handlers
  const handleAddInvestigation = (label: string) => {
    const exists = investigations.some((a) => a.label === label);
    if (!exists) {
      setInvestigations((s) => [
        ...s,
        { id: String(Date.now()), label, notes: "", result: "" },
      ]);
    }
  };

  const handleRemoveInvestigation = (id: string) => {
    setInvestigations((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateInvestigation = (
    id: string,
    field: keyof InvestigationItem,
    value: string
  ) => {
    setInvestigations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleSubmit = () => {
    onSubmit({ general, drugs, investigations, personal, family });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0">
          <DialogTitle>Add History</DialogTitle>
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <label className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer">
              <input
                type="checkbox"
                checked={showInPrescription}
                onChange={(e) => setShowInPrescription(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">In Prescription</span>
            </label>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full flex-1 overflow-hidden">
          <div className="flex flex-wrap gap-2 sm:gap-3 p-3 sm:p-4 pb-0 flex-shrink-0">
            <Button
              className={`flex-1 min-w-max sm:min-w-0 py-2 sm:py-3 px-2 hover:text-white sm:px-4 rounded-lg text-sm sm:text-base ${activeTab === "general" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800 border border-accent"}`}
              onClick={() => setActiveTab("general")}
            >
              General
            </Button>
            <Button
              className={`flex-1 min-w-max sm:min-w-0 py-2 sm:py-3 px-2 hover:text-white sm:px-4 rounded-lg text-sm sm:text-base ${activeTab === "drug" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800 border border-accent"}`}
              onClick={() => setActiveTab("drug")}
            >
              Drug
            </Button>
            <Button
              className={`flex-1 min-w-max sm:min-w-0 py-2 sm:py-3 px-2 sm:px-4 hover:text-white rounded-lg text-sm sm:text-base ${activeTab === "investigation" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800 border border-accent"}`}
              onClick={() => setActiveTab("investigation")}
            >
              Investigation
            </Button>
            <Button
              className={`flex-1 min-w-max sm:min-w-0 py-2 sm:py-3 px-2 hover:text-white sm:px-4 rounded-lg text-sm sm:text-base ${activeTab === "personal" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800 border border-accent"}`}
              onClick={() => setActiveTab("personal")}
            >
              Personal
            </Button>
            <Button
              className={`flex-1 min-w-max sm:min-w-0 py-2 sm:py-3 px-2 sm:px-4 hover:text-white rounded-lg text-sm sm:text-base ${activeTab === "family" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800 border border-accent"}`}
              onClick={() => setActiveTab("family")}
            >
              Family
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-2">
            {activeTab === "general" && (
              <ComplaintTab
                searchQuery={searchQuery}
                complaints={general}
                onToggleFilter={(label: string) =>
                  handleAddComplaintTo(setGeneral, label)
                }
                onRemoveComplaint={(id: string) =>
                  handleRemoveComplaintFrom(setGeneral, id)
                }
                onUpdateComplaint={(id, field, value) =>
                  handleUpdateComplaintFrom(setGeneral, id, field, value)
                }
              />
            )}

            {activeTab === "personal" && (
              <ComplaintTab
                searchQuery={searchQuery}
                complaints={personal}
                onToggleFilter={(label: string) =>
                  handleAddComplaintTo(setPersonal, label)
                }
                onRemoveComplaint={(id: string) =>
                  handleRemoveComplaintFrom(setPersonal, id)
                }
                onUpdateComplaint={(id, field, value) =>
                  handleUpdateComplaintFrom(setPersonal, id, field, value)
                }
              />
            )}

            {activeTab === "family" && (
              <ComplaintTab
                searchQuery={searchQuery}
                complaints={family}
                onToggleFilter={(label: string) =>
                  handleAddComplaintTo(setFamily, label)
                }
                onRemoveComplaint={(id: string) =>
                  handleRemoveComplaintFrom(setFamily, id)
                }
                onUpdateComplaint={(id, field, value) =>
                  handleUpdateComplaintFrom(setFamily, id, field, value)
                }
              />
            )}

            {activeTab === "drug" && (
              <DrugTab
                searchQuery={searchQuery}
                drugs={drugs}
                onToggleDrug={toggleDrug}
              />
            )}

            {activeTab === "investigation" && (
              <InvestigationTab
                searchQuery={searchQuery}
                investigations={investigations}
                onToggleFilter={handleAddInvestigation}
                onRemoveInvestigation={handleRemoveInvestigation}
                onUpdateInvestigation={handleUpdateInvestigation}
              />
            )}
          </div>
        </div>

        <DialogFooter className="px-4 sm:px-6 py-4 border-t">
          <Button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-sm sm:text-base"
          >
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-sm sm:text-base"
          >
            Add to History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
