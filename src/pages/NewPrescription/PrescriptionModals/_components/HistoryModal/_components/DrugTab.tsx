import { useMemo } from "react";
import { useGetMedicinesQuery } from "@/redux/api/medicine/medicine";
import type { TMedicine } from "@/types/medicine.types";

interface DrugTabProps {
  searchQuery: string;
  drugs: string[];
  onToggleDrug: (name: string) => void;
}

export const DrugTab = ({ searchQuery, drugs, onToggleDrug }: DrugTabProps) => {
  const query: Record<string, string>[] = [
    { key: "searchTerm", value: searchQuery },
    { key: "limit", value: "100" },
  ];

  const { data: medicinesResponse, isLoading } = useGetMedicinesQuery(query);

  const medicines = useMemo<TMedicine[]>(() => {
    return medicinesResponse?.data?.data || [];
  }, [medicinesResponse]);

  const filteredMedicines = useMemo(() => {
    if (!searchQuery) return medicines;
    return medicines.filter((m) =>
      `${m.brandName} ${m.strength}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [medicines, searchQuery]);

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 pb-6">
      {/* Left: Medicine list */}
      <div className="w-full md:w-1/2 space-y-4">
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-6">Loading...</p>
        ) : filteredMedicines.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filteredMedicines.map((med) => {
              const label = `${med.brandName} (${med.strength})`;
              const isSelected = drugs.includes(label);
              return (
                <button
                  key={med.id}
                  onClick={() => onToggleDrug(label)}
                  className={`px-2 py-1 rounded-md border text-sm transition ${
                    isSelected
                      ? "bg-green-50 border-green-600 text-green-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isSelected ? "✓ " : ""}
                  {label}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">
            No medicines found
          </p>
        )}
      </div>

      {/* Right: Selected medicines */}
      <div className="w-full md:w-1/2 space-y-3 max-h-96 overflow-y-auto pr-2">
        {drugs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Select medicines from the left to add here
          </p>
        ) : (
          drugs.map((d, idx) => (
            <div
              key={d}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
            >
              <div className="text-sm font-semibold">
                {idx + 1}. {d}
              </div>
              <button
                onClick={() => onToggleDrug(d)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
