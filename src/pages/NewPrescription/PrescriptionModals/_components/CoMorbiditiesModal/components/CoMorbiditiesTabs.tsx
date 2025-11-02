import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetCoMorbiditiesInputsQuery } from "@/redux/api/coMorbiditiesInput/coMorbiditiesInput";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentToken } from "@/redux/api/features/authSlice";
import { jwtDecode } from "jwt-decode";
import type { CoMorbiditiesItem } from "../CoMorbiditiesModal";

interface CoMorbiditiesInput {
  id: string;
  value: string;
}

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

export function CoMorbiditiesTabs({
  searchQuery,
  coMorbidities,
  onToggleFilter,
  onRemoveCoMorbidities,
  onUpdateCoMorbidities,
}: CoMorbiditiesTabProps) {
  const token = useAppSelector(useCurrentToken);
  const decoded: { id: string } = jwtDecode(token || "");
  const doctorId = decoded?.id;

  // Fetch co morbidities inputs from API
  const { data, isLoading } = useGetCoMorbiditiesInputsQuery([
    { key: "doctorId", value: doctorId },
  ]);

  // Use API data directly
  const coMorbiditiesOptions: CoMorbiditiesItem[] =
    data?.data?.data?.map((item: CoMorbiditiesInput) => ({
      id: item.id,
      label: item.value,
      notes: "",
    })) || [];

  const isSelected = (filter: string): boolean =>
    coMorbidities.some((cm) => cm.label === filter);

  // Sort selected options first
  const sortedCoMorbiditiesOptions = coMorbiditiesOptions
    .filter((option) => coMorbidities.some((cm) => cm.label === option.label))
    .concat(
      coMorbiditiesOptions.filter(
        (option) => !coMorbidities.some((cm) => cm.label === option.label)
      )
    );

  // Filter by search query
  const filteredCoMorbiditiesOptions = sortedCoMorbiditiesOptions.filter(
    (option) => option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <p className="text-center py-4 text-gray-500">
        Loading co morbidities...
      </p>
    );
  }

  return (
    <div className="flex gap-6 pb-6">
      <div className="w-1/2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {filteredCoMorbiditiesOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onToggleFilter(option.label)}
              className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors ${
                isSelected(option.label)
                  ? "bg-green-50 border-green-600 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isSelected(option.label) && (
                <span className="text-green-600">✓</span>
              )}
              {option.label}
              <ChevronDown className="h-4 w-4" />
            </button>
          ))}
        </div>

        {filteredCoMorbiditiesOptions.length === 0 && (
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

