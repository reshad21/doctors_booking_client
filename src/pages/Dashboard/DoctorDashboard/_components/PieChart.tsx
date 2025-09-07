// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
// import { CardContent } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { useGetPatientQuery } from "@/redux/api/patient/patient";
// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
// }: any) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//       className="text-sm font-medium"
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "#3b82f6",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "#ef4444",
//   },
//   tablet: {
//     label: "Tablet",
//     color: "#10b981",
//   },
//   other: {
//     label: "Other",
//     color: "#f59e0b",
//   },
// };

// export default function CustomPieChartWith() {
//   // Today's date
//   const today = new Date();
//   const todayDate = today.toISOString().split("T")[0];

//   // Date 7 days ago
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(today.getDate() - 7);
//   const previousDate = sevenDaysAgo.toISOString().split("T")[0];
//   const { data: patientsData } = useGetPatientQuery({
//     filter: JSON.stringify({
//       startDate: previousDate || undefined,
//       endDate: todayDate || undefined,
//       timezoneOffset: new Date().getTimezoneOffset(),
//     }),
//     orderBy: JSON.stringify({ createdAt: "asc" }),
//   });

//   const noShows =
//     patientsData?.data?.data?.filter(
//       (patient: any) => patient?.isArrived == false
//     )?.length || 0;
//   const shows =
//     patientsData?.data?.data?.filter(
//       (patient: any) => patient?.isArrived == true
//     )?.length || 0;
//   // Calculate percentages
//   const noShowPercentage = (noShows / patientsData?.data?.data?.length) * 100;
//   const showPercentage = (shows / patientsData?.data?.data?.length) * 100;
//   console.log(noShowPercentage, "noShowPercentage");
//   console.log(showPercentage, "showPercentage");
// const data = [
//   { name: "Visited", value: showPercentage, fill: "#3b82f6" },
//   { name: "Not-Visited", value: noShowPercentage, fill: "#ef4444" },
//   // { name: "Tablet", value: 200, fill: "#10b981" },
//   // { name: "Other", value: 100, fill: "#f59e0b" },
// ];
//   return (
//     <div className="w-full bg-gray-100 ">
//       <div className="p-2 text-xs font-semibold text-[#ef4444]">Last 7 days count </div>
//       <CardContent className="w-full flex-1 max-w-md ">
//       <ChartContainer config={chartConfig} className="">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={renderCustomizedLabel}
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="value"

//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.fill} />
//               ))}
//             </Pie>
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </ChartContainer>
//     </CardContent>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, Users, UserCheck, UserX } from "lucide-react";
import { useGetPatientQuery } from "@/redux/api/patient/patient";
import { useEffect, useState } from "react";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-sm font-bold drop-shadow-lg"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const chartConfig = {
  visited: {
    label: "Visited",
    color: "#ef4444",
  },
  notVisited: {
    label: "Not Visited",
    color: "#10b981",
  },
};

export default function CustomPieChartWith() {
  const [selectedDay, setSelectedDay] = useState(3);
  // Today's date
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];

  // dynamic y days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - Number(selectedDay));
  const previousDate = sevenDaysAgo.toISOString().split("T")[0];

  // Replace this with your actual API call:
  const { data: patientsData ,refetch} = useGetPatientQuery({
    filter: JSON.stringify({
      startDate: previousDate || undefined,
      endDate: todayDate || undefined,
      timezoneOffset: new Date().getTimezoneOffset(),
    }),
    orderBy: JSON.stringify({ createdAt: "asc" }),
  });

  const noShows =
    patientsData?.data?.data?.filter(
      (patient: any) => patient?.isArrived == false
    )?.length || 0;
  const shows =
    patientsData?.data?.data?.filter(
      (patient: any) => patient?.isArrived == true
    )?.length || 0;

  const totalPatients = patientsData?.data?.data?.length || 0;

  // Calculate percentages
  const noShowPercentage =
    totalPatients > 0 ? (noShows / totalPatients) * 100 : 0;
  const showPercentage = totalPatients > 0 ? (shows / totalPatients) * 100 : 0;

  const data = [
    { name: "Visited", value: showPercentage, fill: "#f59e0b", count: shows },
    {
      name: "Not-Visited",
      value: noShowPercentage,
      fill: "#3b82f6",
      count: noShows,
    },
  ];
useEffect(() => {
    refetch();
  }, [selectedDay, refetch]);

  // ... (rest of your component logic remains the same)

  const handleChamberChange = (event: any) => {
    setSelectedDay(event.target.value);
  };
console.log(patientsData,"patientsData");

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              Patient Visit Analytics
            </h3>
            <p className="text-blue-100 text-sm">Last {selectedDay} days overview</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-600">Total</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {totalPatients}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">
                Visited
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">{shows}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <UserX className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-500">No-Show</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{noShows}</div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white  z-50">
        <div className="">
          <div>
            <div className="mb-4">
              <select
                id="day-select"
                // value="all"
                onChange={handleChamberChange}
                className="w-full p-2 border text-gray-700 bg-gray-50 border-gray-200 rounded-md focus:ring-brand focus:border-brand"
              >
                {[
                  { id: 3, name: "3 Days" },
                  { id: 7, name: "7 Days" },
                  { id: 15, name: "15 Days" },
                  { id: 30, name: "1 Month" },
                  { id: 60, name: "2 Month" },
                ].map((chamber: any) => (
                  <option
                    key={chamber.id}
                    value={chamber.id}
                    className="text-gray-500"
                  >
                    {chamber.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={3}
                stroke="#ffffff"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: any, name: unknown, props: any) => [
                      `${value.toFixed(1)}% (${props.payload.count} patients)`,
                      String(name),
                    ]}
                  />
                }
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            Attendance Rate:{" "}
            <span className="font-semibold text-emerald-600">
              {showPercentage.toFixed(1)}%
            </span>
          </span>
          <span className="text-slate-600">
            No-Show Rate:{" "}
            <span className="font-semibold text-red-500">
              {noShowPercentage.toFixed(1)}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
