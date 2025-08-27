/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetPatientSummaryQuery } from "@/redux/api/patient-summary/patient-summary";
import { Users } from "lucide-react";
import StatCard from "../_component/StatCard";
import { useGetPatientQuery } from "@/redux/api/patient/patient";
import TodayAppointments from "../_component/TodayAppointment";
import { useAppSelector } from "@/redux/hooks";
import LoadingSpinner from "@/loading/LoadingSpinner";
import { useState } from "react";
import { useGetChambersQuery } from "@/redux/api/chamber/chamber";

const DoctorDashboard = () => {
  const [selectedChamber, setSelectedChamber] = useState("all");
  const { data: chambersData } = useGetChambersQuery({});

  const chambers = chambersData?.data?.map((item:any) =>({name:item?.name,id:item?.id}))
  
  const today = new Date().toISOString().split("T")[0];
  const { data: patientSummaryData, isLoading: isPatientSummaryLoading } =
    useGetPatientSummaryQuery({ chamberId: selectedChamber });
  const { data: patientApiData, isLoading: isPatientLoading } =
    useGetPatientQuery({
      filter: JSON.stringify({
          chamberId: selectedChamber == "all" ? {} : selectedChamber,
          createdAt: today,
          timezoneOffset: new Date().getTimezoneOffset()
        }),
      limit: 1000,
    });
  const doctor = useAppSelector((state) => state.admin);
  // console.log(doctor, "doctor");
  // console.log(patientApiData, "Patient api data");
  const appointmentData =
    patientApiData?.data?.data?.map((patient: any, index: number) => ({
      sn: index + 1,
      name: patient.name,
      phone: patient.phoneNumber,
      status: patient.visitStatus || "Unknown",
    })) || [];

  if (isPatientSummaryLoading || isPatientLoading) return <LoadingSpinner />;
  const handleChamberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChamber(event.target.value);
  };

  return (
    <div>
      <main className="flex-1 p-6 mt-4 sm:mt-2 overflow-auto">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 lg:p-6 rounded-sm">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={doctor?.profilePhoto}
                alt={doctor?.name}
                className="object-cover"
              />
              {doctor?.profilePhoto == "N/A" && (
                <AvatarImage
                  src="/images/doctorprofile.png?height=48&width=48"
                  alt={doctor?.name}
                />
              )}
              <AvatarFallback>{doctor?.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome To {doctor?.name}
              </h2>
              <p className="text-gray-600">Have a nice day at work</p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-5 flex-row-reverse">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="chamber-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Chamber:
                </label>
                <select
                  id="chamber-select"
                  value={selectedChamber}
                  onChange={handleChamberChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand"
                >
                  {[{ id: "all", name: "All Chambers" },...chambers].map((chamber:any) => (
                    <option key={chamber.id} value={chamber.id}>
                      {chamber.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-black rounded transform rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Today's Visited Appointment"
            value={patientSummaryData?.data?.todaysPatients || 0}
            icon={Users}
            gradientFrom="from-red-500"
            gradientTo="to-red-600"
            bgIconColor="bg-red-400"
            subtitleColor="text-red-100"
          />

          <StatCard
            title="Today's Pending Appointment"
            value={patientSummaryData?.data?.todaysPendingPatients || 0}
            icon={Users}
            gradientFrom="from-orange-500"
            gradientTo="to-orange-600"
            bgIconColor="bg-orange-400"
            subtitleColor="text-orange-100"
          />
          <StatCard
            title="Today's Total Appointment's"
            value={
              patientSummaryData?.data?.todaysPendingPatients +
                patientSummaryData?.data?.todaysPatients || 0
            }
            icon={Users}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
            bgIconColor="bg-blue-400"
            subtitleColor="text-blue-100"
          />

          {/* 
          <StatCard
            title="Monthly Visited Appointment"
            value={patientSummaryData?.data?.monthlyPatients || 0}
            icon={Users}
            gradientFrom="from-orange-500"
            gradientTo="to-orange-600"
            bgIconColor="bg-orange-400"
            subtitleColor="text-orange-100"
          /> */}
        </div>

        <TodayAppointments appointments={appointmentData} />
      </main>
    </div>
  );
};

export default DoctorDashboard;
