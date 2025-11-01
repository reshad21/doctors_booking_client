import Breadcrumb from "@/components/shared/BreadCrumb";
import { Card } from "@/components/ui/card";
import {
  ClipboardList,
  RepeatIcon,
  Stethoscope,
  FileText,
  Activity,
  Lightbulb,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import ClinicalNotesOrdering from "./ClinicalNotesOrdering";

const ClinicalNotes = () => {
  const breadcrumbItems = [
    {
      label: "Pre Management",
      icon: <RepeatIcon className="h-4 w-4" />,
      to: "/dashboard/pre-management",
    },
    { label: "Clinical Notes", icon: <ClipboardList className="h-4 w-4" /> },
  ];

  const leftSectionCards = [
    {
      title: "Chief Complaint",
      description: "Primary symptoms",
      icon: ClipboardList,
      to: "/dashboard/pre-management/clinical-notes/chief-complaint-input",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      hoverBorder: "hover:border-blue-400",
    },
    {
      title: "On Examinations",
      description: "Physical findings",
      icon: Stethoscope,
      to: "/dashboard/pre-management/clinical-notes/on-examinations-input",
      bgGradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      hoverBorder: "hover:border-emerald-400",
    },
    {
      title: "Diagnosis",
      description: "Clinical assessment",
      icon: Activity,
      to: "/dashboard/pre-management/clinical-notes/diagnosis-input",
      bgGradient: "from-amber-50 to-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      hoverBorder: "hover:border-amber-400",
    },
    {
      title: "Investigation",
      description: "Diagnostic tests",
      icon: Activity,
      to: "/dashboard/pre-management/clinical-notes/investigation-input",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      hoverBorder: "hover:border-purple-400",
    },
    {
      title: "History",
      description: "Medical background",
      icon: FileText,
      to: "/dashboard/pre-management/clinical-notes/history-input",
      bgGradient: "from-pink-50 to-pink-100",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      borderColor: "border-pink-200",
      hoverBorder: "hover:border-pink-400",
    },
    {
      title: "Co-Morbidities",
      description: "Additional conditions",
      icon: Activity,
      to: "/dashboard/pre-management/clinical-notes/co-morbidities-input",
      bgGradient: "from-cyan-50 to-cyan-100",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      borderColor: "border-cyan-200",
      hoverBorder: "hover:border-cyan-400",
    },
    {
      title: "Treatment Plan",
      description: "Therapeutic approach",
      icon: Activity,
      to: "/dashboard/pre-management/clinical-notes/treatment-plan-input",
      bgGradient: "from-teal-50 to-teal-100",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      borderColor: "border-teal-200",
      hoverBorder: "hover:border-teal-400",
    },
  ];

  const rightSectionCards = [
    {
      title: "Advice",
      description: "Treatment plan",
      icon: Lightbulb,
      to: "/dashboard/pre-management/clinical-notes/advice-input",
      bgGradient: "from-indigo-50 to-indigo-100",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      hoverBorder: "hover:border-indigo-400",
    },
    {
      title: "Next Visit",
      description: "Follow-up schedule",
      icon: Calendar,
      to: "/dashboard/pre-management/clinical-notes/next-visit-input",
      bgGradient: "from-rose-50 to-rose-100",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      borderColor: "border-rose-200",
      hoverBorder: "hover:border-rose-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-3 sm:py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header Section */}
        <div className="mt-6 mb-6 sm:mt-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Clinical Notes Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Organize and manage patient clinical documentation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Patient Assessment
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {leftSectionCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Link key={index} to={card.to} className="group">
                    <Card
                      className={`h-full min-h-[140px] p-4 sm:p-5 cursor-pointer transition-all duration-300 bg-gradient-to-br ${card.bgGradient} border-2 ${card.borderColor} rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.02] ${card.hoverBorder} group-hover:-translate-y-1`}
                    >
                      <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start gap-3 mb-2">
                          <div
                            className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 leading-tight group-hover:text-gray-700 transition-colors line-clamp-2">
                              {card.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 leading-snug line-clamp-1">
                              {card.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div
                            className={`inline-flex items-center text-xs font-medium ${card.iconColor} group-hover:gap-2 gap-1 transition-all`}
                          >
                            <span>Enter details</span>
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-10 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full"></div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Treatment & Follow-up
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {rightSectionCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Link key={index} to={card.to} className="group">
                    <Card
                      className={`h-full min-h-[140px] p-4 sm:p-5 cursor-pointer transition-all duration-300 bg-gradient-to-br ${card.bgGradient} border-2 ${card.borderColor} rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.02] ${card.hoverBorder} group-hover:-translate-y-1`}
                    >
                      <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start gap-3 mb-2">
                          <div
                            className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 leading-tight group-hover:text-gray-700 transition-colors line-clamp-2">
                              {card.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 leading-snug line-clamp-1">
                              {card.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div
                            className={`inline-flex items-center text-xs font-medium ${card.iconColor} group-hover:gap-2 gap-1 transition-all`}
                          >
                            <span>Enter details</span>
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <ClinicalNotesOrdering />
      </div>
    </div>
  );
};

export default ClinicalNotes;
