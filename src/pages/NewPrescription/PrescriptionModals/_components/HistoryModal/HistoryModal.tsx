import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InvestigationItem } from "@/pages/NewPrescription/_components/modals/InvestigationModal/InvestigationModal";

function DurationInput({
  value,
  onChange,
  placeholder = "0",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Input
      type="number"
      min="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full"
    />
  );
}

const filterOptions = [
  "Fever",
  "Cough",
  "Cold",
  "Headache",
  "Body Ache",
  "Fatigue",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Abdominal Pain",
  "Chest Pain",
  "Shortness of Breath",
  "Dizziness",
  "Weakness",
  "Loss of Appetite",
  "Sore Throat",
  "Runny Nose",
  "Sneezing",
  "Itching",
];

type ComplaintItem = {
  id: string;
  label: string;
  duration: string;
  unit: string;
  notes: string;
};

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

  // Mock options - replace with real data as needed
  const drugOptions = ["Paracetamol", "Amoxicillin", "Metformin", "Aspirin"];

  // Generic handlers (similar to chief complaint/investigation)
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
          unit: "Days",
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

  /* ------------------ Local ComplaintCard & ComplaintTab (copied/adapted from ChiefComplaintModal) ------------------ */
  function ComplaintCard({
    complaint,
    index,
    onRemove,
    onUpdate,
  }: {
    complaint: ComplaintItem;
    index: number;
    onRemove: (id: string) => void;
    onUpdate: (id: string, field: keyof ComplaintItem, value: string) => void;
  }) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">
            {index + 1}. {complaint.label}
          </span>
          <button
            onClick={() => onRemove(complaint.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Duration
            </label>
            <DurationInput
              value={complaint.duration}
              onChange={(value) => onUpdate(complaint.id, "duration", value)}
              placeholder="Duration..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Unit</label>
            <Select
              value={complaint.unit}
              onValueChange={(value) => onUpdate(complaint.id, "unit", value)}
            >
              <SelectTrigger className="w-full text-left">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                {["Days", "Weeks", "Months", "Years", "Hours"].map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Notes</label>
            <Input
              placeholder="Add notes..."
              value={complaint.notes}
              onChange={(e) => onUpdate(complaint.id, "notes", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {(complaint.duration || complaint.unit || complaint.notes) && (
          <div className="text-sm text-gray-600">
            {complaint.duration && (
              <span className="font-medium">{complaint.duration} </span>
            )}
            {complaint.unit && <span>{complaint.unit} </span>}
            {complaint.notes && (
              <span className="text-gray-500">({complaint.notes})</span>
            )}
          </div>
        )}
      </div>
    );
  }

  function ComplaintTab({
    searchQuery,
    complaints,
    onToggleFilter,
    onRemoveComplaint,
    onUpdateComplaint,
  }: {
    searchQuery: string;
    complaints: ComplaintItem[];
    onToggleFilter: (filter: string) => void;
    onRemoveComplaint: (id: string) => void;
    onUpdateComplaint: (
      id: string,
      field: keyof ComplaintItem,
      value: string
    ) => void;
  }) {
    const isFilterSelected = (filter: string) =>
      complaints.some((c) => c.label === filter);

    const sortedFilterOptions = filterOptions
      .filter((option) => complaints.some((c) => c.label === option))
      .concat(
        filterOptions.filter(
          (option) => !complaints.some((c) => c.label === option)
        )
      );

    const filteredComplaintOptions = sortedFilterOptions.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 pb-6">
        <div className="w-full md:w-1/2 space-y-4">
          <div className="flex flex-wrap gap-2">
            {filteredComplaintOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => onToggleFilter(filter)}
                className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors ${isFilterSelected(filter) ? "bg-green-50 border-green-600 text-green-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                {isFilterSelected(filter) && (
                  <span className="text-green-600">✓</span>
                )}
                {filter}
                <ChevronDown className="h-4 w-4" />
              </button>
            ))}
          </div>

          {filteredComplaintOptions.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No symptoms found matching "{searchQuery}"
            </p>
          )}
        </div>

        <div className="w-full md:w-1/2 space-y-3 max-h-96 overflow-y-auto pr-2">
          {complaints.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">
              Select symptoms from the left to add here
            </p>
          )}
          {complaints.map((complaint, index) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              index={index}
              onRemove={onRemoveComplaint}
              onUpdate={onUpdateComplaint}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ------------------ Local InvestigationTabs (adapted) ------------------ */
  function InvestigationCard({
    investigation,
    index,
    onRemove,
    onUpdate,
  }: {
    investigation: InvestigationItem;
    index: number;
    onRemove: (id: string) => void;
    onUpdate: (
      id: string,
      field: keyof InvestigationItem,
      value: string
    ) => void;
  }) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">
            {index + 1}. {investigation.label}
          </span>
          <button
            onClick={() => onRemove(investigation.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Result</label>
          <Input
            placeholder="Add result..."
            value={investigation.result}
            onChange={(e) =>
              onUpdate(investigation.id, "result", e.target.value)
            }
            className="w-full"
          />
        </div>

        {investigation.result && (
          <div className="text-sm text-blue-500">
            Result: {investigation.result}
          </div>
        )}
      </div>
    );
  }

  const investigationOptions = [
    "CBC",
    "Blood Sugar",
    "X-Ray Chest",
    "ECG",
    "Urine R/M",
    "Liver Function Test",
    "Kidney Function Test",
    "Lipid Profile",
    "Thyroid Profile",
    "Ultrasound Abdomen",
  ];

  function InvestigationTabs({
    searchQuery,
    investigations,
    onToggleFilter,
    onRemoveInvestigation,
    onUpdateInvestigation,
  }: {
    searchQuery: string;
    investigations: InvestigationItem[];
    onToggleFilter: (filter: string) => void;
    onRemoveInvestigation: (id: string) => void;
    onUpdateInvestigation: (
      id: string,
      field: keyof InvestigationItem,
      value: string
    ) => void;
  }) {
    const isFilterSelected = (filter: string) =>
      investigations.some((a) => a.label === filter);

    const sortedInvestigationOptions = investigationOptions
      .filter((option) => investigations.some((a) => a.label === option))
      .concat(
        investigationOptions.filter(
          (option) => !investigations.some((a) => a.label === option)
        )
      );

    const filteredInvestigationOptions = sortedInvestigationOptions.filter(
      (option) => option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 pb-6">
        <div className="w-full md:w-1/2 space-y-4">
          <div className="flex flex-wrap gap-2">
            {filteredInvestigationOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => onToggleFilter(filter)}
                className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors ${isFilterSelected(filter) ? "bg-green-50 border-green-600 text-green-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                {isFilterSelected(filter) && (
                  <span className="text-green-600">✓</span>
                )}
                {filter}
                <ChevronDown className="h-4 w-4" />
              </button>
            ))}
          </div>

          {filteredInvestigationOptions.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No investigation found matching "{searchQuery}"
            </p>
          )}
        </div>

        <div className="w-full md:w-1/2 space-y-3 max-h-96 overflow-y-auto pr-2">
          {investigations.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">
              Select investigation from the left to add them here
            </p>
          )}
          {investigations.map((investigation, index) => (
            <InvestigationCard
              key={investigation.id}
              investigation={investigation}
              index={index}
              onRemove={onRemoveInvestigation}
              onUpdate={onUpdateInvestigation}
            />
          ))}
        </div>
      </div>
    );
  }

  // Drugs handlers
  const toggleDrug = (name: string) => {
    setDrugs((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  };

  // Investigations handlers (reuse pattern from InvestigationModal)
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

  // const prefix = { general: "G/o", drug: "D/o", investigation: "I/o", personal: "P/o", family: "F/o" } as const

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
              className={`flex-1 min-w-max sm:min-w-0 py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-sm sm:text-base ${activeTab === "general" ? "bg-green-600 text-white" : "bg-gray-100"}`}
              onClick={() => setActiveTab("general")}
            >
              General
            </Button>
            <Button
              className={`flex-1 min-w-max sm:min-w-0 py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-sm sm:text-base ${activeTab === "drug" ? "bg-green-600 text-white" : "bg-gray-100"}`}
              onClick={() => setActiveTab("drug")}
            >
              Drug
            </Button>
            <Button
              className={`flex-1 min-w-max sm:min-w-0 py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-sm sm:text-base ${activeTab === "investigation" ? "bg-green-600 text-white" : "bg-gray-100"}`}
              onClick={() => setActiveTab("investigation")}
            >
              Investigation
            </Button>
            <Button
              className={`flex-1 min-w-max sm:min-w-0 py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-sm sm:text-base ${activeTab === "personal" ? "bg-green-600 text-white" : "bg-gray-100"}`}
              onClick={() => setActiveTab("personal")}
            >
              Personal
            </Button>
            <Button
              className={`flex-1 min-w-max sm:min-w-0 py-2 sm:py-3 px-2 sm:px-4 rounded-lg text-sm sm:text-base ${activeTab === "family" ? "bg-green-600 text-white" : "bg-gray-100"}`}
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
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 pb-6">
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {drugOptions
                      .filter((d) =>
                        d.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((drug) => (
                        <button
                          key={drug}
                          onClick={() => toggleDrug(drug)}
                          className={`px-2 py-1 rounded-md border text-sm ${drugs.includes(drug) ? "bg-green-50 border-green-600 text-green-700" : "bg-white border-gray-300 text-gray-700"}`}
                        >
                          {drugs.includes(drug) ? "✓ " : ""}
                          {drug}
                        </button>
                      ))}
                  </div>

                  {drugOptions.filter((d) =>
                    d.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No drugs found
                    </p>
                  )}
                </div>

                <div className="w-full md:w-1/2 space-y-3 max-h-96 overflow-y-auto pr-2">
                  {drugs.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Select drugs from the left to add here
                    </p>
                  ) : (
                    drugs.map((d, idx) => (
                      <div
                        key={d}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
                      >
                        <div className="text-sm font-semibold">
                          {idx + 1}. {d}
                        </div>
                        <button
                          onClick={() => toggleDrug(d)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "investigation" && (
              <InvestigationTabs
                searchQuery={searchQuery}
                investigations={investigations}
                onToggleFilter={handleAddInvestigation}
                onRemoveInvestigation={handleRemoveInvestigation}
                onUpdateInvestigation={handleUpdateInvestigation}
              />
            )}
          </div>

          {/* <div className="p-3 sm:p-4 border-t bg-gray-50 max-h-48 overflow-y-auto flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-700">History Summary</h3>
            <div className="mt-2 space-y-2 text-xs sm:text-sm">
              <div>
                <div className="text-xs text-gray-500 font-medium">{prefix.general} General</div>
                <ul className="list-disc pl-5">
                  {general.length === 0 ? (
                    <li className="text-gray-500">No items</li>
                  ) : (
                    general.map((g) => (
                      <li key={g.id}>
                        {g.label}
                        {g.duration || g.unit || g.notes
                          ? ` — ${g.duration} ${g.unit}${g.notes ? ` (${g.notes})` : ""}`
                          : ""}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-medium">{prefix.personal} Personal</div>
                <ul className="list-disc pl-5">
                  {personal.length === 0 ? (
                    <li className="text-gray-500">No items</li>
                  ) : (
                    personal.map((p) => (
                      <li key={p.id}>
                        {p.label}
                        {p.duration || p.unit || p.notes
                          ? ` — ${p.duration} ${p.unit}${p.notes ? ` (${p.notes})` : ""}`
                          : ""}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-medium">{prefix.family} Family</div>
                <ul className="list-disc pl-5">
                  {family.length === 0 ? (
                    <li className="text-gray-500">No items</li>
                  ) : (
                    family.map((f) => (
                      <li key={f.id}>
                        {f.label}
                        {f.duration || f.unit || f.notes
                          ? ` — ${f.duration} ${f.unit}${f.notes ? ` (${f.notes})` : ""}`
                          : ""}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-medium">{prefix.drug} Drugs</div>
                <ul className="list-disc pl-5">
                  {drugs.length === 0 ? (
                    <li className="text-gray-500">No drugs</li>
                  ) : (
                    drugs.map((d) => <li key={d}>{d}</li>)
                  )}
                </ul>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-medium">{prefix.investigation} Investigation</div>
                <ul className="list-disc pl-5">
                  {investigations.length === 0 ? (
                    <li className="text-gray-500">No investigations</li>
                  ) : (
                    investigations.map((i) => (
                      <li key={i.id}>
                        {i.label}
                        {i.result ? ` — ${i.result}` : ""}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div> */}
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
