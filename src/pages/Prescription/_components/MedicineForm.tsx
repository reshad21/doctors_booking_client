/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import ReactSelectCompo from "./ReactSelectCompo";
import BaseInput from "@/components/shared/BaseInput";
import { Plus, X } from "lucide-react";
import Advice from "./Advice";

const MedicineForm = ({
  form,
  onSubmit,
  medicineInputCount,
  timingCounts,
  medicineOptions,
  dosageOptions,
  timeOptions,
  addTimingSet,
  removeTimingSet,
  handleRemoveMedicineInput,
  handleAddMedicineInput,
  handleAdviceSave,
  handleAdviceSaveInput,
}: any) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {medicineInputCount.map((item: any, idx: number) => {
          if (!timingCounts[item.content]) {
            timingCounts[item.content] = 1;
          }

          return (
            <Card className="p-2 rounded-md" key={idx}>
              <div className="p-2 relative">
                <div className="flex justify-between items-center gap-2 w-full ">
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

                {/* Timing Sets (Dynamic) */}
                {Array.from({ length: timingCounts[item.content] }).map(
                  (_, index) => {
                    const count = index + 1;
                    return (
                      <div
                        className="grid grid-cols-4 justify-between items-center gap-2 mt-4"
                        key={`${item.content}-${count}`}
                      >
                        {["Duration", "Doges", "Time", "Comment"].map(
                          (label: string) => (
                            <div key={label}>
                              <label className="text-xs font-semibold">
                                {label}
                              </label>

                              {label === "Duration" && (
                                <BaseInput
                                  name={`${count}-${label.toLowerCase()}-${item.content}`}
                                  placeholder="Ex: Take after meal"
                                  classname="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2 "
                                />
                              )}
                              {label === "Doges" && (
                                <ReactSelectCompo
                                  name={`${count}-${label.toLowerCase()}-${item.content}`}
                                  options={dosageOptions}
                                  control={form.control}
                                  showSelectedBox={false}
                                />
                              )}
                              {label === "Time" && (
                                <ReactSelectCompo
                                  name={`${count}-${label.toLowerCase()}-${item.content}`}
                                  options={timeOptions}
                                  control={form.control}
                                  showSelectedBox={false}
                                />
                              )}
                              {label === "Comment" && (
                                <BaseInput
                                  name={`${count}-${label.toLowerCase()}-${item.content}`}
                                  placeholder="Ex: Take after meal"
                                  classname="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2 "
                                />
                              )}
                            </div>
                          )
                        )}
                      </div>
                    );
                  }
                )}
                <div className="flex justify-between items-center mt-4 w-full ">
                  {/* Add/Remove Medicine Buttons */}
                  <div className="w-full flex justify-between items-center gap-2  mt-2">
                    {/* Add/Remove Timing Set Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => addTimingSet(item.content)}
                        className="text-xs bg-brand text-white px-2 py-1 rounded"
                      >
                        + Add Timing Set
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTimingSet(item.content)}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                      >
                        - Remove Timing Set
                      </button>
                    </div>

                    {medicineInputCount.length - 1 !== idx && (
                      <div
                        onClick={() => handleRemoveMedicineInput(item.content)}
                        className="contain-paint cursor-pointer bg-[#F44336] rounded-full flex justify-center items-center absolute -top-4 -right-4"
                      >
                        <X className="text-white size-5" />
                      </div>
                    )}
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
              </div>
            </Card>
          );
        })}

        {/* Next Visit */}
        <div className="w-full flex-1 gap-2">
          <label className="font-semibold text-xs w-full">Next Visit</label>
          <BaseInput
            name="nxVisit"
            placeholder="Ex: 20 days"
            classname="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2 flex-1"
          />
        </div>

        {/* Advice */}
        <Advice
          onSaveAdvice={handleAdviceSave}
          handleAdviceSaveInput={handleAdviceSaveInput}
          initialContent=""
        />

        {/* Save / Cancel */}
        <div className="flex justify-start items-start gap-4 max-w-sm">
          <button
            type="submit"
            className="bg-brand font-semibold text-xs text-white px-5 py-2 rounded-sm"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-[#FB160A] text-xs text-white px-5 py-2 rounded-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </Form>
  );
};

export default MedicineForm;
