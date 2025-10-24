/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRef, useState } from "react";

interface PaymentStats {
  new: number;
  old: number;
  report: number;
}

interface PaymentCardProps {
  daily: PaymentStats;
  weekly: PaymentStats;
  monthly: PaymentStats;
}

const PaymentCard = ({ daily, weekly, monthly }: PaymentCardProps) => {
  const [tab, setTab] = useState<"daily" | "weekly" | "monthly">("daily");

  const selectedData = {
    daily,
    weekly,
    monthly,
  }[tab];

  const items = [
    { label: "New Patient", value: selectedData.new },
    { label: "Old Patient", value: selectedData.old },
    { label: "Report Patient", value: selectedData.report },
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
      <Card className="border-none print:p-6 print:border print:rounded-none print:shadow-none print:text-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg  print:text-black">Payment</CardTitle>
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
              <div
                className="flex items-center justify-between"
                key={item.label}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gray-800 rounded  print:bg-black"></div>
                  <div>
                    <p className="font-bold text-2xl  print:text-black">{item.value}</p>
                    <p className="text-sm text-gray-600  print:text-black">{item.label}</p>
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

export default PaymentCard;
