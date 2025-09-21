import { Pill, FileText, Stethoscope, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const PreManagement = () => {
  const preManagementPaths = [
    {
      name: "Medicine",
      path: "/dashboard/pre-management/medicine",
      icon: <Pill />,
    },
    {
      name: "Prescription Templates",
      path: "/dashboard/pre-management/prescription-templates",
      icon: <FileText />,
    },
    {
      name: "Clinical Notes",
      path: "/dashboard/pre-management/clinical-notes",
      icon: <Stethoscope />,
    },
    {
      name: "Prescription Page",
      path: "/dashboard/pre-management/prescription-page-setup",
      icon: <ClipboardList />,
    },
  ];

  return (
    <div className="custom-container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
        {preManagementPaths.map((item, index) => (
          <Link to={item.path}
            key={index}
            className="bg-white border group border-green-400 shadow-md hover:shadow-md hover:bg-green-600 hover:border-green-200 cursor-pointer transition-all duration-200 ease-in-out rounded-lg group"
          >
            <div className="p-6 flex flex-col items-center text-center space-y-3">
              <div className="text-gray-600 group-hover:text-white transition-colors duration-200">
                {item.icon}
              </div>
              <h2 className="text-lg font-medium text-gray-800 group-hover:text-white transition-colors duration-200">
                {item.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PreManagement;
