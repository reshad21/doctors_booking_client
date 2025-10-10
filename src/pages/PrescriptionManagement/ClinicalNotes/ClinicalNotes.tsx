import Breadcrumb from "@/components/shared/BreadCrumb";
import { Card } from "@/components/ui/card";
import { ClipboardList, RepeatIcon } from "lucide-react";
import { Link } from "react-router-dom";

const ClinicalNotes = () => {
  const breadcrumbItems = [
    {
      label: "Pre Management",
      icon: <RepeatIcon className="h-4 w-4" />,
      to: "/dashboard/pre-management",
    },
    { label: "Clinical Notes", icon: <ClipboardList className="h-4 w-4" /> },
  ];
  return (
    <div className="custom-container flex-col !pt-5">
      <Breadcrumb items={breadcrumbItems} />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 mt-10">
            Clinical Notes Left Section
          </h1>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 bg-slate-200 p-4 rounded-2xl">
            <Link
              to="/dashboard/pre-management/clinical-notes/chief-complaint-input"
              className="group"
            >
              <Card className="p-6 mb-4 cursor-pointer transition-all duration-300 bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl shadow hover:shadow-xl hover:scale-105 group-hover:border-blue-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition">
                    <ClipboardList className="w-6 h-6" />
                  </span>
                  <h1 className="text-lg font-semibold text-blue-800 group-hover:text-blue-900 transition">
                    Chief Complaint
                  </h1>
                </div>
                <p className="text-sm text-blue-700 opacity-80">
                  Enter the chief complaint value
                </p>
              </Card>
            </Link>

            <Link
              to="/dashboard/pre-management/clinical-notes/on-examinations-input"
              className="group"
            >
              <Card className="p-6 mb-4 cursor-pointer transition-all duration-300 bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl shadow hover:shadow-xl hover:scale-105 group-hover:border-green-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 group-hover:bg-green-200 transition">
                    <ClipboardList className="w-6 h-6" />
                  </span>
                  <h1 className="text-lg font-semibold text-green-800 group-hover:text-green-900 transition">
                    On Examinations Input
                  </h1>
                </div>
                <p className="text-sm text-green-700 opacity-80">
                  Enter the on examinations value
                </p>
              </Card>
            </Link>

            <Link
              to="/dashboard/pre-management/clinical-notes/diagnosis-input"
              className="group"
            >
              <Card className="p-6 mb-4 cursor-pointer transition-all duration-300 bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 rounded-xl shadow hover:shadow-xl hover:scale-105 group-hover:border-yellow-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200 transition">
                    <ClipboardList className="w-6 h-6" />
                  </span>
                  <h1 className="text-lg font-semibold text-yellow-800 group-hover:text-yellow-900 transition">
                    Diagnosis Input
                  </h1>
                </div>
                <p className="text-sm text-yellow-700 opacity-80">
                  Enter the diagnosis value
                </p>
              </Card>
            </Link>

            <Link
              to="/dashboard/pre-management/clinical-notes/investigation-input"
              className="group"
            >
              <Card className="p-6 mb-4 cursor-pointer transition-all duration-300 bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl shadow hover:shadow-xl hover:scale-105 group-hover:border-purple-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition">
                    <ClipboardList className="w-6 h-6" />
                  </span>
                  <h1 className="text-lg font-semibold text-purple-800 group-hover:text-purple-900 transition">
                    Investigation Input
                  </h1>
                </div>
                <p className="text-sm text-purple-700 opacity-80">
                  Enter the investigation value
                </p>
              </Card>
            </Link>

            <Link
              to="/dashboard/pre-management/clinical-notes/history-input"
              className="group"
            >
              <Card className="p-6 mb-4 cursor-pointer transition-all duration-300 bg-gradient-to-br from-pink-50 to-white border border-pink-200 rounded-xl shadow hover:shadow-xl hover:scale-105 group-hover:border-pink-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-600 group-hover:bg-pink-200 transition">
                    <ClipboardList className="w-6 h-6" />
                  </span>
                  <h1 className="text-lg font-semibold text-pink-800 group-hover:text-pink-900 transition">
                    History Input
                  </h1>
                </div>
                <p className="text-sm text-pink-700 opacity-80">
                  Enter the history value
                </p>
              </Card>
            </Link>
          </div>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800 mt-10">
            Clinical Notes Right Section
          </h1>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 bg-slate-200 p-4 rounded-2xl">
            <Link
              to="/dashboard/pre-management/clinical-notes/advice-input"
              className="group"
            >
              <Card className="p-6 mb-4 cursor-pointer transition-all duration-300 bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-xl shadow hover:shadow-xl hover:scale-105 group-hover:border-indigo-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition">
                    <ClipboardList className="w-6 h-6" />
                  </span>
                  <h1 className="text-lg font-semibold text-indigo-800 group-hover:text-indigo-900 transition">
                    Advice Input
                  </h1>
                </div>
                <p className="text-sm text-indigo-700 opacity-80">
                  Enter the advice value
                </p>
              </Card>
            </Link>

            <Link
              to="/dashboard/pre-management/clinical-notes/next-visit-input"
              className="group"
            >
              <Card className="p-6 mb-4 cursor-pointer transition-all duration-300 bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-xl shadow hover:shadow-xl hover:scale-105 group-hover:border-red-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 group-hover:bg-red-200 transition">
                    <ClipboardList className="w-6 h-6" />
                  </span>
                  <h1 className="text-lg font-semibold text-red-800 group-hover:text-red-900 transition">
                    Next Visit Input
                  </h1>
                </div>
                <p className="text-sm text-red-700 opacity-80">
                  Enter the next visit value
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotes;
