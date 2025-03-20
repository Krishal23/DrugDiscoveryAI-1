import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import MoleculeViewer from "../molecules/MoleculeViewer";
import { Target } from "@shared/schema";

interface TargetValidationProps {
  selectedTargetId: number | null;
}

const TargetValidation = ({ selectedTargetId }: TargetValidationProps) => {
  const { data: target, isLoading } = useQuery({
    queryKey: [`/api/targets/${selectedTargetId}`],
    enabled: !!selectedTargetId
  });

  if (!selectedTargetId) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">Select a target from the list to view detailed information and validation data.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-6 w-3/4 mb-4 rounded"></div>
        <div className="bg-gray-300 h-48 mb-4 rounded"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="bg-gray-200 h-4 w-24 rounded"></div>
              <div className="bg-gray-200 h-4 w-24 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-ibm font-medium mb-4">Target Validation</h3>
      
      {/* Target Details Panel */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h4 className="font-ibm font-medium">{target?.name}</h4>
            <div className="pill bg-success bg-opacity-20 text-success px-2 py-1 rounded-full text-xs font-medium">
              Validated
            </div>
          </div>
        </div>
        
        {/* Molecular Structure Viewer */}
        <MoleculeViewer />
        
        {/* Target Properties */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">UniProt ID:</span>
            <span className="font-ibm font-medium">{target?.uniprotId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Gene Name:</span>
            <span className="font-ibm font-medium">{target?.geneName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Molecular Weight:</span>
            <span className="font-ibm font-medium">{target?.molecularWeight}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subcellular Location:</span>
            <span className="font-ibm font-medium">{target?.subcellularLocation}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Druggability Score:</span>
            <div className="flex items-center">
              <Progress value={target?.druggabilityScore} className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden" />
              <span className="ml-2 font-ibm font-medium">{target?.druggabilityScore / 10}/10</span>
            </div>
          </div>
        </div>
        
        {/* Evidence Summary */}
        <div className="p-4 border-t border-gray-200">
          <h5 className="font-ibm font-medium mb-2">Evidence Summary</h5>
          <p className="text-sm text-gray-600 mb-3">
            {target?.evidenceSummary}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex border-t border-gray-200">
          <Button variant="ghost" className="flex-1 py-3 text-sm font-medium text-accent hover:bg-accent hover:bg-opacity-10 border-r border-gray-200">
            <i className="ri-file-list-3-line mr-1"></i> Detailed Report
          </Button>
          <Button variant="ghost" className="flex-1 py-3 text-sm font-medium text-primary hover:bg-primary hover:bg-opacity-10">
            <i className="ri-arrow-right-line mr-1"></i> Generate Drugs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TargetValidation;
