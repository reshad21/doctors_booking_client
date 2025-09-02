/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo, useEffect } from "react";
import Select, { components } from "react-select";
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

interface RecentSearch {
  name: string;
  genericName: string;
  strength: string;
  fullDisplayName: string;
  dosageDescription?: string;
}

// --- Recent searches persisted in localStorage ---
const getStoredRecentSearches = (): RecentSearch[] => {
  const stored = localStorage.getItem("recentSearches");
  return stored ? JSON.parse(stored) : [];
};

const saveRecentSearches = (items: RecentSearch[]) => {
  localStorage.setItem("recentSearches", JSON.stringify(items));
};

const MedicineSelect = ({
  name,
  control,
  isLoading: isLoadingProp = false,
  placeholder = "Search medicines...",
  className = "",
}: MedicineSelectProps) => {
  const [inputValue, setInputValue] = useState("FA");
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    setRecentSearches(getStoredRecentSearches());
  }, []);

  const {
    data: medicineData,
    isLoading,
    isFetching,
  } = useGetMedicinesListQuery({
    limit: 100,
    searchTerm: inputValue,
  });

  const medicines = useMemo(
    () => medicineData?.data?.data || [],
    [medicineData]
  );

  // --- Add to recents ---
  const addToRecentSearches = (medicine: RecentSearch) => {
    let updated = recentSearches.filter(
      (item) => item.fullDisplayName !== medicine.fullDisplayName
    );
    updated.unshift(medicine);
    if (updated.length > 5) updated = updated.slice(0, 5);
    setRecentSearches(updated);
    saveRecentSearches(updated);
  };

  // --- Remove from recents ---
  const removeFromRecentSearches = (fullDisplayName: string) => {
    const updated = recentSearches.filter(
      (item) => item.fullDisplayName !== fullDisplayName
    );
    setRecentSearches(updated);
    saveRecentSearches(updated);
  };

  // --- Options for recent searches ---
  const recentSearchOptions = useMemo(() => {
    return recentSearches.map((recent) => ({
      value: recent.fullDisplayName,
      label: (
        <div className="flex flex-col py-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm">
              {recent.fullDisplayName}
              {recent.dosageDescription && (
                <span className="text-xs text-gray-500 ml-1">
                  ({recent.dosageDescription})
                </span>
              )}
            </span>
          </div>
          <span className="text-xs text-gray-500">{recent.genericName}</span>
        </div>
      ),
      medicineData: recent,
      isRecent: true,
    }));
  }, [recentSearches]);

  // --- Options from API ---
  const apiMedicineOptions = useMemo(() => {
    return medicines.map((med: any) => {
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
        medicineData: {
          name: med.brandName,
          genericName: med.genericName,
          strength: med.strength,
          fullDisplayName: displayName,
          dosageDescription: med.dosageDescription,
        },
        isRecent: false,
      };
    });
  }, [medicines]);

  // --- Grouped options ---
  const allOptions = useMemo(() => {
    const options: any[] = [];

    if (recentSearchOptions.length > 0 && !inputValue) {
      options.push({
        label: "Recent Searches",
        options: recentSearchOptions,
      });
    }

    if (apiMedicineOptions.length > 0) {
      options.push({
        label: inputValue ? "Search Results" : "Medicines",
        options: apiMedicineOptions,
      });
    }

    return options;
  }, [recentSearchOptions, apiMedicineOptions, inputValue]);

  // --- Custom Option with cross button ---
  const CustomOption = (props: any) => {
    const { data } = props;
    return (
      <components.Option {...props}>
        <div className="flex items-center justify-between w-full">
          <div>{data.label}</div>
          {data.isRecent && (
            <button
              type="button"
              className="ml-2 text-gray-400 hover:text-red-500 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                removeFromRecentSearches(data.medicineData.fullDisplayName);
              }}
            >
              ✕
            </button>
          )}
        </div>
      </components.Option>
    );
  };

  // --- Debounce input ---
  const handleInputChange = debounce((newValue: string, actionMeta: any) => {
    if (actionMeta.action === "input-change") {
      setInputValue(newValue);
      setMenuIsOpen(newValue.length > 0 || menuIsOpen);
    }
  }, 300);

  // --- Selection ---
  const handleSelectionChange = (selected: any, field: any) => {
    if (selected) {
      if (selected.medicineData && !selected.isRecent) {
        addToRecentSearches(selected.medicineData);
      }
      field.onChange(selected.value);
    } else {
      field.onChange("");
    }
    setMenuIsOpen(false);
  };

  // FIXED: Helper function to get field value as string
  const getFieldValueAsString = (fieldValue: any): string => {
    if (typeof fieldValue === 'string') {
      return fieldValue;
    }
    if (typeof fieldValue === 'object' && fieldValue?.value) {
      return fieldValue.value;
    }
    return '';
  };

  // FIXED: Helper function to find selected option
  const getSelectedOption = (fieldValue: any) => {
    const valueAsString = getFieldValueAsString(fieldValue);
    if (!valueAsString) return null;

    return allOptions
      .flatMap((group: any) => group.options)
      .find((opt: any) => opt.value === valueAsString) || null;
  };

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
        render={({ field }) => (
          <Select
            {...field}
            options={allOptions}
            value={getSelectedOption(field.value)} // FIXED: Use helper function
            onInputChange={handleInputChange}
            menuIsOpen={field.value ? false : menuIsOpen}
            onMenuOpen={() => !field.value && setMenuIsOpen(true)}
            onMenuClose={() => setMenuIsOpen(false)}
            onFocus={() => !field.value && setMenuIsOpen(true)}
            onChange={(selected: any) => handleSelectionChange(selected, field)}
            placeholder={placeholder}
            isClearable
            isSearchable
            components={{ Option: CustomOption }}
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
                minHeight: "0px", // reset default
                height: "52px",
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
              groupHeading: (provided) => ({
                ...provided,
                fontSize: "12px",
                fontWeight: "600",
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: "0.025em",
                padding: "8px 12px 4px 12px",
                margin: 0,
                backgroundColor: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }),
            }}
          />
        )}
      />
    </div>
  );
};

export default MedicineSelect;