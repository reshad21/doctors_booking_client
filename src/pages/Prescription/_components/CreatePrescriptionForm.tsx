/* eslint-disable @typescript-eslint/no-explicit-any */
// export default CreatePrescriptionForm;
import ReactSelectCompo from "./ReactSelectCompo";
import Advice from "./Advice";
import { Form } from "@/components/ui/form";
import { Plus, Trash, X } from "lucide-react";
import BaseInput from "@/components/shared/BaseInput";
import BaseSelect from "@/components/shared/BaseSelect";

type OptionType = {
  value: string;
  label: string;
};

// Options data
const sportsOptions: OptionType[] = [
  { value: "cricket", label: "Cricket" },
  { value: "football", label: "Football" },
  { value: "tennis", label: "Tennis" },
];

const foodOptions: OptionType[] = [
  { value: "pizza", label: "Pizza" },
  { value: "burger", label: "Burger" },
  { value: "pasta", label: "Pasta" },
];

const hobbyOptions: OptionType[] = [
  { value: "reading", label: "Reading" },
  { value: "gaming", label: "Gaming" },
  { value: "traveling", label: "Traveling" },
];

const languageOptions: OptionType[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "bengali", label: "Bengali" },
];

const medicineOptions: OptionType[] = [
  { value: "paracetamol", label: "Paracetamol" },
  { value: "ibuprofen", label: "Ibuprofen" },
  { value: "amoxicillin", label: "Amoxicillin" },
];

const dosageOptions = [
  { name: "১+১+১", value: "১+১+১" },
  { name: "১+১+০", value: "১+১+০" },
  { name: "১+০+১", value: "১+০+১" },
  { name: "০+১+১", value: "০+১+১" },
  { name: "০+০+১", value: "০+০+১" },
  { name: "১+০+০", value: "১+০+০" },
  { name: "০+১+০", value: "০+১+০" },
];

const timeOptions = [
  { name: "খাবার আগে", value: "খাবার আগে" },
  { name: "খাবার পরে", value: "খাবার পরে" },
];

const CreatePrescriptionForm = ({
  form,
  onSubmit,
  patient,
  handleAdviceChange,
  medicineInputCount,
  handleRemoveMedicineInput,
  handleAddMedicineInput,
  handleAdviceInputChange,
}: any) => {
  const handleAdviceSave = (value: string) => {
    handleAdviceChange(value);
  };

  const handleAdviceSaveInput = (value: string) => {
    handleAdviceInputChange(value);
  };

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Patient Info Section */}
      <div className="flex justify-between items-center w-full">
        {["name", "age", "date", "Id"].map((item) => (
          <div className="w-[48%] sm:w-[22%] min-w-[150px]" key={item}>
            <div className="flex items-center gap-2">
              <label className="font-semibold text-xs">{item}</label>
              <span className="border-b border-dashed w-full">
                {item === "name" && patient?.patient?.name}
                {item === "age" && patient?.patient?.age}
                {item === "date" && "2323"}
                {item === "Id" && (
                  <span className="text-[10px] bg-green-600 text-green-100 p-1 rounded-md">
                    generating
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Select Section */}
      <div>
        <div className="w-full grid grid-cols-2 gap-4">
          <ReactSelectCompo
            label="Sports"
            name="sports"
            options={sportsOptions}
            control={form.control}
            isMulti
            showSelectedBox
          />
          <ReactSelectCompo
            label="Foods"
            name="foods"
            options={foodOptions}
            control={form.control}
            isMulti
            showSelectedBox
          />
          <ReactSelectCompo
            label="Hobbies"
            name="hobbies"
            options={hobbyOptions}
            control={form.control}
            isMulti
            showSelectedBox
          />
          <ReactSelectCompo
            label="Languages"
            name="languages"
            options={languageOptions}
            control={form.control}
            isMulti
            showSelectedBox
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <hr className="text-gray-400 w-[50%]" />
        <X size={15} className="text-gray-400" />
        <hr className="text-gray-400 w-[50%]" />
      </div>

      {/* Medicine Form Section */}
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {medicineInputCount.map((item: any, idx: number) => (
              <div
                className="flex justify-between items-center gap-2"
                key={idx}
              >
                <div className="grid grid-cols-17 gap-4 mb-4">
                  <div className="grid grid-cols-13 col-span-13 justify-between gap-4 items-start">
                    {["Medicine", "Dosage", "Day", "Time"].map((label, i) => (
                      <div key={i} className={`flex flex-col gap-2 w-full ${label == "Medicine" ? "col-span-4" : "col-span-3"}`}>
                        <label className="font-semibold text-xs">{label}</label>
                        {label === "Medicine" && (
                          <ReactSelectCompo
                            name={`${label.toLowerCase()}${item.content}`}
                            options={medicineOptions}
                            control={form.control}
                            showSelectedBox={false}
                          />
                        )}
                        {label === "Dosage" && (
                          <BaseSelect
                            name={`${label.toLowerCase()}${item.content}`}
                            options={dosageOptions}
                            className="w-full text-sm"
                          />
                        )}
                        {label === "Day" && (
                          <BaseInput
                            name={`${label.toLowerCase()}${item.content}`}
                            placeholder={`Enter ${label}`}
                            classname="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2 text-sm"
                          />
                        )}
                        {label === "Time" && (
                          <BaseSelect
                            name={`${label.toLowerCase()}${item.content}`}
                            options={timeOptions}
                            className="w-full text-sm"
                          />
                        )}
                        
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col justify-start items-start gap-2 col-span-4">
                    <label className="font-semibold text-xs">Comment</label>
                    <BaseInput
                      name={`comment${item.content}`}
                      placeholder="Ex: Take after meal"
                      classname="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2"
                    />
                  </div>
                </div>
                {medicineInputCount.length - 1 !== idx && (
                  <div
                    onClick={() => handleRemoveMedicineInput(item.content)}
                    className="contain-paint cursor-pointer w-[30px] h-[30px] bg-[#F44336] rounded-sm flex justify-center items-center"
                  >
                    <Trash className="h-[20px] w-[20px] text-white" />
                  </div>
                )}
                {medicineInputCount.length - 1 === idx && (
                  <div
                    onClick={handleAddMedicineInput}
                    className="contain-paint cursor-pointer"
                  >
                    <Plus className="bg-[#14400D] w-[30px] h-[30px] text-white rounded-sm" />
                  </div>
                )}
              </div>
            ))}

            <div className="w-full flex-1 gap-2">
              <label className="font-semibold text-xs w-full">Next Visit</label>
              <BaseInput
                name="nxVisit"
                placeholder="Ex: 20 days"
                classname="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2 flex-1"
              />
            </div>

            <Advice
              onSaveAdvice={handleAdviceSave}
              handleAdviceSaveInput={handleAdviceSaveInput}
              initialContent=""
            />

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
      </div>
    </div>
  );
};

export default CreatePrescriptionForm;
