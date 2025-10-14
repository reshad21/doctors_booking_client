import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import DurationInput from "./DurationInput";
import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { filterOptions } from "@/constant/chief-complaint.constant";

interface ComplaintItem {
  id: string;
  label: string;
  duration: string;
  unit: string;
  notes: string;
}

interface ComplaintCardProps {
  complaint: ComplaintItem;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof ComplaintItem, value: string) => void;
}

export function ComplaintCard({
  complaint,
  index,
  onRemove,
  onUpdate,
}: ComplaintCardProps) {
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
          <label className="text-xs font-medium text-gray-600">Duration</label>
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

interface ComplaintTabProps {
  searchQuery: string;
  complaints: ComplaintItem[];
  onToggleFilter: (filter: string) => void;
  onRemoveComplaint: (id: string) => void;
  onUpdateComplaint: (
    id: string,
    field: keyof ComplaintItem,
    value: string
  ) => void;
}

export function ComplaintTab({
  searchQuery,
  complaints,
  onToggleFilter,
  onRemoveComplaint,
  onUpdateComplaint,
}: ComplaintTabProps) {
  const isFilterSelected = (filter: string) => {
    return complaints.some((c) => c.label === filter);
  };

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
    <div className="flex gap-6 pb-6">
      {/* Left Side - Filter Tags */}
      <div className="w-1/2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {filteredComplaintOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => onToggleFilter(filter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
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

      {/* Right Side - Complaints List */}
      <div className="w-1/2 space-y-3 overflow-x-hidden">
        {complaints.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            Select symptoms from the left to add them here
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
