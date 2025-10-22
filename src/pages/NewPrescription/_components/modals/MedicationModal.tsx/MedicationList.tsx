import { ChevronDown } from "lucide-react";
import { medicineOptions } from "@/constant/medication.constant";

export const MedicationList = ({
  searchQuery,
  toggleMedication,
  isMedSelected,
}: {
  searchQuery: string;
  toggleMedication: (name: string) => void;
  isMedSelected: (name: string) => boolean;
}) => {
  return (
    <div className="w-1/2 space-y-4">
      <div className="flex flex-wrap gap-2">
        {medicineOptions
          .filter((opt) =>
            opt.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((filter) => (
            <button
              key={filter.name}
              onClick={() => toggleMedication(filter.name)}
              className={`flex items-center gap-2 px-1 py-0.5 cursor-pointer rounded-md border transition-colors ${
                isMedSelected(filter.name)
                  ? "bg-green-50 border-green-600 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isMedSelected(filter.name) && (
                <span className="text-green-600">✓</span>
              )}
              {filter.name}
              <ChevronDown className="h-4 w-4" />
            </button>
          ))}
      </div>

      {medicineOptions.filter((opt) =>
        opt.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No medications found matching "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default MedicationList;
