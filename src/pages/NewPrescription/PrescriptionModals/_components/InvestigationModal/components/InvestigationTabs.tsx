import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetInvestigationInputsQuery } from "@/redux/api/investigationInput/investigationInput";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentToken } from "@/redux/api/features/authSlice";
import { jwtDecode } from "jwt-decode";
import type { InvestigationInput } from "@/types/investigation.types";

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
  onUpdateInvestigation: (
    id: string,
    field: keyof InvestigationItem,
    value: string
  ) => void;
}

export function InvestigationTabs({
  searchQuery,
  investigations,
  onToggleFilter,
  onRemoveInvestigation,
  onUpdateInvestigation,
}: InvestigationTabProps) {
  const token = useAppSelector(useCurrentToken);
  const decoded: { id: string } = jwtDecode(token || "");
  const doctorId = decoded?.id;

  // Fetch investigation inputs from API
  const { data, isLoading } = useGetInvestigationInputsQuery([
    { key: "doctorId", value: doctorId },
  ]);

  // Use API data directly
  const investigationOptions: InvestigationItem[] =
    data?.data?.data?.map((item: InvestigationInput) => ({
      id: item.id,
      label: item.value,
      notes: "",
      result: "",
    })) || [];

  const isFilterSelected = (filter: string) => {
    return investigations.some((a) => a.label === filter);
  };
  // Sort selected options first
  const sortedInvestigationOptions = investigationOptions
    .filter((option) => investigations.some((a) => a.label === option.label))
    .concat(
      investigationOptions.filter(
        (option) => !investigations.some((a) => a.label === option.label)
      )
    );

  // Filter by search query
  const filteredInvestigationOptions = sortedInvestigationOptions.filter(
    (option) => option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <p className="text-center py-4 text-gray-500">
        Loading investigations...
      </p>
    );
  }

  return (
    <div className="flex gap-6 pb-6 h-full">
      <div className="w-1/2 space-y-4 overflow-y-auto pr-2 max-h-full">
        <div className="flex flex-wrap gap-2">
          {filteredInvestigationOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onToggleFilter(option.label)}
              className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors ${
                isFilterSelected(option.label)
                  ? "bg-green-50 border-green-600 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isFilterSelected(option.label) && (
                <span className="text-green-600">✓</span>
              )}
              {option.label}
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

      <div className="w-1/2 space-y-3 overflow-y-auto pr-2 max-h-full">
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
