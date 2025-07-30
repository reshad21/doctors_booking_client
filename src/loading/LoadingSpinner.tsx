
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <span className="ml-3 text-blue-500 font-medium">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
