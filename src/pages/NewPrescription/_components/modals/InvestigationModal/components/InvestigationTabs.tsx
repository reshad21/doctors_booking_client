import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface InvestigationItem {
  id: string;
  label: string;
  notes: string;
  result: string;
}

interface InvestigationCardProps {
  investigation: InvestigationItem;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof InvestigationItem, value: string) => void;
}

export function InvestigationCard({
  investigation,
  index,
  onRemove,
  onUpdate,
}: InvestigationCardProps) {
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
          onChange={(e) => onUpdate(investigation.id, "result", e.target.value)}
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

interface InvestigationTabProps {
  searchQuery: string;
  investigations: InvestigationItem[];
  onToggleFilter: (filter: string) => void;
  onRemoveInvestigation: (id: string) => void;
  onUpdateInvestigation: (id: string, field: keyof InvestigationItem, value: string) => void;
}

// Mock investigation list - replace with your actual investigation data
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
  "Ultrasound Abdomen"
];

export function InvestigationTabs({
  searchQuery,
  investigations,
  onToggleFilter,
  onRemoveInvestigation,
  onUpdateInvestigation,
}: InvestigationTabProps) {
  const isFilterSelected = (filter: string) => {
    return investigations.some((a) => a.label === filter);
  };

  const sortedInvestigationOptions = investigationOptions
    .filter((option) => investigations.some((a) => a.label === option))
    .concat(
      investigationOptions.filter((option) => !investigations.some((a) => a.label === option))
    );

  const filteredInvestigationOptions = sortedInvestigationOptions.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-6 pb-6">
      {/* Left Side - Filter Tags */}
      <div className="w-1/2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {filteredInvestigationOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => onToggleFilter(filter)}
              className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors ${
                isFilterSelected(filter)
                  ? "bg-green-50 border-green-600 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
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

      {/* Right Side - Investigations List */}
      <div className="w-1/2 space-y-3 overflow-x-hidden">
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
