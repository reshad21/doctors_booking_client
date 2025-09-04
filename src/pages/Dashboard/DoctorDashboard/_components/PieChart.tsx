/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetPatientQuery } from "@/redux/api/patient/patient";



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
      className="text-sm font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#3b82f6",
  },
  mobile: {
    label: "Mobile",
    color: "#ef4444",
  },
  tablet: {
    label: "Tablet",
    color: "#10b981",
  },
  other: {
    label: "Other",
    color: "#f59e0b",
  },
};

export default function CustomPieChartWith() {
  // Today's date
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];

  // Date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const previousDate = sevenDaysAgo.toISOString().split("T")[0];
  const { data: patientsData } = useGetPatientQuery({
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
  // Calculate percentages
  const noShowPercentage = (noShows / patientsData?.data?.data?.length) * 100;
  const showPercentage = (shows / patientsData?.data?.data?.length) * 100;
  console.log(noShowPercentage, "noShowPercentage");
  console.log(showPercentage, "showPercentage");
const data = [
  { name: "Visited", value: showPercentage, fill: "#3b82f6" },
  { name: "Not-Visited", value: noShowPercentage, fill: "#ef4444" },
  // { name: "Tablet", value: 200, fill: "#10b981" },
  // { name: "Other", value: 100, fill: "#f59e0b" },
];
  return (
    <div className="w-full bg-gray-100 ">
      <div className="p-2 text-xs font-semibold text-[#ef4444]">Last 7 days count </div>
      <CardContent className="w-full flex-1 max-w-md ">
      <ChartContainer config={chartConfig} className="">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
    </div>
  );
}
