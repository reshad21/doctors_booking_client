/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Plus, X, AlertTriangle } from "lucide-react";
import MedicineSelect from "./MedicineSelect";
import DosageTimingRow from "./DosageTimingRow";

interface MedicineItem {
  id: string;
  medicineName: string;
  timingCount: number;
}

interface MedicineFormProps {
  type: string;
  onValidationError: (error: string) => void;
}

const MedicineForm = ({ type, onValidationError }: MedicineFormProps) => {
  const form = useFormContext();
  
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    { id: Date.now().toString(), medicineName: "", timingCount: 1 }
  ]);

  // Medicine validation - check for duplicates
  const validateUniqueMedicines = useCallback(() => {
    const selectedMedicines = new Set<string>();
    const duplicates: string[] = [];

    for (const medicine of medicines) {
      const fieldValue = form.getValues(`medicine-${medicine.id}`);
      const medicineValue = fieldValue?.value || fieldValue;
      const medicineLabel = fieldValue?.label || fieldValue;

      if (medicineValue?.trim()) {
        if (selectedMedicines.has(medicineValue)) {
          duplicates.push(medicineLabel);
        } else {
          selectedMedicines.add(medicineValue);
        }
      }
    }

    if (duplicates.length > 0) {
      const errorMessage = `Duplicate medicines: ${duplicates.join(", ")}`;
      onValidationError(errorMessage);
      return false;
    }
    
    onValidationError("");
    return true;
  }, [medicines, form, onValidationError]);

  // Debounced duplicate validation
  useEffect(() => {
    if (medicines.length > 1) {
      const timeoutId = setTimeout(validateUniqueMedicines, 300);
      return () => clearTimeout(timeoutId);
    } else {
      onValidationError("");
    }
  }, [medicines, validateUniqueMedicines, onValidationError]);

  // Handle initialization for update mode
  useEffect(() => {
    if (type === "update") {
      const handleInitialize = (event: CustomEvent) => {
        const { medicines: initMedicines } = event.detail;
        if (initMedicines?.length > 0) {
          const transformedMedicines = initMedicines.map((med: any) => ({
            id: med.content || Date.now().toString(),
            medicineName: med.medicineName || "",
            timingCount: med.DosageSchedule?.length || 1
          }));
          setMedicines(transformedMedicines);
        }
      };

      window.addEventListener("initializeMedicineForm", handleInitialize as EventListener);
      return () => window.removeEventListener("initializeMedicineForm", handleInitialize as EventListener);
    }
  }, [type]);

  // Add new medicine
  const addMedicine = useCallback(() => {
    setMedicines(prev => [
      ...prev,
      { id: Date.now().toString(), medicineName: "", timingCount: 1 }
    ]);
  }, []);

  // Remove medicine and clean up form fields
  const removeMedicine = useCallback((id: string) => {
    setMedicines(prev => prev.filter(med => med.id !== id));
    
    // Clean up all form fields related to this medicine
    const allFields = form.getValues();
    Object.keys(allFields).forEach(key => {
      if (key.includes(`-${id}`) || key === `medicine-${id}`) {
        form.unregister(key);
      }
    });
  }, [form]);

  // Update timing count for a medicine
  const updateTimingCount = useCallback((id: string, increment: boolean) => {
    setMedicines(prev => prev.map(med => {
      if (med.id === id) {
        const newCount = increment 
          ? med.timingCount + 1 
          : Math.max(med.timingCount - 1, 1);
        
        // Clean up form fields if removing timing
        if (!increment && newCount < med.timingCount) {
          const timingIndex = med.timingCount;
          ['dosage', 'duration', 'time', 'comment'].forEach(field => {
            form.unregister(`${timingIndex}-${field}-${id}`);
          });
        }
        
        return { ...med, timingCount: newCount };
      }
      return med;
    }));
  }, [form]);

  // Check for duplicate medicine error
  const getDuplicateError = (medicineId: string) => {
    const currentValue = form.watch(`medicine-${medicineId}`);
    const currentMedicineValue = currentValue?.value || currentValue;
    
    if (!currentMedicineValue?.trim()) return null;
    
    const duplicateFound = medicines.some(med => {
      if (med.id === medicineId) return false;
      const otherValue = form.getValues(`medicine-${med.id}`);
      const otherMedicineValue = otherValue?.value || otherValue;
      return otherMedicineValue === currentMedicineValue;
    });
    
    return duplicateFound ? `"${currentValue?.label || currentValue}" is already selected` : null;
  };

  return (
    <div className="space-y-6">
      {medicines.map((medicine) => {
        const duplicateError = getDuplicateError(medicine.id);

        return (
          <div
            key={medicine.id}
            className={`relative border rounded-lg bg-white p-4 ${
              duplicateError ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
          >
            {/* Remove medicine button (only show if more than one medicine) */}
            {medicines.length > 1 && (
              <button
                type="button"
                onClick={() => removeMedicine(medicine.id)}
                className="absolute top-3 right-3 w-6 h-6 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-all duration-200"
                title="Remove Medicine"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="space-y-4">
              {/* Medicine selection */}
              <div className="space-y-2">
                <MedicineSelect
                  name={`medicine-${medicine.id}`}
                  control={form.control}
                  placeholder="Search medicine by name, generic name, or strength..."
                />

                {/* Duplicate error message */}
                {duplicateError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{duplicateError}</span>
                  </div>
                )}
              </div>

              {/* Dosage timing rows */}
              <div className="space-y-3">
                {Array.from({ length: medicine.timingCount }).map((_, timingIndex) => (
                  <DosageTimingRow
                    key={`${medicine.id}-${timingIndex + 1}`}
                    medicineId={medicine.id}
                    timingIndex={timingIndex}
                  />
                ))}
              </div>

              {/* Timing control buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => updateTimingCount(medicine.id, true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Timing
                </button>
                {medicine.timingCount > 1 && (
                  <button
                    type="button"
                    onClick={() => updateTimingCount(medicine.id, false)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Remove Timing
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Add medicine button */}
      <button
        type="button"
        onClick={addMedicine}
        className="w-full py-3 bg-white text-sm font-medium text-gray-600 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
      >
        <Plus className="w-4 h-4 inline mr-2" />
        Add Another Medicine
      </button>
    </div>
  );
};

export default MedicineForm;