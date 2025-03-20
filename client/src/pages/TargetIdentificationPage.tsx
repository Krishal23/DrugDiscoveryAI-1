import { useState } from "react";
import TargetIdentification from "@/components/targets/TargetIdentification";
import TargetValidation from "@/components/targets/TargetValidation";
import TargetItem from "@/components/targets/TargetItem";
import { useQuery } from "@tanstack/react-query";
import { Target } from "@shared/schema";

const TargetIdentificationPage = () => {
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(1); // Default to first target
  
  const { data: targets, isLoading } = useQuery({
    queryKey: ['/api/targets'],
  });

  const handleTargetSelect = (targetId: number) => {
    setSelectedTargetId(targetId);
  };

  return (
    <div className="flex items-start space-x-6">
      {/* Left Section - Target Analysis */}
      <div className="flex-1">
        <TargetIdentification />
        
        {/* Additional option to show all targets with selection functionality */}
        <div className="mt-6">
          <h3 className="text-lg font-ibm font-medium mb-4">All Available Targets</h3>
          <div className="bg-gray-50 rounded-md p-4 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-3 rounded border border-gray-200 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="flex space-x-6">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {targets?.map((target: Target) => (
                  <div key={target.id} onClick={() => handleTargetSelect(target.id)}>
                    <TargetItem 
                      target={target} 
                      onClick={() => handleTargetSelect(target.id)}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Right Section - Target Details */}
      <div className="w-2/5">
        <TargetValidation selectedTargetId={selectedTargetId} />
      </div>
    </div>
  );
};

export default TargetIdentificationPage;
