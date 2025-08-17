/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "react-select";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type OptionType = {
  value: string;
  label: string;
};

interface ReactSelectCompoProps {
  label?: string;
  name: string;
  options: OptionType[];
  control: any;
  isMulti?: boolean;
  className?: string;
  showSelectedBox?: boolean;
  onChange?: (selected: OptionType | OptionType[] | null) => void;
  onCreateOption?: (inputValue: string) => void;
}

const ReactSelectCompo = ({
  label,
  name,
  options,
  control,
  isMulti = false,
  className,
  showSelectedBox = true,
  onChange,
  onCreateOption,
}: ReactSelectCompoProps) => {
  // Remove localSelected state, always use field.value for selected
  const [inputValue, setInputValue] = useState("");

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Select
              options={options}
              isMulti={isMulti}
              value={
                isMulti
                  ? options.filter((option) =>
                      (field.value || []).includes(option.value)
                    )
                  : options.find((option) => field.value === option.value) ||
                    null
              }
              onInputChange={setInputValue}
              inputValue={inputValue}
              noOptionsMessage={() =>
                inputValue && onCreateOption ? (
                  <Button
                    className="w-full bg-brand"
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onCreateOption(inputValue);
                      setInputValue("");
                    }}
                  >
                    Save "{inputValue && inputValue.slice(0, 15)}..."
                  </Button>
                ) : (
                  "No options"
                )
              }
              onChange={(selected:any) => {
                if (isMulti) {
                  const values = Array.isArray(selected)
                    ? selected.map((item: OptionType) => item.value)
                    : [];
                  field.onChange(values);
                  if (onChange) onChange(selected);
                } else {
                  const value = selected ? (selected as OptionType).value : "";
                  field.onChange(value);
                  if (onChange)
                    onChange(selected ? (selected as OptionType) : null);
                }
              }}
              className="basic-multi-select"
              classNamePrefix="select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  padding: "5px 10px",
                  minHeight: "40px",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  padding: 0,
                }),
                input: (provided) => ({
                  ...provided,
                  padding: 0,
                  margin: 0,
                }),
                multiValue: (provided) => ({
                  ...provided,
                  marginRight: "4px",
                  marginBottom: "4px",
                }),
              }}
            />
            {showSelectedBox &&
              isMulti &&
              Array.isArray(field.value) &&
              field.value.length > 0 && (
                <div className="mt-2 p-2 rounded bg-gray-50">
                  <span className="text-sm font-medium">Selected:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {field.value.map((val: string) => {
                      const opt = options.find((o) => o.value === val);
                      return (
                        <span
                          key={val}
                          className="px-2 py-1 text-xs bg-blue-100 rounded"
                        >
                          {opt ? opt.label : val}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
          </>
        )}
      />
    </div>
  );
};
export default ReactSelectCompo;
