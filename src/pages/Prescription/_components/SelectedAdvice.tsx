/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAdviceQuery } from "@/redux/api/advice/advice";
import { useGetExtraAdviceQuery } from "@/redux/api/prescription/prescription";
const SelectedAdvice = ({
  handleSelectAdvice,
  handleExtraSelectAdvice,
  handleSave,
  handleExtraSelectAdviceInput,
  open
}: any) => {
  const {data:disease} = useGetAdviceQuery(undefined)
  const {data:extraAdvice} = useGetExtraAdviceQuery(undefined)

  console.log(extraAdvice, "extraAdvice")
  return (
    <div className="mb-4 w-1/2">
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
          {extraAdvice?.data?.map((opt:any, idx:any) => (
            <option key={idx} value={opt?.content}>
              {opt?.content?.match(/<li>(.*?)<\/li>/)[1] && opt?.content?.match(/<li>(.*?)<\/li>/)[1]}
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
        className={`text-white text-xs px-4 py-2 mt-2 rounded-sm ${open == false? "bg-brand" : "bg-gray-200"}`}
        disabled={open}
      >
        Save (Optional)
      </button>
    </div>
  );
};

export default SelectedAdvice;
