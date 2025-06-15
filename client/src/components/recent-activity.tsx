import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, ArrowUp, ArrowDown, AlertTriangle, Hand } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'borrow' | 'return' | 'fine' | 'request';
  title: string;
  description: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  title?: string;
}

const activityIcons = {
  borrow: { icon: ArrowUp, color: "tu-bg-blue" },
  return: { icon: ArrowDown, color: "tu-bg-green" },
  fine: { icon: AlertTriangle, color: "tu-bg-amber" },
  request: { icon: Hand, color: "bg-purple-500" },
};

export default function RecentActivity({ activities, title = "Recent Activity" }: RecentActivityProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="px-6 py-4 border-b">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const { icon: Icon, color } = activityIcons[activity.type];
            
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`${color} p-2 rounded-full`}>
                  <Icon className="text-white text-xs w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
