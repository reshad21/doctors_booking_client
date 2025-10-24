/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRef, useState } from "react";

type Status = {
  count: number;
  percent: number;
};

type PatientStats = {
  new: Status;
  old: Status;
  report: Status;
};

interface PatientPercentageCardProps {
  daily: PatientStats;
  weekly: PatientStats;
  monthly: PatientStats;
}

const PatientPercentageCard = ({
  daily,
  weekly,
  monthly,
}: PatientPercentageCardProps) => {
  const [tab, setTab] = useState<"daily" | "weekly" | "monthly">("daily");

  const selectedData = {
    daily,
    weekly,
    monthly,
  }[tab];

  const items = [
    { label: "New Patient", value: selectedData.new.percent },
    { label: "Old Patient", value: selectedData.old.percent },
    { label: "Report Patient", value: selectedData.report.percent },
  ];

  // Ref for printable area
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // optional: reset event handlers
  };

  return (
    <div ref={printRef}>

      {/* <Card className="border-none print:border print:p-6"> */}
       <Card className="border-none print:p-6 print:border print:rounded-none print:shadow-none print:text-black"> 
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg print:text-black">
              Patient Percentage
            </CardTitle>
            <div className="flex space-x-2 print:hidden">
              <Tabs
                value={tab}
                onValueChange={(v) => setTab(v as any)}
                className="w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily" className="text-xs">
                    Daily
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs">
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">
                    Monthly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div className="flex items-center justify-between" key={item.label}>
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gray-800 rounded print:bg-black"></div>
                  <div>
                    <p className="font-bold text-2xl print:text-black">
                      {item.value}%
                    </p>
                    <p className="text-sm text-gray-600 print:text-black">
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientPercentageCard;
