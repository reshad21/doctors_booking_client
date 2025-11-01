import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, X } from "lucide-react";

interface ObservationItem {
  id: string;
  label: string;
  notes: string;
}

interface ObservationCardProps {
  observation: ObservationItem;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof ObservationItem, value: string) => void;
}

interface ObservationTabProps {
  searchQuery: string;
  observations: ObservationItem[];
  onToggleFilter: (label: string) => void;
  onRemoveObservation: (id: string) => void;
  onUpdateObservation: (id: string, field: keyof ObservationItem, value: string) => void;
}

function ObservationCard({
  observation,
  index,
  onRemove,
  onUpdate,
}: ObservationCardProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">
          {index + 1}. {observation.label}
        </span>
        <button
          onClick={() => onRemove(observation.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <Textarea
          value={observation.notes}
          onChange={(e) => onUpdate(observation.id, "notes", e.target.value)}
          placeholder="Add observation details..."
          className="min-h-[60px] resize-none"
        />
      </div>

      {observation.notes && (
        <div className="text-sm text-gray-500">({observation.notes})</div>
      )}
    </div>
  );
}

// Mock data for demonstration - replace with actual data from API or constants
const observationOptions = [
  "General Appearance",
  "Skin",
  "Head and Neck",
  "Chest",
  "Abdomen",
  "Extremities",
  "Mental Status",
  "Cardiovascular",
  "Respiratory",
  "Neurological",
];

export const ObservationTab = ({
  searchQuery,
  observations,
  onToggleFilter,
  onRemoveObservation,
  onUpdateObservation,
}: ObservationTabProps) => {
  const isFilterSelected = (filter: string) => {
    return observations.some((o) => o.label === filter);
  };

  const sortedObservationOptions = observationOptions
    .filter((option) => observations.some((o) => o.label === option))
    .concat(
      observationOptions.filter(
        (option) => !observations.some((o) => o.label === option)
      )
    );

  const filteredObservationOptions = sortedObservationOptions.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-6 pb-6">
      {/* Left Side - Filter Tags */}
      <div className="w-1/2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {filteredObservationOptions.map((filter) => (
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

        {filteredObservationOptions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No observations found matching "{searchQuery}"
          </p>
        )}
      </div>

      {/* Right Side - Observations List */}
      <div className="w-1/2 space-y-3 overflow-x-hidden">
        {observations.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Select observations from the left to add them here
          </p>
        )}
        {observations.map((observation, index) => (
          <ObservationCard
            key={observation.id}
            observation={observation}
            index={index}
            onRemove={onRemoveObservation}
            onUpdate={onUpdateObservation}
          />
        ))}
      </div>
    </div>
  );
};