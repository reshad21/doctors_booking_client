// components/StatCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";


interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  bgIconColor: string;
  textColor?: string;
  subtitleColor?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradientFrom,
  gradientTo,
  bgIconColor,
  textColor = "text-white",
  subtitleColor,
}: StatCardProps) => {
  return (
    <Card
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} ${textColor}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${subtitleColor ?? "text-white/70"}`}>
              {title}
            </p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div
            className={`w-12 h-12 ${bgIconColor} rounded-lg flex items-center justify-center`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
