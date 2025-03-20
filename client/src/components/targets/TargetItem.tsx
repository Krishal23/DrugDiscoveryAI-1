import { Target } from "@shared/schema";

interface TargetItemProps {
  target: Target;
  onClick?: () => void;
}

const TargetItem = ({ target, onClick }: TargetItemProps) => {
  const getConfidenceClass = (confidence: number | undefined) => {
    if (!confidence) return "bg-gray-200 text-gray-700";
    if (confidence >= 90) return "bg-success bg-opacity-20 text-success";
    if (confidence >= 75) return "bg-warning bg-opacity-20 text-warning";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <div 
      className="bg-white p-3 rounded border border-gray-200 hover:border-accent cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div>
          <h5 className="font-ibm font-medium text-primary">{target.name}</h5>
          <p className="text-sm text-gray-600">{target.description}</p>
        </div>
        <div className={`pill ${getConfidenceClass(target.confidence)} px-2 py-1 rounded-full text-xs font-medium self-start`}>
          {target.confidence}% Confidence
        </div>
      </div>
      <div className="mt-2 flex space-x-6 text-sm">
        <span><i className="ri-file-text-line mr-1"></i> {target.publicationCount} Publications</span>
        <span><i className="ri-link-m mr-1"></i> {target.pathwayCount} Pathways</span>
        <span><i className="ri-medicine-bottle-line mr-1"></i> {target.existingDrugCount} Existing Drugs</span>
      </div>
    </div>
  );
};

export default TargetItem;
