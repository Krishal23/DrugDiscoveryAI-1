import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import TargetItem from "./TargetItem";
import { Target } from "@shared/schema";

const TargetIdentification = () => {
  const [searchQuery, setSearchQuery] = useState("TNF-alpha inflammatory pathway inhibition");
  const [keywords, setKeywords] = useState(["Inflammation", "Cytokines", "Autoimmune"]);

  const { data: targets, isLoading } = useQuery({
    queryKey: ['/api/targets'],
  });

  const nlpValidateMutation = useMutation({
    mutationFn: (query: string) => {
      return apiRequest('POST', '/api/nlp/validate-target', { query });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/targets'] });
    }
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      nlpValidateMutation.mutate(searchQuery);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-ibm font-medium mb-4">Target Identification & Validation</h3>
      
      {/* NLP Search Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Search Biomedical Literature</label>
        <div className="flex">
          <Input
            type="text"
            placeholder="Enter disease, pathway, or biological process..."
            className="flex-1 rounded-r-none focus:ring-accent focus:border-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            className="bg-accent text-white rounded-l-none hover:bg-blue-600"
            onClick={handleSearch}
            disabled={nlpValidateMutation.isPending}
          >
            <i className="ri-search-line"></i>
          </Button>
        </div>
        <div className="mt-2 flex space-x-2">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="outline" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-ibm font-medium">Identified Targets</h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Sort by:</span>
            <select className="text-xs border-none bg-transparent">
              <option>Confidence Score</option>
              <option>Publication Count</option>
              <option>Recent Evidence</option>
            </select>
          </div>
        </div>
        
        {/* Target Results List */}
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
                <TargetItem key={target.id} target={target} />
              ))}
              <Button 
                variant="outline" 
                className="w-full py-2 text-sm text-accent border border-accent rounded-md hover:bg-accent hover:bg-opacity-10"
              >
                Load More Targets
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TargetIdentification;
