/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetPatientSummaryQuery } from "@/redux/api/patient-summary/patient-summary";
import { Users } from "lucide-react";
import StatCard from "../_component/StatCard";
import PatientPercentageCard from "../_component/PatientPerchantageCard";
import PaymentCard from "../_component/PaymentCard";
import PatientChart from "../_component/PatientChart";
import { useGetPatientQuery } from "@/redux/api/patient/patient";
import TodayAppointments from "../_component/TodayAppointment";

const DoctorDashboard = () => {
  const today = new Date().toISOString().split("T")[0];
  const { data: patientSummaryData, isLoading: isPatientSummaryLoading } =
    useGetPatientSummaryQuery({});
  const { data: patientApiData, isLoading: isPatientLoading } =
    useGetPatientQuery({
      filter: JSON.stringify({
        createdAt: today,
      }),
    });

  const appointmentData =
    patientApiData?.data?.data?.map((patient: any, index: number) => ({
      sn: index + 1,
      name: patient.name,
      phone: patient.phoneNumber,
      status: patient.visitStatus || "Unknown",
    })) || [];

  if (isPatientSummaryLoading || isPatientLoading) return <div>Loading...</div>;

  return (
    <div>
      <main className="flex-1 p-6 mt-4 sm:mt-2 overflow-auto">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 lg:p-6 rounded-sm">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src="/placeholder.svg?height=64&width=64"
                alt="Dr. Stven N Carter"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome To DR. Stven N Carter
              </h2>
              <p className="text-gray-600">Have a nice day at work</p>
            </div>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded transform rotate-45"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Appointment's"
            value={patientSummaryData?.data?.totalPatients || 0}
            icon={Users}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
            bgIconColor="bg-blue-400"
            subtitleColor="text-blue-100"
          />

          <StatCard
            title="Today's Appointment"
            value={patientSummaryData?.data?.todaysPatients || 0}
            icon={Users}
            gradientFrom="from-red-500"
            gradientTo="to-red-600"
            bgIconColor="bg-red-400"
            subtitleColor="text-red-100"
          />

          <StatCard
            title="Monthly Appointment"
            value={patientSummaryData?.data?.monthlyPatients || 0}
            icon={Users}
            gradientFrom="from-orange-500"
            gradientTo="to-orange-600"
            bgIconColor="bg-orange-400"
            subtitleColor="text-orange-100"
          />
        </div>

        {/* Patient Summary */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Patient Summary January 2025
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Patient Percentage */}
            <PatientPercentageCard
              daily={patientSummaryData?.data?.dailyStatus}
              weekly={patientSummaryData?.data?.weeklyStatus}
              monthly={patientSummaryData?.data?.monthlyStatus}
            />

            {/* Payment */}
            <PaymentCard
              daily={patientSummaryData?.data?.dailyAmount}
              weekly={patientSummaryData?.data?.weeklyAmount}
              monthly={patientSummaryData?.data?.monthlyAmount}
            />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <PatientChart
              yearlyStatus={patientSummaryData?.data?.yearlyStatus}
            />

            {/* Today's Appointments */}
            <TodayAppointments appointments={appointmentData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
