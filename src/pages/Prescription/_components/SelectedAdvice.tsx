import { useGetAdviceQuery } from "@/redux/api/advice/advice";

/* eslint-disable @typescript-eslint/no-explicit-any */
const OptionalAdviceDviceOptions = [
  "Drink plenty of water. jne na ",
  "Take rest regularly. jne na ",
  "Exercise daily.",
  "Avoid junk food.",
];
const SelectedAdvice = ({
  handleSelectAdvice,
  handleExtraSelectAdvice,
  handleSave,
  handleExtraSelectAdviceInput
}: any) => {
  const {data:disease} = useGetAdviceQuery(undefined)

  return (
    <div className="mb-4 w-1/2">
      <div className="mb-4 w-full">
        <label className="block text-sm mb-1 font-semibold text-gray-700">
          Select Advice
        </label>
        <select
          onChange={handleSelectAdvice}
          defaultValue=""
          className="w-full rounded-md border border-gray-300 bg-[#FDFDFF] px-4 py-3 text-sm "
        >
          <option value="" disabled>
            Select advice...
          </option>
          {OptionalAdviceDviceOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 w-full">
        <label className="block text-sm mb-1 font-semibold text-gray-700">
          Select Advice
        </label>
        <select
          onChange={handleExtraSelectAdvice}
          defaultValue=""
          className="w-full rounded-md border border-gray-300 bg-[#FDFDFF] px-4 py-3 text-sm focus:border-brand"
        >
          <option value="" disabled>
            Select advice...
          </option>
          {disease?.data?.map((opt:any, idx:any) => (
            <option key={idx} value={opt?.content}>
              {opt?.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 w-full">
        <label className="block text-sm mb-1 font-semibold text-gray-700">
          Optional Advice
        </label>
       <input  onChange={handleExtraSelectAdviceInput}
          defaultValue=""
          placeholder="Write your advice"
          className="w-full rounded-md border border-gray-300 bg-[#FDFDFF] px-4 py-3 text-sm focus:border-brand"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="bg-brand text-white text-xs px-4 py-2 mt-2 rounded-sm"
      >
        Save Optional
      </button>
    </div>
  );
};

export default SelectedAdvice;
