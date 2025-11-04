/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetPrescriptionByPatientIdQuery } from "@/redux/api/prescription/prescription";
import { Edit, Info, Calendar, FileText } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/shared/EmptyState";
import BackButton from "@/components/shared/BackButton";
import { useGetSinglePatientQuery } from "@/redux/api/patient/patient";
import LoadingSpinner from "@/loading/LoadingSpinner";

const PrescriptionList = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { data: prescriptions, isLoading: isPrescriptionsLoading } =
    useGetPrescriptionByPatientIdQuery(patientId);
  const { data: patientData, isLoading: isPatientLoading } =
    useGetSinglePatientQuery(patientId);

  if (isPrescriptionsLoading || isPatientLoading) {
    return <LoadingSpinner />;
  }

  const prescriptionList = prescriptions?.data || [];

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <BackButton className="shadow-none border-none hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-800 transition-colors" />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Prescription History
                </h1>
                {patientData?.data && (
                  <p className="text-sm text-slate-600">
                    {patientData.data.name} - {patientData.data.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {prescriptionList.length === 0 ? (
          <EmptyState
            icon={<Info className="w-full h-full" />}
            title="No Prescriptions Found"
            description="There are currently no prescriptions for this patient. Create a new prescription to get started."
            size="md"
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Prescription No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Medicines
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {prescriptionList.map((prescription: any) => (
                    <tr
                      key={prescription.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td 
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() => navigate(`/dashboard/update-prescription/${prescription.id}`)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-900">
                            {prescription.prescriptionNo || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() => navigate(`/dashboard/update-prescription/${prescription.id}`)}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <div className="text-sm text-slate-900">
                            <div>{formatDate(prescription.createdAt)}</div>
                            <div className="text-xs text-slate-500">
                              {formatTime(prescription.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td 
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => navigate(`/dashboard/update-prescription/${prescription.id}`)}
                      >
                        <div className="text-sm text-slate-900">
                          {prescription.medicines?.length > 0 ? (
                            <span>
                              {prescription.medicines.length}{" "}
                              {prescription.medicines.length === 1
                                ? "medicine"
                                : "medicines"}
                            </span>
                          ) : (
                            <span className="text-slate-400">No medicines</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/dashboard/update-prescription/${prescription.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionList;

