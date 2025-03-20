import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Activity } from "@shared/schema";

interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
}

const getActivityTypeColor = (type: string): string => {
  switch (type) {
    case "target_identification":
      return "bg-success";
    case "drug_generation":
      return "bg-accent";
    case "admet_analysis":
      return "bg-warning";
    case "virtual_screening":
      return "bg-secondary";
    default:
      return "bg-gray-400";
  }
};

const ActivityItem = ({ activity, isLast }: ActivityItemProps) => {
  const dotColor = getActivityTypeColor(activity.activityType);
  
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className={`w-3 h-3 ${dotColor} rounded-full`}></div>
        {!isLast && <div className="w-0.5 bg-gray-200 h-full"></div>}
      </div>
      <div className={`${isLast ? '' : 'pb-5'}`}>
        <p className="text-xs text-gray-500 mb-1">
          {activity.timestamp ? format(new Date(activity.timestamp), 'MMM d, yyyy, h:mm a') : 'Unknown date'}
        </p>
        <p className="font-medium mb-1">{activity.description}</p>
      </div>
    </div>
  );
};

const ActivityTimeline = () => {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['/api/activities'],
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex">
          <div className="flex flex-col items-center mr-4">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-0.5 bg-gray-200 h-full"></div>
          </div>
          <div className="pb-5 w-full">
            <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>;
  }

  if (error) {
    return <div className="text-danger">Failed to load activities</div>;
  }

  return (
    <div className="space-y-4">
      {activities?.map((activity: Activity, index: number) => (
        <ActivityItem 
          key={activity.id} 
          activity={activity} 
          isLast={index === activities.length - 1} 
        />
      ))}
    </div>
  );
};

export default ActivityTimeline;
