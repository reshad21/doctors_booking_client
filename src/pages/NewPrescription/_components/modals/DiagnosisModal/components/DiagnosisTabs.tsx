import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DiagnosisItem {
  id: string;
  label: string;
  notes: string;
}

interface DiagnosisCardProps {
  diagnosis: DiagnosisItem;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof DiagnosisItem, value: string) => void;
}

export function DiagnosisCard({ diagnosis, index, onRemove, onUpdate }: DiagnosisCardProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">
          {index + 1}. {diagnosis.label}
        </span>
        <button
          onClick={() => onRemove(diagnosis.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <Input
          placeholder="Add notes..."
          value={diagnosis.notes}
          onChange={(e) => onUpdate(diagnosis.id, "notes", e.target.value)}
          className="w-full"
        />
      </div>

      {diagnosis.notes && (
        <div className="text-sm text-gray-600">
          <span className="text-gray-500">({diagnosis.notes})</span>
        </div>
      )}
    </div>
  );
}

interface DiagnosisTabProps {
  searchQuery: string;
  diagnoses: DiagnosisItem[];
  onToggleFilter: (filter: string) => void;
  onRemoveDiagnosis: (id: string) => void;
  onUpdateDiagnosis: (id: string, field: keyof DiagnosisItem, value: string) => void;
}

const diagnosisOptions = [
  "Acute bronchitis",
  "Migraine",
  "Hypertension",
  "Diabetes mellitus",
  "Upper respiratory infection",
  "Gastritis",
  "Urinary tract infection",
  "Allergic rhinitis",
  "Anemia",
  "Osteoarthritis",
];

export function DiagnosisTabs({
  searchQuery,
  diagnoses,
  onToggleFilter,
  onRemoveDiagnosis,
  onUpdateDiagnosis,
}: DiagnosisTabProps) {
  const isSelected = (filter: string) => diagnoses.some((d) => d.label === filter);

  const sorted = diagnosisOptions
    .filter((o) => diagnoses.some((d) => d.label === o))
    .concat(diagnosisOptions.filter((o) => !diagnoses.some((d) => d.label === o)));

  const filtered = sorted.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex gap-6 pb-6">
      <div className="w-1/2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {filtered.map((filter) => (
            <button
              key={filter}
              onClick={() => onToggleFilter(filter)}
              className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors ${
                isSelected(filter)
                  ? "bg-green-50 border-green-600 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isSelected(filter) && <span className="text-green-600">✓</span>} b
              {filter}
              <ChevronDown className="h-4 w-4" />
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No diagnosis found matching "{searchQuery}"</p>
        )}
      </div>

      <div className="w-1/2 space-y-3 overflow-x-hidden">
        {diagnoses.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">Select diagnosis from the left to add them here</p>
        )}
        {diagnoses.map((diagnosis, index) => (
          <DiagnosisCard
            key={diagnosis.id}
            diagnosis={diagnosis}
            index={index}
            onRemove={onRemoveDiagnosis}
            onUpdate={onUpdateDiagnosis}
          />
        ))}
      </div>
    </div>
  );
}
