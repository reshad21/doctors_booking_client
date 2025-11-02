import { ChevronDown } from "lucide-react";
import { useGetMedicinesQuery } from "@/redux/api/medicine/medicine";
import type { TMedicine } from "@/types/medicine.types";
import { classifyMedicineType } from "@/utils/medicineTypeClassifier";

export const MedicationList = ({
  searchQuery,
  toggleMedication,
  isMedSelected,
}: {
  searchQuery: string;
  toggleMedication: (
    name: string,
    type: "Tablet" | "Capsule" | "Other"
  ) => void;
  isMedSelected: (name: string) => boolean;
}) => {
  const query: Record<string, string>[] = [
    { key: "searchTerm", value: searchQuery },
    { key: "limit", value: "100" },
  ];

  const { data: medicinesResponse } = useGetMedicinesQuery(query);
  const medicines = medicinesResponse?.data?.data || [];

  return (
    <div className="w-1/2 space-y-4">
      <div className="flex flex-wrap gap-2">
        {medicines.length > 0 ? (
          medicines
            .filter((med: TMedicine) =>
              med.brandName.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((med: TMedicine) => {
              const medLabel = `${med.brandName} - ${med.strength}`;
              const medicineType = classifyMedicineType(med.dosageDescription);

              return (
                <button
                  key={med.id}
                  onClick={() => toggleMedication(medLabel, medicineType)}
                  className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded-md border transition-colors ${
                    isMedSelected(medLabel)
                      ? "bg-green-50 border-green-600 text-green-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isMedSelected(medLabel) && (
                    <span className="text-green-600">✓</span>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{medLabel}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
              );
            })
        ) : (
          <p className="text-sm text-gray-500 text-center py-4 w-full">
            No medications found matching "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicationList;
