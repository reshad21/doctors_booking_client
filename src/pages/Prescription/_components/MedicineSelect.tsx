"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useCallback } from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { debounce } from "lodash";

interface MedicineSelectProps {
  name: string;
  control: any;
  medicines: any[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const MedicineSelect = ({
  name,
  control,
  medicines,
  isLoading = false,
  placeholder = "Search medicines...",
  className = "",
}: MedicineSelectProps) => {
  const [inputValue, setInputValue] = useState("");
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  // Function to get abbreviated dosage form
  const getAbbreviatedDosageForm = (dosageDescription: string) => {
    if (!dosageDescription) return "";
    
    const dosageMap: { [key: string]: string } = {
      'tablet': 'Tab.',
      'capsule': 'Cap.',
      'syrup': 'Syp.',
      'injection': 'Inj.',
      'cream': 'Cr.',
      'ointment': 'Oint.',
      'drops': 'Drp.',
      'suspension': 'Susp.',
      'solution': 'Sol.',
      'powder': 'Pwd.',
      'gel': 'Gel',
      'lotion': 'Lot.',
      'spray': 'Spr.',
      'inhaler': 'Inh.',
      'suppository': 'Supp.',
      'patch': 'Patch',
    };

    const description = dosageDescription.toLowerCase();
    
    // Find matching dosage form
    for (const [key, abbreviation] of Object.entries(dosageMap)) {
      if (description.includes(key)) {
        return abbreviation;
      }
    }
    
    // If no match found, return first word capitalized with period
    const firstWord = dosageDescription.split(' ')[0];
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase() + '.';
  };

  // Create searchable options from medicines
  const allMedicineOptions = useMemo(() => {
    if (!medicines || medicines.length === 0) return [];
    
    return medicines.map((med: any) => {
      const abbreviatedForm = getAbbreviatedDosageForm(med.dosageDescription);
      const displayName = abbreviatedForm 
        ? `${abbreviatedForm} ${med.brandName} ${med.strength}`
        : `${med.brandName} ${med.strength}`;
      
      return {
        value: med.brandName,
        label: (
          <div className="flex flex-col py-1">
            <span className="font-medium text-sm">
              {displayName}{" "}
              <span className="text-xs text-gray-500">
                ({med.dosageDescription})
              </span>
            </span>
            <span className="text-xs text-gray-500">{med.genericName}</span>
          </div>
        ),
        searchText: `${displayName} ${med.genericName} ${med.dosageDescription}`.toLowerCase(),
      };
    });
  }, [medicines]);

  // Filter options based on input with debouncing
  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) {
      // Show only first 50 options when no search input
      return allMedicineOptions.slice(0, 50);
    }

    const searchTerm = inputValue.toLowerCase();
    const filtered = allMedicineOptions.filter((option) =>
      option.searchText.includes(searchTerm)
    );

    // Limit to 100 results for performance
    return filtered.slice(0, 100);
  }, [allMedicineOptions, inputValue]);

  // Debounced input change handler
  const debouncedInputChange = useCallback(
    debounce((newValue: string) => {
      setInputValue(newValue);
    }, 200),
    []
  );

  const handleInputChange = (newInputValue: string, actionMeta: any) => {
    if (actionMeta.action === 'input-change') {
      debouncedInputChange(newInputValue);
      setMenuIsOpen(newInputValue.length > 0 || menuIsOpen);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-50 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">Loading medicines...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        Medicine Name
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={filteredOptions}
            value={filteredOptions.find((option) => option.value === field.value) || null}
            onInputChange={handleInputChange}
            menuIsOpen={menuIsOpen}
            onMenuOpen={() => setMenuIsOpen(true)}
            onMenuClose={() => setMenuIsOpen(false)}
            onFocus={() => setMenuIsOpen(true)}
            onChange={(selected: any) => {
              field.onChange(selected ? selected.value : "");
              setMenuIsOpen(false);
            }}
            placeholder={placeholder}
            isClearable
            isSearchable
            filterOption={() => true} // Disable built-in filtering since we handle it manually
            noOptionsMessage={() => 
              inputValue ? "No medicines found" : "Type to search medicines"
            }
            loadingMessage={() => "Searching..."}
            maxMenuHeight={300}
            menuPlacement="auto"
            styles={{
              control: (provided, state) => ({
                ...provided,
                minHeight: "44px",
                borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                borderWidth: "1px",
                borderRadius: "8px",
                boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
                backgroundColor: "#fdfdff",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#9ca3af",
                },
              }),
              placeholder: (provided) => ({
                ...provided,
                color: "#9ca3af",
                fontSize: "14px",
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected 
                  ? "#3b82f6" 
                  : state.isFocused 
                  ? "#f3f4f6" 
                  : "white",
                color: state.isSelected ? "white" : "#374151",
                padding: "8px 12px",
                fontSize: "14px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: state.isSelected ? "#3b82f6" : "#f9fafb",
                },
              }),
              menu: (provided) => ({
                ...provided,
                borderRadius: "8px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                border: "1px solid #e5e7eb",
                zIndex: 9999,
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: "300px",
                padding: "4px",
              }),
              noOptionsMessage: (provided) => ({
                ...provided,
                padding: "12px",
                fontSize: "14px",
                color: "#6b7280",
                textAlign: "center" as const,
              }),
              loadingMessage: (provided) => ({
                ...provided,
                padding: "12px",
                fontSize: "14px",
                color: "#6b7280",
              }),
            }}
          />
        )}
      />
      {inputValue && filteredOptions.length === 100 && (
        <p className="text-xs text-gray-500 mt-1">
          Showing first 100 results. Be more specific to narrow down the search.
        </p>
      )}
    </div>
  );
};

export default MedicineSelect;