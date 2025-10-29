import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { jwtDecode } from "jwt-decode";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentToken } from "@/redux/api/features/authSlice";
import { useGetHistoryInputsQuery } from "@/redux/api/historyInput/historyInput";
import type { HistoryInputItem } from "@/types/history.types";
import type { ComplaintItem } from "@/types/complaint.types";
import DurationInput from "../../../../../../components/shared/DurationInput";

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
        {/* Duration Field */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Duration</label>
          <DurationInput
            value={complaint.duration}
            onChange={(value) => onUpdate(complaint.id, "duration", value)}
            placeholder="Duration..."
            options={[1, 2, 3, 4, 5, 6, 7, 10, 14, 30]} // ✅ custom duration options
          />
        </div>

        {/* Unit Field */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Unit</label>
          <Select
            value={complaint.unit}
            onValueChange={(value) => onUpdate(complaint.id, "unit", value)}
          >
            <SelectTrigger className="w-full text-left">
              <SelectValue placeholder="Select unit" />
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

        {/* Notes Field */}
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

export default ComplaintCard;
export function ComplaintTab({
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
  const token = useAppSelector(useCurrentToken);
  const decoded: { id: string } = jwtDecode(token || "");
  const doctorId = decoded?.id;

  const { data: generalOptions, isLoading } = useGetHistoryInputsQuery([
    { key: "doctorId", value: doctorId },
  ]);

  const filterOptions: string[] =
    generalOptions?.data?.data?.map((item: HistoryInputItem) => item.value) ??
    [];

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

  if (isLoading) {
    return <p className="text-gray-500 text-center">Loading symptoms...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 pb-6">
      {/* Left side: filter options */}
      <div className="w-full md:w-1/2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {filteredComplaintOptions.map((filter) => (
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

        {filteredComplaintOptions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No symptoms found matching "{searchQuery}"
          </p>
        )}
      </div>

      {/* Right side: selected complaints */}
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
