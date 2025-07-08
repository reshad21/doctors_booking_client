/* eslint-disable @typescript-eslint/no-explicit-any */
import prHead from "@/assets/pr-head.png";
import { Form } from "@/components/ui/form";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Prescription = () => {
  const [testInputCount, setTestInputCount] = useState([{ content: 1 }]);
  const [medicineInputCount, setMedicineInputCount] = useState([{ content: 1 }]);
  const form = useForm();

  const handleAddTestInput = () => {
    setTestInputCount((prev) => [...prev, { content: prev.length + 1 }]);
  };
  const handleRemoveTestInput = (contentToDelete: number) => {
  setTestInputCount((prev) => prev.filter((item) => item.content !== contentToDelete));
};
  const handleAddMedicineInput = () => {
    setMedicineInputCount((prev) => [...prev, { content: prev.length + 1 }]);
  };

  const onSubmit = async (data: any) => {
    // Build medicine array
    const medicineArray = medicineInputCount.map((item) => {
      const key = item.content;
      return {
        medicine: data[`medicine${key}`],
        dosage: data[`dosage${key}`],
        day: data[`day${key}`],
        time: data[`time${key}`],
        comment: data[`comment${key}`],
      };
    });
    const cleanedData = { ...data };
    medicineInputCount.forEach((item) => {
      const key = item.content;
      delete cleanedData[`medicine${key}`];
      delete cleanedData[`dosage${key}`];
      delete cleanedData[`day${key}`];
      delete cleanedData[`time${key}`];
      delete cleanedData[`comment${key}`];
    });

    cleanedData.medicine = medicineArray;

    console.log("Final data:", cleanedData);
  };

  return (
    <div className="customContainer mt-[30px]">
      <div className="p-5 bg-white">
        <div className="pb-[30px]">
          <img src={prHead} alt="" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center w-full">
              {["name", "age", "date", "Id"].map((item) => (
                <div className="w-[48%] sm:w-[22%] min-w-[150px]" key={item}>
                  <div className="flex items-center gap-2">
                    <label className="font-semibold text-xs">{item}</label>
                    <input
                      {...form.register(item, { required: true })}
                      className="border-b border-dashed w-full focus:outline-none focus:border-b focus:border-dashed"
                    />
                  </div>
                </div>
              ))}
            </div>

            {testInputCount.map((item, index) => (
              <div key={index}>
                <label className="font-semibold text-xs">Test {item.content}</label>
                <div className="flex justify-start items-center gap-2">
                  <textarea
                    {...form.register(`test${item.content}`, { required: true })}
                    className="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2"
                    placeholder="Text here..."
                  />
                  {testInputCount.length - 1 != index && (
                    <div onClick={() => handleRemoveTestInput(item.content)} className="contain-paint cursor-pointer w-[30px] h-[30px] bg-[#F44336] rounded-sm flex justify-center items-center">
                      <Trash className=" h-[20px] w-[20px] text-white " />
                    </div>
                  )}
                  {testInputCount.length - 1 === index && (
                    <div onClick={handleAddTestInput} className="contain-paint cursor-pointer">
                      <Plus className="bg-[#14400D] w-[30px] h-[30px] text-white rounded-sm" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {medicineInputCount.map((item, idx) => (
              <div className="flex justify-between items-center gap-2">
              <div key={idx} className="grid grid-cols-8 gap-4 mb-4">
                <div className="flex col-span-5 justify-between gap-4 items-start">
                  {["Medicine", "Dosage", "Day", "Time"].map((label, i) => (
                    <div key={i} className="flex flex-col gap-2 w-full">
                      <label className="font-semibold text-xs">{label}</label>
                      <input
                        {...form.register(`${label.toLowerCase()}${item.content}`, {
                          required: true,
                        })}
                        type="text"
                        className="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2"
                        placeholder={`Enter ${label}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-start items-start gap-2 col-span-3">
                  <label className="font-semibold text-xs">Comment</label>
                  <input
                    {...form.register(`comment${item.content}`, { required: true })}
                    type="text"
                    className="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2"
                    placeholder="Ex: Take after meal"
                  />
                </div>
              </div>

              {medicineInputCount.length - 1 == idx && (
                    <div onClick={handleAddMedicineInput} className="contain-paint cursor-pointer">
                      <Plus className="bg-[#14400D] w-[30px] h-[30px] text-white rounded-sm" />
                    </div>
                  )}

              </div>
            ))}

            <div className="flex flex-col justify-start items-start gap-2">
              <h5 className="font-semibold text-xs">Advice</h5>
              <textarea
                {...form.register("advice", { required: true })}
                className="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2"
                placeholder="Text here..."
              />
            </div>

            <div className="flex flex-col justify-start items-start gap-2">
              <label className="font-semibold text-xs">Next Visit</label>
              <input
                {...form.register("nxVisit", { required: true })}
                type="text"
                className="w-full rounded-sm border border-gray-300 bg-[#FDFDFF] p-2"
                placeholder="Ex: 20 days"
              />
            </div>

            <hr  className="text-gray-300"/>
            <div className="flex justify-start items-start gap-4 max-w-sm">
              <button
              type="submit"
              className="bg-brand font-semibold text-xs text-white px-5 py-2 rounded-sm"
            >
              Save
            </button>
            <button
              className="bg-[#FB160A]  text-xs text-white px-5 py-2 rounded-sm"
            >
              Cancel
            </button>
            </div>
          </form>
        </Form>
        <div className="pt-[30px]">
          <img src={prHead} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Prescription;
