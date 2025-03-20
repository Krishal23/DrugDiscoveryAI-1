import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drug } from "@shared/schema";
import MoleculeViewer from "../molecules/MoleculeViewer";

interface AdmetPropertyCardProps {
  title: string;
  value: number;
  description: string;
  colorClass: string;
}

const AdmetPropertyCard = ({ title, value, description, colorClass }: AdmetPropertyCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="text-sm font-medium mb-2">{title}</h4>
        <div className="flex items-center mb-2">
          <Progress value={value} className={`h-2 ${colorClass} flex-1 mr-2`} />
          <span className="font-ibm font-medium">{value}%</span>
        </div>
        <p className="text-xs text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const AdmetAnalyzer = () => {
  const [selectedDrugId, setSelectedDrugId] = useState<string>("");
  const [customSmiles, setCustomSmiles] = useState<string>("");
  const [analysisMode, setAnalysisMode] = useState<"existing" | "custom">("existing");

  const { data: drugs } = useQuery({
    queryKey: ['/api/drugs'],
  });

  const predictAdmetMutation = useMutation({
    mutationFn: (data: { smiles: string }) => {
      return apiRequest('POST', '/api/predict/admet', data);
    }
  });

  const handlePredictAdmet = () => {
    const smiles = analysisMode === "existing" 
      ? drugs?.find((d: Drug) => d.id.toString() === selectedDrugId)?.smiles 
      : customSmiles;
    
    if (!smiles) return;
    
    predictAdmetMutation.mutate({ smiles });
  };

  const getPropertyColor = (value: number, isInverse = false) => {
    if (isInverse) {
      if (value <= 20) return "bg-success";
      if (value <= 40) return "bg-accent";
      if (value <= 60) return "bg-warning";
      return "bg-danger";
    } else {
      if (value >= 80) return "bg-success";
      if (value >= 60) return "bg-accent";
      if (value >= 40) return "bg-warning";
      return "bg-danger";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>ADMET Prediction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Analysis Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={analysisMode === "existing" ? "default" : "outline"} 
                  onClick={() => setAnalysisMode("existing")}
                  className={analysisMode === "existing" ? "bg-accent" : ""}
                >
                  Existing Drug
                </Button>
                <Button 
                  variant={analysisMode === "custom" ? "default" : "outline"}
                  onClick={() => setAnalysisMode("custom")}
                  className={analysisMode === "custom" ? "bg-accent" : ""}
                >
                  Custom SMILES
                </Button>
              </div>
            </div>
            
            {analysisMode === "existing" ? (
              <div>
                <label className="text-sm font-medium mb-2 block">Select Drug</label>
                <Select
                  value={selectedDrugId}
                  onValueChange={setSelectedDrugId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a drug compound" />
                  </SelectTrigger>
                  <SelectContent>
                    {drugs?.map((drug: Drug) => (
                      <SelectItem key={drug.id} value={drug.id.toString()}>
                        {drug.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium mb-2 block">Enter SMILES String</label>
                <Input 
                  placeholder="e.g., CC1=CC=C(C=C1)NC(=O)NC2=CC=CC=C2F" 
                  value={customSmiles}
                  onChange={(e) => setCustomSmiles(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid SMILES notation for your compound
                </p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">Prediction Method</label>
              <Select defaultValue="xgboost">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xgboost">XGBoost</SelectItem>
                  <SelectItem value="nn">Neural Network</SelectItem>
                  <SelectItem value="graph">Graph Neural Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {analysisMode === "existing" && selectedDrugId && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Selected Compound</h4>
                <div className="h-32 bg-gray-100 rounded-md overflow-hidden">
                  <MoleculeViewer smilesString={drugs?.find((d: Drug) => d.id.toString() === selectedDrugId)?.smiles} />
                </div>
                <p className="text-xs font-mono mt-2 truncate">
                  {drugs?.find((d: Drug) => d.id.toString() === selectedDrugId)?.smiles}
                </p>
              </div>
            )}
            
            {analysisMode === "custom" && customSmiles && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div className="h-32 bg-gray-100 rounded-md overflow-hidden">
                  <MoleculeViewer smilesString={customSmiles} />
                </div>
              </div>
            )}

            <Button 
              className="w-full bg-accent hover:bg-blue-600"
              onClick={handlePredictAdmet}
              disabled={
                (analysisMode === "existing" && !selectedDrugId) || 
                (analysisMode === "custom" && !customSmiles) || 
                predictAdmetMutation.isPending
              }
            >
              {predictAdmetMutation.isPending ? "Predicting..." : "Predict ADMET Properties"}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        {predictAdmetMutation.data ? (
          <Tabs defaultValue="overview">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-6">
                <CardTitle>ADMET Prediction Results</CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
                  <TabsTrigger value="comparison">Drug Comparison</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="px-6">
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <AdmetPropertyCard
                      title="Absorption"
                      value={predictAdmetMutation.data.absorption}
                      description="Predicted oral bioavailability and intestinal absorption"
                      colorClass={getPropertyColor(predictAdmetMutation.data.absorption)}
                    />
                    <AdmetPropertyCard
                      title="Distribution"
                      value={predictAdmetMutation.data.distribution}
                      description="Blood-brain barrier penetration and plasma protein binding"
                      colorClass={getPropertyColor(predictAdmetMutation.data.distribution)}
                    />
                    <AdmetPropertyCard
                      title="Metabolism"
                      value={predictAdmetMutation.data.metabolism}
                      description="Metabolic stability and enzyme interactions"
                      colorClass={getPropertyColor(predictAdmetMutation.data.metabolism)}
                    />
                    <AdmetPropertyCard
                      title="Excretion"
                      value={predictAdmetMutation.data.excretion}
                      description="Clearance rate and excretion pathways"
                      colorClass={getPropertyColor(predictAdmetMutation.data.excretion)}
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Toxicity Risk</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        predictAdmetMutation.data.toxicity <= 20 
                          ? "bg-success bg-opacity-20 text-success" 
                          : predictAdmetMutation.data.toxicity <= 40 
                            ? "bg-accent bg-opacity-20 text-accent" 
                            : "bg-danger bg-opacity-20 text-danger"
                      }`}>
                        {predictAdmetMutation.data.toxicity <= 20 
                          ? "Low Risk" 
                          : predictAdmetMutation.data.toxicity <= 40 
                            ? "Medium Risk" 
                            : "High Risk"
                        }
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <Progress 
                        value={predictAdmetMutation.data.toxicity} 
                        className={`h-2 flex-1 mr-2 ${getPropertyColor(predictAdmetMutation.data.toxicity, true)}`} 
                      />
                      <span className="font-ibm font-medium">{predictAdmetMutation.data.toxicity}%</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Predicted toxicity risks including hepatotoxicity, cardiotoxicity, and mutagenicity
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Overall Drug Score</h4>
                      <span className={`font-semibold ${
                        predictAdmetMutation.data.overallScore >= 80 
                          ? "text-success" 
                          : predictAdmetMutation.data.overallScore >= 60 
                            ? "text-accent" 
                            : "text-warning"
                      }`}>
                        {predictAdmetMutation.data.overallScore}/100
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Progress 
                        value={predictAdmetMutation.data.overallScore} 
                        className={`h-2 flex-1 mr-2 ${getPropertyColor(predictAdmetMutation.data.overallScore)}`} 
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      Combined score based on all ADMET properties, weighted for drug development potential
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      Export Report
                    </Button>
                    <Button className="bg-accent hover:bg-blue-600">
                      Optimize Compound
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="details">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Absorption Details</h4>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Caco-2 Permeability</td>
                            <td className="py-2 text-right">High</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Human Intestinal Absorption</td>
                            <td className="py-2 text-right">84%</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">P-glycoprotein Substrate</td>
                            <td className="py-2 text-right">No</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Bioavailability Score</td>
                            <td className="py-2 text-right">0.85</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Metabolism Details</h4>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-medium">CYP1A2 Inhibitor</td>
                            <td className="py-2 text-right">No</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">CYP2C19 Inhibitor</td>
                            <td className="py-2 text-right">Yes</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">CYP2C9 Inhibitor</td>
                            <td className="py-2 text-right">No</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">CYP2D6 Inhibitor</td>
                            <td className="py-2 text-right">Yes</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">CYP3A4 Inhibitor</td>
                            <td className="py-2 text-right">No</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Toxicity Details</h4>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-medium">AMES Toxicity</td>
                            <td className="py-2 text-right">Non-toxic</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">hERG Inhibition</td>
                            <td className="py-2 text-right">Low Risk</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Hepatotoxicity</td>
                            <td className="py-2 text-right text-warning">Medium Risk</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Skin Sensitization</td>
                            <td className="py-2 text-right">Non-sensitizer</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="comparison">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Comparison with approved drugs in the same therapeutic class
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Relative ADMET Profile</h4>
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                        <span className="text-sm">Your Compound</span>
                        <div className="w-3 h-3 rounded-full bg-gray-400 ml-6 mr-2"></div>
                        <span className="text-sm">Average of Approved Drugs</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Absorption</span>
                            <span>Better than 68% of approved drugs</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full relative">
                            <div className="absolute h-full w-1 bg-gray-400 rounded-full" style={{ left: '62%' }}></div>
                            <div className="h-full bg-accent rounded-full" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Distribution</span>
                            <span>Better than 72% of approved drugs</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full relative">
                            <div className="absolute h-full w-1 bg-gray-400 rounded-full" style={{ left: '58%' }}></div>
                            <div className="h-full bg-accent rounded-full" style={{ width: '72%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Metabolism</span>
                            <span>Better than 45% of approved drugs</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full relative">
                            <div className="absolute h-full w-1 bg-gray-400 rounded-full" style={{ left: '65%' }}></div>
                            <div className="h-full bg-warning rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Toxicity (lower is better)</span>
                            <span>Better than 82% of approved drugs</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full relative">
                            <div className="absolute h-full w-1 bg-gray-400 rounded-full" style={{ left: '40%' }}></div>
                            <div className="h-full bg-success rounded-full" style={{ width: '18%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Structural Alerts</h4>
                      <p className="text-sm mb-2">
                        The analysis identified the following structures that may contribute to toxicity:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start p-2 border border-gray-200 rounded">
                          <div className="h-8 w-8 mr-3 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                            <i className="ri-alert-line text-warning"></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Phenol group at position 4</p>
                            <p className="text-xs text-gray-600">May contribute to hepatotoxicity. Consider replacing with methoxy group.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No ADMET Prediction Yet</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Select a drug compound or enter a SMILES string, then click "Predict ADMET Properties" to analyze the compound's pharmacokinetic and toxicity profile.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdmetAnalyzer;
