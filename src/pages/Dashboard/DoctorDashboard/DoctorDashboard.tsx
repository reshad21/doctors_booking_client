/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetPatientSummaryQuery } from "@/redux/api/patient-summary/patient-summary";
import { Users } from "lucide-react";
import StatCard from "../_component/StatCard";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import LoadingSpinner from "@/loading/LoadingSpinner";
import { useGetChambersQuery } from "@/redux/api/chamber/chamber";
import chambor from "@/assets/chambor.png";
import CustomPieChartWith from "./_components/PieChart";
import { setChamber } from "@/redux/slices/chamberSlice";

const DoctorDashboard = () => {
  const dispatch = useAppDispatch();

  const selectedChamber =
    useAppSelector((state) => state.chamber.selectedByPage["doctorDashboard"]) ||
    "all";

  const { data: chambersData } = useGetChambersQuery({});
  const chambers =
    chambersData?.data?.map((item: any) => ({
      name: item?.name,
      id: item?.id,
    })) || [];

  const { data: patientSummaryData, isLoading: isPatientSummaryLoading } =
    useGetPatientSummaryQuery({
      chamberId: selectedChamber,
      timezoneOffset: new Date().getTimezoneOffset(),
    });

  const doctor = useAppSelector((state) => state.admin);

  if (isPatientSummaryLoading) return <LoadingSpinner />;

  const handleChamberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      setChamber({ page: "doctorDashboard", chamberId: event.target.value })
    );
  };

  return (
    <div>
      <main className="flex-1 p-6 mt-4 sm:mt-2 overflow-auto">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 lg:p-6 rounded-sm shadow-sm">
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

          <div className="flex justify-center items-center gap-5 flex-row-reverse bg-gray-50 px-4 py-1 rounded-md">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="chamber-select"
                  className="block text-sm text-gray-700 mb-2 font-semibold"
                >
                  Select Chamber:
                </label>
                <select
                  id="chamber-select"
                  value={selectedChamber}
                  onChange={handleChamberChange}
                  className="w-full p-2 border text-gray-700 bg-gray-100 border-gray-200 rounded-md focus:ring-brand focus:border-brand"
                >
                  {[{ id: "all", name: "All Chambers" }, ...chambers].map(
                    (chamber: any) => (
                      <option
                        key={chamber.id}
                        value={chamber.id}
                        className="text-gray-500"
                      >
                        {chamber.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
            <img
              src={chambor}
              alt=""
              className="w-20 bg-gray-300 p-1 rounded-md"
            />
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
              (patientSummaryData?.data?.todaysPendingPatients || 0) +
              (patientSummaryData?.data?.todaysPatients || 0)
            }
            icon={Users}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
            bgIconColor="bg-blue-400"
            subtitleColor="text-blue-100"
          />
        </div>

        <CustomPieChartWith />
      </main>
    </div>
  );
};

export default DoctorDashboard;
