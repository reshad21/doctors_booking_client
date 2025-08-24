"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { debounce } from "lodash";
import { useGetMedicinesListQuery } from "@/redux/api/manualData/manualData";

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
  const [inputValue, setInputValue] = useState("");
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
  const medicines = useMemo(() => medicineData?.data?.data || [], [medicineData]);

  // Function to get abbreviated dosage form
  const getAbbreviatedDosageForm = (dosageDescription: string) => {
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
  };

  // Create options from medicines
  const allMedicineOptions = useMemo(() => {
    if (!medicines || medicines.length === 0) return [];
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
      };
    });
  }, [medicines]);

  // Debounced input change handler (no useCallback to avoid lint error)
  const handleInputChange = debounce((newInputValue: string, actionMeta: any) => {
    if (actionMeta.action === "input-change") {
      setInputValue(newInputValue);
      setMenuIsOpen(newInputValue.length > 0 || menuIsOpen);
    }
  }, 300);

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
            options={allMedicineOptions}
            value={
              allMedicineOptions.find(
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
        )}
      />
    </div>
  );
};

export default MedicineSelect;
