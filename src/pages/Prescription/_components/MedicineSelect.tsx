/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo } from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { debounce } from "lodash";
import { useGetMedicinesListQuery } from "@/redux/api/manualData/manualData";
import { getAbbreviatedDosageForm } from "@/utils/getAbbreviatedDosageForm";

interface MedicineSelectProps {
  name: string;
  control: any;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const MedicineSelect = ({
  name,
  control,
  isLoading: isLoadingProp = false,
  placeholder = "Search medicines...",
  className = "",
}: MedicineSelectProps) => {
  const [inputValue, setInputValue] = useState('');
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  
  const {
    data: medicineData,
    isLoading,
    isFetching,
  } = useGetMedicinesListQuery({
    limit: 100,
    searchTerm: inputValue,
  });

  // Move medicines inside useMemo to avoid dependency warning
  const medicines = useMemo(
    () => medicineData?.data?.data || [],
    [medicineData]
  );

  // Create options from medicines, always include current value if missing
  const allMedicineOptions = useMemo(() => {
    let options = [];
    if (medicines && medicines.length > 0) {
      options = medicines.map((med: any) => {
        // Function to get abbreviated dosage form
        const abbreviatedForm = getAbbreviatedDosageForm(med.dosageDescription);
        const displayName = abbreviatedForm
          ? `${abbreviatedForm} ${med.brandName} ${med.strength}`
          : `${med.brandName} ${med.strength}`;
        return {
          value: displayName,
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
        };
      });
    }

    // Always include the current value if not present
    if (control && control._formValues && control._formValues[name]) {
      const currentValue = control._formValues[name];
      console.log(currentValue, "current value in medicine select");
      if (
        currentValue &&
        !options.some((opt: any) => opt.value === currentValue)
      ) {
        options = [
          {
            value: currentValue,
            label: (
              <div className="flex flex-col py-1">
                <span className="font-medium text-sm">{currentValue}</span>
                <span className="text-xs text-gray-500">
                  (Not in search results)
                </span>
              </div>
            ),
          },
          ...options,
        ];
      }
    }
    return options;
  }, [medicines, control, name]);

  // Debounced input change handler (no useCallback to avoid lint error)
  const handleInputChange = debounce(
    (newInputValue: string, actionMeta: any) => {
      if (actionMeta.action === "input-change") {
        setInputValue(newInputValue);
        setMenuIsOpen(newInputValue.length > 0 || menuIsOpen);
      }
    },
    300
  );

  if (isLoadingProp || isLoading) {
    return (
      <div
        className={`flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-50 ${className}`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">Loading medicines...</span>
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
        render={({ field }) => {
          let optionsWithFallback = allMedicineOptions;
          if (
            field.value &&
            !allMedicineOptions.some((opt: any) => opt.value === field.value)
          ) {
            optionsWithFallback = [
              {
                value: field.value,
                label: (
                  <div className="flex flex-col py-1">
                    <span className="font-medium text-sm">{field.value}</span>
                    <span className="text-xs text-gray-500">
                      (Not in search results)
                    </span>
                  </div>
                ),
              },
              ...allMedicineOptions,
            ];
          }

          return (
            <Select
              {...field}
              options={optionsWithFallback}
              value={
                optionsWithFallback.find(
                  (option: any) => option.value === field.value
                ) || null
              }
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
              filterOption={() => true}
              noOptionsMessage={() =>
                inputValue
                  ? isFetching
                    ? "Searching..."
                    : "No medicines found"
                  : "Type to search medicines"
              }
              loadingMessage={() => "Searching..."}
              maxMenuHeight={300}
              menuPlacement="auto"
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: "gray.300",
                  boxShadow: "sm",
                  "&:hover": {
                    borderColor: "blue.500",
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default MedicineSelect;
