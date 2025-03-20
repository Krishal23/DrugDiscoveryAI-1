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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Target, Drug } from "@shared/schema";
import MoleculeViewer from "../molecules/MoleculeViewer";

interface ScreeningResultItemProps {
  compoundId: number;
  name: string;
  score: number;
  bindingEnergy: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const ScreeningResultItem = ({ 
  compoundId, 
  name, 
  score, 
  bindingEnergy, 
  onClick, 
  isSelected 
}: ScreeningResultItemProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-success bg-opacity-20 text-success";
    if (score >= 60) return "bg-accent bg-opacity-20 text-accent";
    if (score >= 40) return "bg-warning bg-opacity-20 text-warning";
    return "bg-danger bg-opacity-20 text-danger";
  };

  return (
    <div
      className={`bg-white p-3 rounded border hover:border-accent cursor-pointer transition-colors ${
        isSelected ? "border-accent ring-1 ring-accent" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div>
          <h5 className="font-ibm font-medium text-primary">{name}</h5>
          <p className="text-sm text-gray-600">Compound ID: {compoundId}</p>
        </div>
        <div className={`pill px-2 py-1 rounded-full text-xs font-medium self-start ${getScoreColor(score)}`}>
          Score: {score}
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm"><i className="ri-scales-line mr-1"></i> Binding Energy: {bindingEnergy} kcal/mol</span>
        <Button variant="ghost" size="sm" className="text-xs px-2">
          View Details
        </Button>
      </div>
    </div>
  );
};

const VirtualScreening = () => {
  const [screeningMode, setScreeningMode] = useState<"target" | "ligand">("target");
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [compoundLibrary, setCompoundLibrary] = useState<string>("approved_drugs");
  const [customCompounds, setCustomCompounds] = useState<string>("");
  const [selectedCompoundId, setSelectedCompoundId] = useState<number | null>(null);
  
  const { data: targets } = useQuery({
    queryKey: ['/api/targets'],
  });

  const screenVirtualMutation = useMutation({
    mutationFn: (data: { targetId: number, compounds: any[] }) => {
      return apiRequest('POST', '/api/screen/virtual', data);
    }
  });

  const handleVirtualScreening = () => {
    if (!selectedTargetId) return;
    
    // In a real app, we would parse and validate the custom compounds
    // For now, we'll use sample compounds from the mutation response
    const compounds = customCompounds 
      ? customCompounds.split('\n').map((line, i) => ({ name: `Compound ${i+1}`, smiles: line.trim() }))
      : [{ name: "Sample Compound", smiles: "CC1=CC=C(C=C1)NC(=O)NC2=CC=CC=C2F" }];
    
    screenVirtualMutation.mutate({
      targetId: parseInt(selectedTargetId),
      compounds
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Virtual Screening Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Screening Approach</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={screeningMode === "target" ? "default" : "outline"} 
                  onClick={() => setScreeningMode("target")}
                  className={screeningMode === "target" ? "bg-accent" : ""}
                >
                  <i className="ri-target-line mr-2"></i>
                  Target-Based
                </Button>
                <Button 
                  variant={screeningMode === "ligand" ? "default" : "outline"}
                  onClick={() => setScreeningMode("ligand")}
                  className={screeningMode === "ligand" ? "bg-accent" : ""}
                >
                  <i className="ri-medicine-bottle-line mr-2"></i>
                  Ligand-Based
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                {screeningMode === "target" ? "Select Target Protein" : "Select Reference Ligand"}
              </label>
              <Select
                value={selectedTargetId}
                onValueChange={setSelectedTargetId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={screeningMode === "target" ? "Choose a target" : "Choose a reference compound"} />
                </SelectTrigger>
                <SelectContent>
                  {screeningMode === "target" 
                    ? targets?.map((target: Target) => (
                        <SelectItem key={target.id} value={target.id.toString()}>
                          {target.name}
                        </SelectItem>
                      ))
                    : [{ id: 1, name: "Aspirin" }, { id: 2, name: "Ibuprofen" }, { id: 3, name: "Metformin" }].map((drug) => (
                        <SelectItem key={drug.id} value={drug.id.toString()}>
                          {drug.name}
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Compound Library</label>
              <Select
                value={compoundLibrary}
                onValueChange={setCompoundLibrary}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved_drugs">FDA Approved Drugs</SelectItem>
                  <SelectItem value="clinical_candidates">Clinical Candidates</SelectItem>
                  <SelectItem value="natural_products">Natural Products</SelectItem>
                  <SelectItem value="custom">Custom Compounds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {compoundLibrary === "custom" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Enter Compounds (SMILES)</label>
                <Textarea 
                  placeholder="Enter one SMILES per line"
                  className="h-32"
                  value={customCompounds}
                  onChange={(e) => setCustomCompounds(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 50 compounds for screening
                </p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">Docking Settings</label>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Exhaustiveness</span>
                  <Select defaultValue="8">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Energy Range</span>
                  <Select defaultValue="3">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-accent hover:bg-blue-600"
              onClick={handleVirtualScreening}
              disabled={!selectedTargetId || screenVirtualMutation.isPending}
            >
              {screenVirtualMutation.isPending ? "Screening..." : "Start Virtual Screening"}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        {screenVirtualMutation.data ? (
          <Tabs defaultValue="results">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-6">
                <CardTitle>Screening Results</CardTitle>
                <TabsList>
                  <TabsTrigger value="results">Results List</TabsTrigger>
                  <TabsTrigger value="visualization">3D Visualization</TabsTrigger>
                  <TabsTrigger value="repurposing">Drug Repurposing</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="px-6">
                <TabsContent value="results">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-sm font-medium">Found {screenVirtualMutation.data?.results?.length || 0} potential compounds</h3>
                      <p className="text-xs text-gray-500">Sorted by docking score</p>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="score">
                        <SelectTrigger className="text-xs h-8">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="score">Sort by Score</SelectItem>
                          <SelectItem value="energy">Sort by Binding Energy</SelectItem>
                          <SelectItem value="name">Sort by Name</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="h-8">
                        Export Results
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {screenVirtualMutation.data?.results?.map((result: any) => (
                      <ScreeningResultItem
                        key={result.compoundId}
                        compoundId={result.compoundId}
                        name={result.name}
                        score={result.score}
                        bindingEnergy={result.bindingEnergy}
                        onClick={() => setSelectedCompoundId(result.compoundId)}
                        isSelected={selectedCompoundId === result.compoundId}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="visualization">
                  <div className="bg-gray-50 rounded-md overflow-hidden">
                    <div className="h-96 flex items-center justify-center bg-gray-800">
                      <MoleculeViewer />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-2">Binding Mode Visualization</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        This visualization shows the predicted binding pose of the selected compound with the target protein. Key interactions are highlighted.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-accent">Hydrogen Bond</Badge>
                        <Badge className="bg-success">Hydrophobic Interaction</Badge>
                        <Badge className="bg-warning">π-Stacking</Badge>
                        <Badge className="bg-secondary">Ionic Interaction</Badge>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <h5 className="text-sm font-medium">Interaction Details</h5>
                          <Button variant="outline" size="sm">
                            Download PDB
                          </Button>
                        </div>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Binding Energy:</span>
                            <span className="font-ibm">-8.3 kcal/mol</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Hydrogen Bonds:</span>
                            <span className="font-ibm">3 (ASP83, GLY146, ARG212)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Hydrophobic Interactions:</span>
                            <span className="font-ibm">4</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="repurposing">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Drug Repurposing Opportunities</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Based on structural similarity and binding affinities, the following approved drugs may be repurposed for your target:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <div className="flex justify-between">
                            <div>
                              <h5 className="font-ibm font-medium text-primary">Celecoxib</h5>
                              <p className="text-sm text-gray-600">Current indication: Arthritis, Pain</p>
                            </div>
                            <Badge className="bg-success bg-opacity-20 text-success self-start">
                              High Potential
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Similarity Score:</p>
                              <p className="text-sm font-medium">84%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Binding Energy:</p>
                              <p className="text-sm font-medium">-9.2 kcal/mol</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Safety Profile:</p>
                              <p className="text-sm font-medium">Well-established</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Development Time:</p>
                              <p className="text-sm font-medium">~2-3 years</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <div className="flex justify-between">
                            <div>
                              <h5 className="font-ibm font-medium text-primary">Losartan</h5>
                              <p className="text-sm text-gray-600">Current indication: Hypertension</p>
                            </div>
                            <Badge className="bg-accent bg-opacity-20 text-accent self-start">
                              Medium Potential
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Similarity Score:</p>
                              <p className="text-sm font-medium">72%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Binding Energy:</p>
                              <p className="text-sm font-medium">-7.8 kcal/mol</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Safety Profile:</p>
                              <p className="text-sm font-medium">Well-established</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Development Time:</p>
                              <p className="text-sm font-medium">~3-4 years</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Repurposing Advantages</h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 rounded-full bg-success text-white flex items-center justify-center">
                            <i className="ri-check-line text-xs"></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Reduced Development Time</p>
                            <p className="text-xs text-gray-600">Save 5-7 years compared to de novo drug development</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 rounded-full bg-success text-white flex items-center justify-center">
                            <i className="ri-check-line text-xs"></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Lower Development Costs</p>
                            <p className="text-xs text-gray-600">Reduction of R&D expenses by up to 60%</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 rounded-full bg-success text-white flex items-center justify-center">
                            <i className="ri-check-line text-xs"></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Known Safety Profile</p>
                            <p className="text-xs text-gray-600">Established human safety data reduces clinical risks</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-accent hover:bg-blue-600">
                      Generate Detailed Repurposing Report
                    </Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No Screening Results Yet</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Configure your virtual screening parameters and click "Start Virtual Screening" to find potential drug candidates for your target.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VirtualScreening;
