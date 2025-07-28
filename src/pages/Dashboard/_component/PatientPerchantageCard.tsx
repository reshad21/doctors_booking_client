/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PatientPercentageCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

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

  return (
    <Card className="border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Patient Percentage</CardTitle>
          <div className="flex space-x-2">
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
            <Button variant="outline" size="sm">
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
                <div className="w-1 h-8 bg-gray-800 rounded"></div>
                <div>
                  <p className="font-bold text-2xl">{item.value}%</p>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientPercentageCard;
