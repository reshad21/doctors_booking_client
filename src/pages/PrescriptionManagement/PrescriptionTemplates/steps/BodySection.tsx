import React from "react";

const BodySection: React.FC = () => {
  return (
    <div className="min-h-[400px] flex flex-col justify-center items-center">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Body Section
        </h3>
        <p className="text-gray-600 mb-6">
          Configure the main prescription content layout
        </p>
        <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">
            Body Section content will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
};

export default BodySection;
