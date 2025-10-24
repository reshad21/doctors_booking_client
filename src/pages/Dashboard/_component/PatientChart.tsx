import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface YearlyStatus {
  total: number;
  new: { count: number; percent: number };
  old: { count: number; percent: number };
  report: { count: number; percent: number };
}

interface YearlyPatientChartProps {
  yearlyStatus: YearlyStatus;
}

const PatientChart = ({ yearlyStatus }: YearlyPatientChartProps) => {
  const { new: newP, old, report } = yearlyStatus;

  const strokeTotal = 251;
  const newStroke = (strokeTotal * newP.percent) / 100;
  const oldStroke = (strokeTotal * old.percent) / 100;
  const reportStroke = (strokeTotal * report.percent) / 100;

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-lg">Yearly Patient Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#3b82f6" // blue - new
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${newStroke} ${strokeTotal - newStroke}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#f59e0b" // yellow - old
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${oldStroke} ${strokeTotal - oldStroke}`}
                strokeDashoffset={`-${newStroke}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#9ca3af" // gray - report
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${reportStroke} ${strokeTotal - reportStroke}`}
                strokeDashoffset={`-${newStroke + oldStroke}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-sm">New Patient</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span className="text-sm">Old Patient</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded" />
            <span className="text-sm">Report Patient</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientChart;
