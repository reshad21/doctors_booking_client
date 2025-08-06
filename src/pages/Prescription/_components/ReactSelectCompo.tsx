/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // ReactSelectCompo.tsx
// import Select, { type ActionMeta } from 'react-select';
// import { Controller } from 'react-hook-form';

// type OptionType = {
//   value: string;
//   label: string;
// };

// interface ReactSelectCompoProps {
//   label?: string;
//   options: OptionType[];
//   selected: OptionType[];
//   onChange: (selected: OptionType[]) => void;
//   className?: string;
//   isMulti?: boolean;
//   name?: string;
//   control?: any;
//   showSelectedBox?: boolean; // New prop to toggle selected values box
// }

// const ReactSelectCompo = ({
//   label,
//   options,
//   selected,
//   onChange,
//   className,
//   isMulti = false,
//   name,
//   control,
//   showSelectedBox = true, // Default to true for backward compatibility
// }: ReactSelectCompoProps) => {
//   const handleChange = (newValue: unknown, actionMeta: ActionMeta<OptionType>) => {
//     const values = isMulti
//       ? (newValue as OptionType[])
//       : newValue
//         ? [newValue as OptionType]
//         : [];
//     onChange(values);
//   };

//   if (name && control) {
//     return (
//       <div className={`flex flex-col space-y-2 ${className}`}>
//         {label && <label className="text-sm font-medium">{label}</label>}
//         <Controller
//           name={name}
//           control={control}
//           render={({ field }) => (
//             <>
//               <Select
//                 options={options}
//                 isMulti={isMulti}
//                 value={selected}
//                 onChange={(val, action) => {
//                   handleChange(val, action);
//                   field.onChange(
//                     isMulti
//                       ? (val as OptionType[]).map(v => v.value)
//                       : (val as OptionType)?.value
//                   );
//                 }}
//                 className="basic-multi-select"
//                 classNamePrefix="select"
//               />
//               {showSelectedBox && selected.length > 0 && (
//                 <div className="mt-2 p-2 border rounded bg-gray-50">
//                   <span className="text-sm font-medium">Selected:</span>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     {selected.map((item) => (
//                       <span
//                         key={item.value}
//                         className="px-2 py-1 text-xs bg-blue-100 rounded"
//                       >
//                         {item.label}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className={`flex flex-col space-y-2 ${className}`}>
//       {label && <label className="text-sm font-medium">{label}</label>}
//       <Select
//         options={options}
//         isMulti={isMulti}
//         value={selected}
//         onChange={handleChange}
//         className="basic-multi-select"
//         classNamePrefix="select"
//       />
//       {showSelectedBox && selected.length > 0 && (
//         <div className="mt-2 p-2 border rounded bg-gray-50">
//           <span className="text-sm font-medium">Selected:</span>
//           <div className="flex flex-wrap gap-1 mt-1">
//             {selected.map((item) => (
//               <span
//                 key={item.value}
//                 className="px-2 py-1 text-xs bg-blue-100 rounded"
//               >
//                 {item.label}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReactSelectCompo;

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
            {/* <Select
              options={options}
              isMulti={isMulti}
              value={options.filter((option) =>
                isMulti
                  ? field.value?.includes(option.value)
                  : field.value === option.value
              )}
              onChange={(selected, actionMeta) => {
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
              className="basic-multi-select "
              classNamePrefix="select"
            /> */}
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
            {showSelectedBox && (
              <div className="mt-2 p-2 rounded bg-gray-50">
                <span className="text-sm font-medium">Selected:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {localSelected.map((item) => (
                    <span
                      key={item.value}
                      className="px-2 py-1 text-xs bg-blue-100 rounded"
                    >
                      {item.label}
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
