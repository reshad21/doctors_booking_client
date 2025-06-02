import { Input } from "../ui/input";

interface BaseInputProps {
  placeholder?: string;
  title?: string;
}

const BaseInput = ({ placeholder, title }: BaseInputProps) => {
  return (
    <div>
      {title && (
        <label className="text-[#5A5A5A] text-sm font-medium text-[16px] mb-2 block">{title}</label>
      )}
      <Input
        className="border-[#A0B19E] rounded-[4px] h-12 border text-[#5F597480]"
        placeholder={placeholder || "Text"}
      />
    </div>
  );
};

export default BaseInput;
