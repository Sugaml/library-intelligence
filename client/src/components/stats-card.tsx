import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "amber" | "red" | "purple";
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

const colorClasses = {
  blue: {
    border: "border-l-4 tu-border-blue",
    iconBg: "tu-bg-blue bg-opacity-10",
    iconColor: "tu-text-blue",
  },
  green: {
    border: "border-l-4 tu-border-green",
    iconBg: "tu-bg-green bg-opacity-10",
    iconColor: "tu-text-green",
  },
  amber: {
    border: "border-l-4 tu-border-amber",
    iconBg: "tu-bg-amber bg-opacity-10",
    iconColor: "tu-text-amber",
  },
  red: {
    border: "border-l-4 tu-border-red",
    iconBg: "tu-bg-red bg-opacity-10",
    iconColor: "tu-text-red",
  },
  purple: {
    border: "border-l-4 border-purple-500",
    iconBg: "bg-purple-500 bg-opacity-10",
    iconColor: "text-purple-500",
  },
};

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change, 
  changeType 
}: StatsCardProps) {
  const classes = colorClasses[color];
  
  return (
    <Card className={`shadow-sm ${classes.border}`}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={`text-xs ${
                changeType === 'positive' ? 'tu-text-green' : 
                changeType === 'negative' ? 'tu-text-red' : 
                'text-gray-500'
              }`}>
                {change}
              </p>
            )}
          </div>
          <div className={`${classes.iconBg} p-3 rounded-full`}>
            <Icon className={`${classes.iconColor} text-xl`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
