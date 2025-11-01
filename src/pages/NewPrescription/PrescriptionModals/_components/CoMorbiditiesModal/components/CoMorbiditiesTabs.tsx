import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CoMorbiditiesItem } from "../CoMorbiditiesModal";

interface CoMorbiditiesCardProps {
  coMorbidities: CoMorbiditiesItem;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof CoMorbiditiesItem, value: string) => void;
}

export function CoMorbiditiesCard({
  coMorbidities,
  index,
  onRemove,
  onUpdate,
}: CoMorbiditiesCardProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">
          {index + 1}. {coMorbidities.label}
        </span>
        <button
          onClick={() => onRemove(coMorbidities.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <Input
          placeholder="Add notes..."
          value={coMorbidities.notes}
          onChange={(e) => onUpdate(coMorbidities.id, "notes", e.target.value)}
          className="w-full"
        />
      </div>

      {coMorbidities.notes && (
        <div className="text-sm text-gray-600">
          <span className="text-gray-500">({coMorbidities.notes})</span>
        </div>
      )}
    </div>
  );
}

interface CoMorbiditiesTabProps {
  searchQuery: string;
  coMorbidities: CoMorbiditiesItem[];
  onToggleFilter: (filter: string) => void;
  onRemoveCoMorbidities: (id: string) => void;
  onUpdateCoMorbidities: (
    id: string,
    field: keyof CoMorbiditiesItem,
    value: string
  ) => void;
}

// Mock co morbidities options - replace with API data if available
const coMorbiditiesOptions = [
  "Hypertension",
  "Diabetes mellitus",
  "Hyperlipidemia",
  "Chronic kidney disease",
  "Asthma",
  "COPD",
  "Heart disease",
  "Obesity",
  "Hypothyroidism",
  "Anxiety disorder",
];

export function CoMorbiditiesTabs({
  searchQuery,
  coMorbidities,
  onToggleFilter,
  onRemoveCoMorbidities,
  onUpdateCoMorbidities,
}: CoMorbiditiesTabProps) {
  const isSelected = (filter: string): boolean =>
    coMorbidities.some((cm) => cm.label === filter);

  const sorted: string[] = coMorbiditiesOptions
    .filter((o: string) => coMorbidities.some((cm) => cm.label === o))
    .concat(
      coMorbiditiesOptions.filter(
        (o: string) => !coMorbidities.some((cm) => cm.label === o)
      )
    );

  const filtered: string[] = sorted.filter((option: string) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-6 pb-6">
      <div className="w-1/2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {filtered.map((filter: string) => (
            <button
              key={filter}
              onClick={() => onToggleFilter(filter)}
              className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors ${
                isSelected(filter)
                  ? "bg-green-50 border-green-600 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isSelected(filter) && <span className="text-green-600">✓</span>}{" "}
              {filter}
              <ChevronDown className="h-4 w-4" />
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No co morbidities found matching "{searchQuery}"
          </p>
        )}
      </div>

      <div className="w-1/2 space-y-3 overflow-x-hidden">
        {coMorbidities.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Select co morbidities from the left to add them here
          </p>
        )}
        {coMorbidities.map((coMorbidity, index) => (
          <CoMorbiditiesCard
            key={coMorbidity.id}
            coMorbidities={coMorbidity}
            index={index}
            onRemove={onRemoveCoMorbidities}
            onUpdate={onUpdateCoMorbidities}
          />
        ))}
      </div>
    </div>
  );
}

