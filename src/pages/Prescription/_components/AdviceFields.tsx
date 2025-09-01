import { useFormContext } from "react-hook-form";
import { useGetAdviceQuery, useCreateAdviceMutation } from "@/redux/api/advice/advice";
import ReactSelectCompo from "./ReactSelectCompo";
import { InputOptions, CreateAdviceFn } from "./CreateFn";
import toast from "react-hot-toast";

interface AdviceFieldProps {
    className?: string;
}

const AdviceField = ({
    className = ""
}: AdviceFieldProps) => {
    const { control, getValues, setValue } = useFormContext();
    const { data: advice } = useGetAdviceQuery({ limit: 200 });
    const [createAdvice] = useCreateAdviceMutation();
    const adviceOptions = InputOptions(advice, "advice") || [];

    const handleSaveAdvice = async (inputValue: string) => {
        try {
            await CreateAdviceFn(inputValue, createAdvice);
            const prev = getValues("advice") || [];
            setValue("advice", [...prev, inputValue]);
        } catch (error) {
            toast.error("Failed to save advice");
            console.error("Error saving advice:", error);
        }
    };

    return (
        <div className={className}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-5 bg-orange-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-gray-900">
                    Patient Advice
                </h4>
            </div>
            <ReactSelectCompo
                label=""
                name="advice"
                options={adviceOptions}
                control={control}
                isMulti
                showSelectedBox
                onCreateOption={handleSaveAdvice}
            />
        </div>
    );
};

export default AdviceField;