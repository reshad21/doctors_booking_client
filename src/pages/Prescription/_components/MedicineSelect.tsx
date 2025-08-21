"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
  onChange?: (value: any) => void;
}

const MedicineSelect = ({
  name,
  control,
  medicines,
  isLoading = false,
  placeholder = "Search medicines...",
  className = "",
  onChange,
}: MedicineSelectProps) => {
  const [inputValue, setInputValue] = useState("");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [processedMedicines, setProcessedMedicines] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const processedRef = useRef(false);

  // Function to get abbreviated dosage form
  const getAbbreviatedDosageForm = useCallback((dosageDescription: string) => {
    if (!dosageDescription) return "";

    const dosageMap: { [key: string]: string } = {
      tablet: "Tab.",
      capsule: "Cap.",
      syrup: "Syp.",
      injection: "Inj.",
      cream: "Cr.",
      ointment: "Oint.",
      drops: "Drp.",
      suspension: "Susp.",
      solution: "Sol.",
      powder: "Pwd.",
      gel: "Gel",
      lotion: "Lot.",
      spray: "Spr.",
      inhaler: "Inh.",
      suppository: "Supp.",
      patch: "Patch",
    };

    const description = dosageDescription.toLowerCase();

    for (const [key, abbreviation] of Object.entries(dosageMap)) {
      if (description.includes(key)) {
        return abbreviation;
      }
    }

    const firstWord = dosageDescription.split(" ")[0];
    return (
      firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase() + "."
    );
  }, []);

  // Process medicines in chunks to avoid blocking UI
  useEffect(() => {
    if (!medicines || medicines.length === 0 || processedRef.current) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    const processMedicinesInChunks = () => {
      return new Promise<any[]>((resolve) => {
        const chunkSize = 1000; // Process 1000 items at a time
        const totalChunks = Math.ceil(medicines.length / chunkSize);
        const processedOptions: any[] = [];
        let currentChunk = 0;

        const processChunk = () => {
          const start = currentChunk * chunkSize;
          const end = Math.min(start + chunkSize, medicines.length);

          for (let i = start; i < end; i++) {
            const med = medicines[i];
            const abbreviatedForm = getAbbreviatedDosageForm(
              med.dosageDescription
            );
            const displayName = abbreviatedForm
              ? `${abbreviatedForm} ${med.brandName} ${med.strength}`
              : `${med.brandName} ${med.strength}`;

            processedOptions.push({
              value: displayName,
              label: displayName,
              displayLabel: displayName,
              fullLabel: (
                <div className="flex flex-col py-1">
                  <span className="font-medium text-sm">
                    {displayName}{" "}
                    <span className="text-xs text-gray-500">
                      ({med.dosageDescription})
                    </span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {med.genericName}
                  </span>
                </div>
              ),
              searchText:
                `${displayName} ${med.genericName} ${med.dosageDescription}`.toLowerCase(),
              genericName: med.genericName,
              dosageDescription: med.dosageDescription,
            });
          }

          currentChunk++;

          if (currentChunk < totalChunks) {
            // Use setTimeout to yield control back to the browser
            setTimeout(processChunk, 0);
          } else {
            resolve(processedOptions);
          }
        };

        processChunk();
      });
    };

    processMedicinesInChunks().then((options) => {
      setProcessedMedicines(options);
      setIsProcessing(false);
      processedRef.current = true;
    });

    return () => {
      processedRef.current = false;
    };
  }, [medicines, getAbbreviatedDosageForm]);

  // Optimized filtering with early exit and result limiting
  const filteredOptions = useMemo(() => {
    if (isProcessing || processedMedicines.length === 0) {
      return [];
    }

    if (!inputValue.trim()) {
      return []; // Don't show any options when no search input to avoid rendering 36k items
    }

    const searchTerm = inputValue.toLowerCase().trim();
    const searchWords = searchTerm.split(" ").filter((word) => word.length > 0);

    // If search term is too short, require minimum 2 characters
    if (searchTerm.length < 2) {
      return [];
    }

    const filtered: any[] = [];
    const maxResults = 50; // Limit to 50 results for better performance

    for (
      let i = 0;
      i < processedMedicines.length && filtered.length < maxResults;
      i++
    ) {
      const option = processedMedicines[i];
      const searchText = option.searchText;

      // Check if all search words are present
      const matchesAll = searchWords.every((word) => searchText.includes(word));

      if (matchesAll) {
        // Create a shallow copy with the full label for rendering
        filtered.push({
          ...option,
          label: option.fullLabel,
        });
      }
    }

    return filtered;
  }, [processedMedicines, inputValue, isProcessing]);

  // Debounced input change handler with shorter delay for responsiveness
  const debouncedInputChange = useMemo(
    () =>
      debounce((newValue: string) => {
        setInputValue(newValue);
      }, 150),
    []
  );

  const handleInputChange = useCallback(
    (newInputValue: string, actionMeta: any) => {
      if (actionMeta.action === "input-change") {
        debouncedInputChange(newInputValue);
        setMenuIsOpen(newInputValue.length >= 2); // Only open menu for 2+ characters
      }
    },
    [debouncedInputChange]
  );

  // Handle selection with optimized change detection
  const handleSelectionChange = useCallback(
    (selected: any, field: any) => {
      const newValue = selected
        ? {
            value: selected.value,
            label: selected.displayLabel || selected.value,
          }
        : null;

      field.onChange(newValue);

      if (onChange) {
        onChange(newValue);
      }

      setMenuIsOpen(false);
      setInputValue(""); // Clear search after selection
    },
    [onChange]
  );

  if (isLoading || isProcessing) {
    return (
      <div
        className={`flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-50 ${className}`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">
            {isLoading ? "Loading medicines..." : "Processing medicines..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">Medicine Name</label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <Select
              {...field}
              options={filteredOptions}
              value={
                field.value
                  ? processedMedicines.find(
                      (option) =>
                        option.value === (field.value?.value || field.value)
                    ) || null
                  : null
              }
              onInputChange={handleInputChange}
              menuIsOpen={menuIsOpen && filteredOptions.length > 0}
              onMenuOpen={() => setMenuIsOpen(inputValue.length >= 2)}
              onMenuClose={() => setMenuIsOpen(false)}
              onFocus={() => {
                if (inputValue.length >= 2) {
                  setMenuIsOpen(true);
                }
              }}
              onChange={(selected) => handleSelectionChange(selected, field)}
              placeholder={placeholder}
              isClearable
              isSearchable
              filterOption={() => true}
              noOptionsMessage={() => {
                if (inputValue.length < 2) {
                  return "Type at least 2 characters to search";
                }
                return filteredOptions.length === 0
                  ? "No medicines found"
                  : "Type to search medicines";
              }}
              loadingMessage={() => "Searching..."}
              maxMenuHeight={300}
              menuPlacement="auto"
              // Performance optimizations
              menuShouldScrollIntoView={false}
              menuShouldBlockScroll={false}
              openMenuOnFocus={false}
              openMenuOnClick={false}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  minHeight: "44px",
                  borderColor: error
                    ? "#ef4444"
                    : state.isFocused
                      ? "#3b82f6"
                      : "#d1d5db",
                  borderWidth: "1px",
                  borderRadius: "8px",
                  boxShadow: state.isFocused
                    ? error
                      ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                      : "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    : "none",
                  backgroundColor: "#fdfdff",
                  transition: "border-color 0.15s ease",
                  "&:hover": {
                    borderColor: error ? "#ef4444" : "#9ca3af",
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
                }),
                menu: (provided) => ({
                  ...provided,
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
                singleValue: (provided) => ({
                  ...provided,
                  fontSize: "14px",
                  color: "#374151",
                }),
              }}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
          </div>
        )}
      />
      {inputValue && inputValue.length >= 2 && (
        <div className="text-xs text-gray-500 mt-1">
          {filteredOptions.length === 50
            ? "Showing first 50 results. Be more specific to narrow down."
            : `Found ${filteredOptions.length} result${filteredOptions.length !== 1 ? "s" : ""}`}
        </div>
      )}
      {inputValue && inputValue.length < 2 && (
        <p className="text-xs text-gray-500 mt-1">
          Type at least 2 characters to search medicines
        </p>
      )}
    </div>
  );
};

export default MedicineSelect;
