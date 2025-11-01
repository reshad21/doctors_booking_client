/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "react-select"
import { Controller } from "react-hook-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"

type OptionType = {
  value: string
  label: string
}

interface ReactSelectCompoProps {
  label?: string
  name: string
  options: OptionType[]
  control: any
  isMulti?: boolean
  className?: string
  showSelectedBox?: boolean
  onChange?: (selected: OptionType | OptionType[] | null) => void
  onCreateOption?: (inputValue: string) => void
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
  const [inputValue, setInputValue] = useState("")
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <>
              <Select
                options={options}
                isMulti={isMulti}
                value={
                  isMulti
                    ? options.filter((option) => (field.value || []).includes(option.value))
                    : options.find((option) => field.value === option.value) || null
                }
                onInputChange={(newInputValue, actionMeta) => {
                  setInputValue(newInputValue)
                  
                  // Only open menu when user is typing and has input
                  if (actionMeta.action === 'input-change' && newInputValue.length > 0) {
                    setMenuIsOpen(true)
                  } else if (newInputValue.length === 0) {
                    setMenuIsOpen(false)
                  }
                }}
                inputValue={inputValue}
                menuIsOpen={menuIsOpen}
                onMenuOpen={() => {
                  // Allow menu to open when user interacts with the component
                  setMenuIsOpen(true)
                }}
                onMenuClose={() => setMenuIsOpen(false)}
                onFocus={() => {
                  // Always allow menu to open on focus, but only if user clicks in the input area
                  setMenuIsOpen(true)
                }}
                noOptionsMessage={() =>
                  inputValue && onCreateOption ? (
                    <Button
                      className="w-full bg-brand"
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        onCreateOption(inputValue)
                        setInputValue("")
                        setMenuIsOpen(false)
                      }}
                    >
                      Save "{inputValue && inputValue.slice(0, 15)}..."
                    </Button>
                  ) : (
                    "No options"
                  )
                }
                onChange={(selected: any) => {
                  if (isMulti) {
                    const values = Array.isArray(selected) ? selected.map((item: OptionType) => item.value) : []
                    field.onChange(values)
                    if (onChange) onChange(selected)
                  } else {
                    const value = selected ? (selected as OptionType).value : ""
                    field.onChange(value)
                    if (onChange) onChange(selected ? (selected as OptionType) : null)
                  }
                  
                  // Close menu after selection
                  setMenuIsOpen(false)
                  setInputValue("")
                }}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    padding: "8px 12px",
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
                  valueContainer: (provided) => ({
                    ...provided,
                    padding: "0 4px",
                  }),
                  input: (provided) => ({
                    ...provided,
                    padding: 0,
                    margin: 0,
                    fontSize: "14px",
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: "#9ca3af",
                    fontSize: "14px",
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "#eff6ff",
                    borderRadius: "6px",
                    marginRight: "4px",
                    marginBottom: "2px",
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: "#1e40af",
                    fontSize: "12px",
                    fontWeight: "500",
                  }),
                  multiValueRemove: (provided) => ({
                    ...provided,
                    color: "#6b7280",
                    "&:hover": {
                      backgroundColor: "#dc2626",
                      color: "white",
                    },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#f3f4f6" : "white",
                    color: state.isSelected ? "white" : "#374151",
                    padding: "10px 12px",
                    fontSize: "14px",
                    "&:hover": {
                      backgroundColor: state.isSelected ? "#3b82f6" : "#f9fafb",
                    },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #e5e7eb",
                  }),
                  noOptionsMessage: (provided) => ({
                    ...provided,
                    padding: "8px 12px",
                    fontSize: "14px",
                    color: "#6b7280",
                  }),
                }}
              />
              {showSelectedBox && isMulti && Array.isArray(field.value) && field.value.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <span className="text-sm font-medium text-blue-900">Selected Items:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((val: string) => {
                      const opt = options.find((o) => o.value === val)
                      return (
                        <span
                          key={val}
                          className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200"
                        >
                          {opt ? opt.label : val}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )
        }}
      />
    </div>
  )
}

export default ReactSelectCompo