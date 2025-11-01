import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { TreatmentPlanItem } from "../TreatmentPlanModal";

interface TreatmentPlanCardProps {
  treatmentPlan: TreatmentPlanItem;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof TreatmentPlanItem, value: string) => void;
}

export function TreatmentPlanCard({
  treatmentPlan,
  index,
  onRemove,
  onUpdate,
}: TreatmentPlanCardProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">
          {index + 1}. {treatmentPlan.label}
        </span>
        <button
          onClick={() => onRemove(treatmentPlan.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <Input
          placeholder="Add notes..."
          value={treatmentPlan.notes}
          onChange={(e) => onUpdate(treatmentPlan.id, "notes", e.target.value)}
          className="w-full"
        />
      </div>

      {treatmentPlan.notes && (
        <div className="text-sm text-gray-600">
          <span className="text-gray-500">({treatmentPlan.notes})</span>
        </div>
      )}
    </div>
  );
}

interface TreatmentPlanTabProps {
  searchQuery: string;
  treatmentPlans: TreatmentPlanItem[];
  onToggleFilter: (filter: string) => void;
  onRemoveTreatmentPlan: (id: string) => void;
  onUpdateTreatmentPlan: (
    id: string,
    field: keyof TreatmentPlanItem,
    value: string
  ) => void;
}

// Mock treatment plan options - replace with API data if available
const treatmentPlanOptions = [
  "Conservative management",
  "Symptomatic treatment",
  "Physiotherapy",
  "Lifestyle modifications",
  "Dietary changes",
  "Regular follow-up",
  "Surgical intervention",
  "Medication therapy",
  "Physical therapy",
  "Rest and observation",
];

export function TreatmentPlanTabs({
  searchQuery,
  treatmentPlans,
  onToggleFilter,
  onRemoveTreatmentPlan,
  onUpdateTreatmentPlan,
}: TreatmentPlanTabProps) {
  const isSelected = (filter: string): boolean =>
    treatmentPlans.some((tp) => tp.label === filter);

  const sorted: string[] = treatmentPlanOptions
    .filter((o: string) => treatmentPlans.some((tp) => tp.label === o))
    .concat(
      treatmentPlanOptions.filter(
        (o: string) => !treatmentPlans.some((tp) => tp.label === o)
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
            No treatment plan found matching "{searchQuery}"
          </p>
        )}
      </div>

      <div className="w-1/2 space-y-3 overflow-x-hidden">
        {treatmentPlans.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Select treatment plan from the left to add them here
          </p>
        )}
        {treatmentPlans.map((treatmentPlan, index) => (
          <TreatmentPlanCard
            key={treatmentPlan.id}
            treatmentPlan={treatmentPlan}
            index={index}
            onRemove={onRemoveTreatmentPlan}
            onUpdate={onUpdateTreatmentPlan}
          />
        ))}
      </div>
    </div>
  );
}

