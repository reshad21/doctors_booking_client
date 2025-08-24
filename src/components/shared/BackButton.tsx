import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  label?: string;
}

const BackButton = ({ className = "", label = "Back" }: BackButtonProps) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm ${className}`}
    >
      <ChevronLeft className="size-4" />
      {label}
    </button>
  );
};

export default BackButton;
