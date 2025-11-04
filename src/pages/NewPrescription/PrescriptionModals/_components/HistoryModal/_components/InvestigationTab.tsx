import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentToken } from "@/redux/api/features/authSlice";
import { jwtDecode } from "jwt-decode";
import { useGetInvestigationInputsQuery } from "@/redux/api/investigationInput/investigationInput";
import type { InvestigationInput } from "@/types/investigation.types";

export type InvestigationItem = {
  id: string;
  label: string;
  notes: string;
};

function InvestigationCard({
  investigation,
  index,
  onRemove,
  onUpdate,
}: {
  investigation: InvestigationItem;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof InvestigationItem, value: string) => void;
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
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <Input
          placeholder="Add result..."
          value={investigation.notes}
          onChange={(e) => onUpdate(investigation.id, "notes", e.target.value)}
          className="w-full"
        />
      </div>

      {investigation.notes && (
        <div className="text-sm text-gray-600">
          {investigation.notes}
        </div>
      )}
    </div>
  );
}


export function InvestigationTab({
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
  const token = useAppSelector(useCurrentToken);
  const decoded: { id: string } = jwtDecode(token || "");
  const doctorId = decoded?.id;

  // Fetch investigation inputs from API
  const { data, isLoading } = useGetInvestigationInputsQuery([
    { key: "doctorId", value: doctorId },
  ]);

  // Extract investigation inputs from the nested data structure
  const investigationInputs = data?.data?.data || [];

  const isFilterSelected = (filter: string) =>
    investigations.some((a) => a.label === filter);

  // Use the API data instead of static investigationOptions
  const sortedInvestigationOptions = investigationInputs
    .map((input: InvestigationInput) => input.value.trim())
    .filter((value: string) => investigations.some((a) => a.label === value))
    .concat(
      investigationInputs
        .map((input: InvestigationInput) => input.value.trim())
        .filter(
          (value: string) => !investigations.some((a) => a.label === value)
        )
    );

  const filteredInvestigationOptions = sortedInvestigationOptions.filter(
    (option: string) => option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Loading investigation options...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 pb-6">
      <div className="w-full md:w-1/2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {filteredInvestigationOptions.map((filter: string, idx: number) => (
            <button
              key={`${filter}-${idx}`}
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
            {searchQuery
              ? `No investigation found matching "${searchQuery}"`
              : "No investigation options available"}
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
