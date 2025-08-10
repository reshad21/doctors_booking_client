/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "react-select";
import { Controller } from "react-hook-form";
import { useState } from "react";

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
}: ReactSelectCompoProps) => {
  const [localSelected, setLocalSelected] = useState<OptionType[]>([]);

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
              value={options.filter((option) =>
                isMulti
                  ? field.value?.includes(option.value)
                  : field.value === option.value
              )}
              onChange={(selected) => {
                if (isMulti) {
                  const values =
                    (selected as OptionType[])?.map((item) => item.value) || [];
                  field.onChange(values);
                  setLocalSelected((selected as OptionType[]) || []);
                } else {
                  const value = (selected as OptionType)?.value || "";
                  field.onChange(value);
                  setLocalSelected(selected ? [selected as OptionType] : []);
                }
                if (onChange) {
                  if (isMulti) {
                    onChange(Array.isArray(selected) ? [...selected] : []);
                  } else {
                    onChange(selected ? (selected as OptionType) : null);
                  }
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
            {showSelectedBox && localSelected.length > 0 && (
              <div className="mt-2 p-2 rounded bg-gray-50">
                <span className="text-sm font-medium">Selected:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {localSelected.map((item) => (
                    <span
                      key={item.value}
                      className="px-2 py-1 text-xs bg-blue-100 rounded"
                    >
                      {item.value}
                    </span>
                  ))}
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
