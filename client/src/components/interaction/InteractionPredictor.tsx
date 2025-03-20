import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Target, Drug } from "@shared/schema";
import MoleculeViewer from "../molecules/MoleculeViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const InteractionPredictor = () => {
  const [selectedDrugId, setSelectedDrugId] = useState<string>("");
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  
  const { data: drugs } = useQuery({
    queryKey: ['/api/drugs'],
  });
  
  const { data: targets } = useQuery({
    queryKey: ['/api/targets'],
  });

  const predictInteractionMutation = useMutation({
    mutationFn: (data: { drugId: number, targetId: number }) => {
      return apiRequest('POST', '/api/predict/interaction', data);
    }
  });

  const handlePredictInteraction = () => {
    if (!selectedDrugId || !selectedTargetId) return;
    
    predictInteractionMutation.mutate({
      drugId: parseInt(selectedDrugId),
      targetId: parseInt(selectedTargetId)
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-accent";
    if (score >= 50) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Interaction Prediction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  {drugs && drugs.length > 0 ? drugs.map((drug: Drug) => (
                    <SelectItem key={drug.id} value={drug.id.toString()}>
                      {drug.name}
                    </SelectItem>
                  )) : <SelectItem value="none" disabled>No drugs available</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Select Target</label>
              <Select
                value={selectedTargetId}
                onValueChange={setSelectedTargetId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a target protein" />
                </SelectTrigger>
                <SelectContent>
                  {targets && targets.length > 0 ? targets.map((target: Target) => (
                    <SelectItem key={target.id} value={target.id.toString()}>
                      {target.name}
                    </SelectItem>
                  )) : <SelectItem value="none" disabled>No targets available</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Prediction Method</label>
              <Select defaultValue="svm">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="svm">Support Vector Machine</SelectItem>
                  <SelectItem value="rf">Random Forest</SelectItem>
                  <SelectItem value="ensemble">Ensemble (SVM+RF)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Different methods may produce varying results
              </p>
            </div>

            <Button 
              className="w-full bg-accent hover:bg-blue-600"
              onClick={handlePredictInteraction}
              disabled={!selectedDrugId || !selectedTargetId || predictInteractionMutation.isPending}
            >
              {predictInteractionMutation.isPending ? 'Predicting...' : 'Predict Interaction'}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        {predictInteractionMutation.data ? (
          <Tabs defaultValue="summary">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Interaction Prediction Results</h3>
                  <TabsList>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="details">Binding Details</TabsTrigger>
                    <TabsTrigger value="visualization">Visualization</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Drug: {drugs && drugs.length > 0 ? drugs.find((d: Drug) => d.id.toString() === selectedDrugId)?.name : 'N/A'}</h4>
                    <div className="h-24 bg-gray-100 rounded-md overflow-hidden">
                      <MoleculeViewer smilesString={drugs && drugs.length > 0 ? drugs.find((d: Drug) => d.id.toString() === selectedDrugId)?.smiles : ''} />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Target: {targets && targets.length > 0 ? targets.find((t: Target) => t.id.toString() === selectedTargetId)?.name : 'N/A'}</h4>
                    <div className="h-24 bg-gray-100 rounded-md overflow-hidden">
                      <MoleculeViewer pdbId="1TNF" />
                    </div>
                  </div>
                </div>
              </div>
              
              <TabsContent value="summary" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Interaction Score</h4>
                        <span className={`text-lg font-semibold ${getScoreColor(predictInteractionMutation.data?.score || 0)}`}>
                          {predictInteractionMutation.data?.score || 0}%
                        </span>
                      </div>
                      <Progress value={predictInteractionMutation.data?.score || 0} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        Score indicates the predicted binding affinity
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Prediction Confidence</h4>
                        <span className="text-lg font-semibold text-accent">
                          {predictInteractionMutation.data?.confidence || 0}%
                        </span>
                      </div>
                      <Progress value={predictInteractionMutation.data?.confidence || 0} className="h-2 bg-gray-200" />
                      <p className="text-xs text-gray-500 mt-1">
                        Confidence in the accuracy of the prediction
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Binding Sites</h4>
                    {predictInteractionMutation.data?.bindingSites && predictInteractionMutation.data.bindingSites.length > 0 ? predictInteractionMutation.data.bindingSites.map((site: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <div>
                          <span className="font-medium">{site.position}</span>
                          <p className="text-xs text-gray-500">Binding Position</p>
                        </div>
                        <Badge className={site.affinity === 'High' ? 'bg-success' : site.affinity === 'Medium' ? 'bg-accent' : 'bg-warning'}>
                          {site.affinity} Affinity
                        </Badge>
                      </div>
                    )) : <div className="text-gray-500 text-sm p-2">No binding sites data available</div>}
                    
                    <Button variant="outline" className="w-full mt-4">
                      Export Prediction Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="p-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Molecular Interaction Details</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2">Interaction Type</th>
                          <th className="text-left pb-2">Residues</th>
                          <th className="text-left pb-2">Strength</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Hydrogen Bond</td>
                          <td className="py-2">GLY-121, SER-119</td>
                          <td className="py-2">Strong</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Hydrophobic</td>
                          <td className="py-2">VAL-123, LEU-140</td>
                          <td className="py-2">Medium</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Ionic</td>
                          <td className="py-2">ARG-45</td>
                          <td className="py-2">Weak</td>
                        </tr>
                        <tr>
                          <td className="py-2">π-Stacking</td>
                          <td className="py-2">PHE-89</td>
                          <td className="py-2">Medium</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h4 className="text-sm font-medium">Binding Energy Components</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Van der Waals</p>
                        <p className="font-medium text-sm">-3.45 kcal/mol</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Electrostatic</p>
                        <p className="font-medium text-sm">-2.18 kcal/mol</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Hydrogen Bonding</p>
                        <p className="font-medium text-sm">-4.62 kcal/mol</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Desolvation</p>
                        <p className="font-medium text-sm">1.75 kcal/mol</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between">
                        <p className="font-medium">Total Binding Energy:</p>
                        <p className="font-semibold text-success">-8.50 kcal/mol</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="visualization" className="p-4">
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <div className="h-96 flex items-center justify-center bg-gray-800">
                    <MoleculeViewer />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      This visualization shows the predicted binding pose of the selected drug with the target protein. Key interaction points are highlighted.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-accent">Hydrogen Bond</Badge>
                      <Badge className="bg-success">Hydrophobic Interaction</Badge>
                      <Badge className="bg-warning">π-Stacking</Badge>
                      <Badge className="bg-secondary">Ionic Interaction</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No Interaction Data Yet</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Select a drug compound and target protein, then click "Predict Interaction" to analyze potential binding interactions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InteractionPredictor;
