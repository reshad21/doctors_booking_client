/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import ReactSelectCompo from "./ReactSelectCompo";
import BaseInput from "@/components/shared/BaseInput";
import { Plus, X } from "lucide-react";

const MedicineForm = ({
  form,
  medicineInputCount,
  timingCounts,
  dosageOptions,
  timeOptions,
  addTimingSet,
  removeTimingSet,
  handleAddMedicineInput,
  handleRemoveMedicineInput,
  type,
}: any) => {
  const medicineOptions = [
    { value: "paracetamol", label: "Paracetamol" },
    { value: "ibuprofen", label: "Ibuprofen" },
    { value: "amoxicillin", label: "Amoxicillin" },
  ];
  let dynamicMedicineCount = medicineInputCount;
  if (dynamicMedicineCount && dynamicMedicineCount.length == 0) {
    dynamicMedicineCount = [
      ...dynamicMedicineCount,
      { medicineName: "", DosageSchedule: [] },
    ];
  }
  return (
    <div>
      {dynamicMedicineCount?.map((item: any, idx: number) => (
        <Card className="p-2 rounded-md mb-5" key={item.content}>
          <div className="p-2 relative">
            <div className="flex justify-between items-center gap-2 w-full">
              <div className="w-full">
                <label className="font-semibold text-xs">Medicine</label>
                <ReactSelectCompo
                  name={`medicine-${item.content}`}
                  options={medicineOptions}
                  control={form.control}
                  showSelectedBox={false}
                />
              </div>
            </div>

            {/* Timing Sets */}
            {Array.from({ length: timingCounts[item.content] || 1 }).map(
              (_, idx2) => {
                const count = idx2 + 1;
                return (
                  <div
                    className="grid grid-cols-4 justify-between items-center gap-2 mt-4"
                    key={`${item.content}-${count}`}
                  >
                    {["Duration", "Dosage", "Time", "Comment"].map((label) => {
                      const fieldName = `${count}-${label.toLowerCase()}-${item.content}`;
                      return (
                        <div key={label}>
                          <label className="text-xs font-semibold">
                            {label}
                          </label>
                          {label === "Duration" && (
                            <BaseInput
                              name={fieldName}
                              placeholder="Ex: Take after meal"
                              classname="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2 "
                            />
                          )}
                          {label === "Dosage" && (
                            <ReactSelectCompo
                              name={fieldName}
                              options={dosageOptions}
                              control={form.control}
                              showSelectedBox={false}
                            />
                          )}
                          {label === "Time" && (
                            <ReactSelectCompo
                              name={fieldName}
                              options={timeOptions}
                              control={form.control}
                              showSelectedBox={false}
                            />
                          )}
                          {label === "Comment" && (
                            <BaseInput
                              name={fieldName}
                              placeholder="Ex: Take after meal"
                              classname="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2 "
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              }
            )}

            <div className="flex justify-between items-center mt-4 w-full">
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => addTimingSet(item.content)}
                  className="text-xs bg-brand text-white px-2 py-1 rounded"
                >
                  + Add Timing Set
                </button>
                {type === "create" && (
                  <button
                    type="button"
                    onClick={() => removeTimingSet(item.content)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                  >
                    - Remove Timing Set
                  </button>
                )}
              </div>

              {/* Remove Medicine */}
              <div
                onClick={() => {
                  handleRemoveMedicineInput(item.content);
                  const allKeys = Object.keys(form.getValues());
                  allKeys.forEach((key) => {
                    if (
                      key.endsWith(`-${item.content}`) ||
                      key.startsWith(`${item.content}-`)
                    ) {
                      form.unregister(key);
                    }
                  });
                }}
                className="contain-paint cursor-pointer bg-[#F44336] rounded-full flex justify-center items-center absolute -top-4 -right-4"
              >
                <X className="text-white size-5" />
              </div>

              {medicineInputCount.length - 1 === idx && (
                <div
                  onClick={handleAddMedicineInput}
                  className="contain-paint cursor-pointer rounded-sm flex justify-center items-center border border-gray-200 bg-gray-50 p-1 shadow-sm"
                >
                  <span className="text-xs">Add another Medicine</span>
                  <Plus size={16} />
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MedicineForm;
