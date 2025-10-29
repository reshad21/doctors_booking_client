import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/redux/hooks";
import { jwtDecode } from "jwt-decode";
import { useCurrentToken } from "@/redux/api/features/authSlice";
import { useGetAdviceInputsQuery } from "@/redux/api/adviceInput/adviceInput";
import type { AdviceInput } from "@/types/advice.types";

interface AdviceItem {
  id: string;
  label: string;
  notes: string;
}

interface AdviceCardProps {
  advice: AdviceItem;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof AdviceItem, value: string) => void;
}

export function AdviceCard({
  advice,
  index,
  onRemove,
  onUpdate,
}: AdviceCardProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">
          {index + 1}. {advice.label}
        </span>
        <button
          onClick={() => onRemove(advice.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <Input
          placeholder="Add notes..."
          value={advice.notes}
          onChange={(e) => onUpdate(advice.id, "notes", e.target.value)}
          className="w-full"
        />
      </div>

      {advice.notes && (
        <div className="text-sm text-gray-600">
          <span className="text-gray-500">({advice.notes})</span>
        </div>
      )}
    </div>
  );
}

interface AdviceTabProps {
  searchQuery: string;
  advices: AdviceItem[];
  onToggleFilter: (filter: string) => void;
  onRemoveAdvice: (id: string) => void;
  onUpdateAdvice: (id: string, field: keyof AdviceItem, value: string) => void;
}

export function AdviceTabs({
  searchQuery,
  advices,
  onToggleFilter,
  onRemoveAdvice,
  onUpdateAdvice,
}: AdviceTabProps) {
  const token = useAppSelector(useCurrentToken);
  const decoded: { id: string } = jwtDecode(token || "");
  const doctorId = decoded?.id;

  const { data, isLoading } = useGetAdviceInputsQuery([
    { key: "doctorId", value: doctorId },
  ]);

  const adviceInputs = data?.data?.data || [];

  const isFilterSelected = (filter: string) => {
    return advices.some((a) => a.label === filter);
  };

  const sortedAdviceOptions = adviceInputs
    .map((input: AdviceInput) => input.value.trim())
    .filter((value: string) => advices.some((a) => a.label === value))
    .concat(
      adviceInputs
        .map((input: AdviceInput) => input.value.trim())
        .filter((value: string) => !advices.some((a) => a.label === value))
    );

  const filteredAdviceOptions = sortedAdviceOptions.filter((option: string) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Loading advice options...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 pb-6">
      {/* Left Side - Filter Tags */}
      <div className="w-1/2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {filteredAdviceOptions.map((filter: string, idx: number) => (
            <button
              key={`${filter}-${idx}`}
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

        {filteredAdviceOptions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            {searchQuery
              ? `No advice found matching "${searchQuery}"`
              : "No advice options available"}
          </p>
        )}
      </div>

      {/* Right Side - Advices List */}
      <div className="w-1/2 space-y-3 overflow-x-hidden">
        {advices.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Select advice from the left to add them here
          </p>
        )}
        {advices.map((advice, index) => (
          <AdviceCard
            key={advice.id}
            advice={advice}
            index={index}
            onRemove={onRemoveAdvice}
            onUpdate={onUpdateAdvice}
          />
        ))}
      </div>
    </div>
  );
}
