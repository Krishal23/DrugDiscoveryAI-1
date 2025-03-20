import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MoleculeViewer from "../molecules/MoleculeViewer";
import { Target, Drug } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface DrugCompoundProps {
  name: string;
  smiles: string;
  score: number;
  selected?: boolean;
  onClick?: () => void;
}

const DrugCompound = ({ name, smiles, score, selected, onClick }: DrugCompoundProps) => {
  return (
    <Card className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-accent' : ''}`} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm">{name}</h4>
          <Badge className="bg-accent bg-opacity-20 text-accent">
            Score: {score}
          </Badge>
        </div>
        <div className="h-32 bg-gray-100 rounded-md mb-2 overflow-hidden">
          <MoleculeViewer smilesString={smiles} />
        </div>
        <p className="text-xs font-mono truncate" title={smiles}>
          {smiles}
        </p>
      </CardContent>
    </Card>
  );
};

const DrugGenerator = () => {
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [novelty, setNovelty] = useState<number[]>([70]);
  const [druglikeness, setDruglikeness] = useState<number[]>([80]);
  const [selectedCompound, setSelectedCompound] = useState<string | null>(null);
  
  const { data: targets, isLoading: targetsLoading } = useQuery({
    queryKey: ['/api/targets'],
  });

  const generateDrugsMutation = useMutation({
    mutationFn: (data: { targetId: number, parameters: any }) => {
      return apiRequest('POST', '/api/generate/drug', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/drugs'] });
    }
  });

  const handleGenerate = () => {
    if (!selectedTargetId) return;
    
    generateDrugsMutation.mutate({
      targetId: parseInt(selectedTargetId),
      parameters: {
        novelty: novelty[0],
        druglikeness: druglikeness[0],
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Drug Generation Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Target Protein</label>
              <Select
                value={selectedTargetId}
                onValueChange={setSelectedTargetId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a target" />
                </SelectTrigger>
                <SelectContent>
                  {targets?.map((target: Target) => (
                    <SelectItem key={target.id} value={target.id.toString()}>
                      {target.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Novelty Weight</label>
              <Slider
                value={novelty}
                onValueChange={setNovelty}
                max={100}
                step={1}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Similar to Known</span>
                <span>{novelty[0]}%</span>
                <span>Highly Novel</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Druglikeness Weight</label>
              <Slider
                value={druglikeness}
                onValueChange={setDruglikeness}
                max={100}
                step={1}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Less Restrictive</span>
                <span>{druglikeness[0]}%</span>
                <span>Lipinski Rules</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Custom SMILES Input (Optional)</label>
              <Input placeholder="Enter SMILES as starting point..." />
              <p className="text-xs text-gray-500 mt-1">Leave empty to generate from scratch</p>
            </div>
            
            <Button 
              className="w-full bg-accent hover:bg-blue-600" 
              onClick={handleGenerate}
              disabled={!selectedTargetId || generateDrugsMutation.isPending}
            >
              {generateDrugsMutation.isPending ? 'Generating...' : 'Generate Drug Candidates'}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Compounds</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="score">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Sort by Score</SelectItem>
                  <SelectItem value="novelty">Sort by Novelty</SelectItem>
                  <SelectItem value="druglikeness">Sort by Druglikeness</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {generateDrugsMutation.isPending ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-32 bg-gray-200 rounded-md mb-2"></div>
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : generateDrugsMutation.data ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generateDrugsMutation.data.generatedDrugs?.map((drug: any, index: number) => (
                  <DrugCompound
                    key={index}
                    name={drug.name}
                    smiles={drug.smiles}
                    score={drug.score * 100}
                    selected={selectedCompound === drug.smiles}
                    onClick={() => setSelectedCompound(drug.smiles)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">No Compounds Generated Yet</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Select a target protein and adjust the parameters, then click the "Generate Drug Candidates" button to start the generation process.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DrugGenerator;
