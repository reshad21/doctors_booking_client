import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export default function ServiceManagement() {
  const cards = [
    {
      title: "New Patient History",
      from: "6th April, 2025 Sunday",
      to: "16th April, 2025 Tuesday",
      stats: [
        { label: "New Patient", value: 30 },
        { label: "Visited", value: 30 },
        { label: "Total Payment", value: "200000TK" },
      ],
    },
    {
      title: "Old Patient History",
      from: "6th April, 2025 Sunday",
      to: "16th April, 2025 Tuesday",
      stats: [
        { label: "Old Patient", value: 30 },
        { label: "Visited", value: 30 },
        { label: "Total Payment", value: "200000TK" },
      ],
    },
    {
      title: "Report History",
      from: "6th April, 2025 Sunday",
      to: "18th April, 2025 Tuesday",
      stats: [
        { label: "Report", value: 30 },
        { label: "Visited", value: 30 },
        { label: "Total Payment", value: "200000TK" },
      ],
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date:
            </label>
            <Input
              type="date"
              placeholder="Please Select Date"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date:
            </label>
            <Input
              type="date"
              placeholder="Please Select Date"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chamber
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Please Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chamber1">Chamber 1</SelectItem>
                <SelectItem value="chamber2">Chamber 2</SelectItem>
                <SelectItem value="chamber3">Chamber 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <X className="h-4 w-4" />
            </Button>
            <Button className="bg-green-700 hover:bg-green-800 text-white px-6">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Patient History Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <HistoryCard
            key={idx}
            title={card.title}
            from={card.from}
            to={card.to}
            stats={card.stats}
          />
        ))}
      </div>
    </div>
  );
}

import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoryCardProps {
  title: string;
  from: string;
  to: string;
  stats: { label: string; value: string | number }[];
}

export function HistoryCard({ title, from, to, stats }: HistoryCardProps) {
  return (
    <Card className="bg-gray-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">From</span> {from}{" "}
              <span className="font-medium">To</span> {to} :
              <Download className="h-4 w-4 text-gray-600 inline ml-2" />
            </p>
          </div>
        </div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="font-medium">{stat.label} :</span>
            <span className="font-bold text-lg">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
