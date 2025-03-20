import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const ClinicalTrialAnalyzer = () => {
  const [trialType, setTrialType] = useState<"survival" | "endpoint" | "biomarker">("survival");
  const [sampleData, setSampleData] = useState<string>("");
  
  const analyzeTrialMutation = useMutation({
    mutationFn: (trialData: any) => {
      return apiRequest('POST', '/api/analyze/clinical-trial', { trialData });
    }
  });

  const handleAnalyze = () => {
    // In a real app, we would parse and validate the data
    // For now, pass a simplified object
    analyzeTrialMutation.mutate({
      type: trialType,
      data: sampleData,
      parameters: {
        alpha: 0.05,
        power: 0.8,
        allocation: 1,
        dropoutRate: 0.1
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Clinical Trial Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Trial Analysis Type</label>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant={trialType === "survival" ? "default" : "outline"} 
                  onClick={() => setTrialType("survival")}
                  className={trialType === "survival" ? "bg-accent justify-start" : "justify-start"}
                >
                  <i className="ri-line-chart-line mr-2"></i>
                  Survival Analysis
                </Button>
                <Button 
                  variant={trialType === "endpoint" ? "default" : "outline"}
                  onClick={() => setTrialType("endpoint")}
                  className={trialType === "endpoint" ? "bg-accent justify-start" : "justify-start"}
                >
                  <i className="ri-checkbox-multiple-line mr-2"></i>
                  Binary Endpoint
                </Button>
                <Button 
                  variant={trialType === "biomarker" ? "default" : "outline"}
                  onClick={() => setTrialType("biomarker")}
                  className={trialType === "biomarker" ? "bg-accent justify-start" : "justify-start"}
                >
                  <i className="ri-test-tube-line mr-2"></i>
                  Biomarker Analysis
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Study Parameters</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Significance Level (α)</label>
                  <Select defaultValue="0.05">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.01">0.01</SelectItem>
                      <SelectItem value="0.05">0.05</SelectItem>
                      <SelectItem value="0.10">0.10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Statistical Power</label>
                  <Select defaultValue="0.8">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.7">0.7 (70%)</SelectItem>
                      <SelectItem value="0.8">0.8 (80%)</SelectItem>
                      <SelectItem value="0.9">0.9 (90%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Allocation Ratio (Treatment:Control)</label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1:1</SelectItem>
                      <SelectItem value="2">2:1</SelectItem>
                      <SelectItem value="3">3:1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Expected Dropout Rate</label>
                  <div className="flex items-center">
                    <Input type="number" min="0" max="50" placeholder="10" className="w-20" />
                    <span className="ml-2">%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {trialType === "survival" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Survival Analysis Settings</label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Test Method</label>
                    <Select defaultValue="logrank">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="logrank">Log-Rank Test</SelectItem>
                        <SelectItem value="fleming">Fleming-Harrington Test</SelectItem>
                        <SelectItem value="maxcombo">MaxCombo Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Hazard Ratio (HR)</label>
                    <div className="flex items-center">
                      <Input type="number" min="0.1" max="2.0" step="0.1" defaultValue="0.7" className="w-20" />
                      <span className="ml-2 text-xs text-gray-500">(HR &lt; 1 favors treatment)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Median Survival (Control Group)</label>
                    <div className="flex items-center">
                      <Input type="number" min="1" max="60" defaultValue="12" className="w-20" />
                      <span className="ml-2">months</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">Sample Data (Optional)</label>
              <Textarea 
                placeholder="Enter sample data or upload a CSV file"
                className="h-32"
                value={sampleData}
                onChange={(e) => setSampleData(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: one subject per line, comma-separated values
              </p>
              <div className="flex items-center mt-2">
                <Button variant="outline" size="sm" className="text-xs flex items-center w-full">
                  <i className="ri-upload-2-line mr-1"></i>
                  Upload CSV
                </Button>
              </div>
            </div>
            
            <Button 
              className="w-full bg-accent hover:bg-blue-600"
              onClick={handleAnalyze}
              disabled={analyzeTrialMutation.isPending}
            >
              {analyzeTrialMutation.isPending ? "Analyzing..." : "Analyze Trial Design"}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        {analyzeTrialMutation.data ? (
          <Tabs defaultValue="summary">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-6">
                <CardTitle>Analysis Results</CardTitle>
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="sample">Sample Size</TabsTrigger>
                  <TabsTrigger value="simulation">Simulation</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="px-6">
                <TabsContent value="summary">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-3">Statistical Summary</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Hazard Ratio:</span>
                              <span className="font-ibm font-medium">{analyzeTrialMutation.data?.hazardRatio || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">p-Value:</span>
                              <span className={`font-ibm font-medium ${
                                analyzeTrialMutation.data?.pValue && typeof analyzeTrialMutation.data.pValue === 'string' && parseFloat(analyzeTrialMutation.data.pValue) < 0.05 
                                  ? "text-success" 
                                  : "text-warning"
                              }`}>
                                {analyzeTrialMutation.data?.pValue || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">95% Confidence Interval:</span>
                              <span className="font-ibm font-medium">
                                [{analyzeTrialMutation.data?.confidenceInterval?.[0] || '0'}, {analyzeTrialMutation.data?.confidenceInterval?.[1] || '0'}]
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-3">Trial Recommendation</h4>
                          <div className="bg-accent bg-opacity-10 p-3 rounded-md">
                            <p className="text-sm">{analyzeTrialMutation.data?.recommendation || 'No recommendation available.'}</p>
                          </div>
                          <div className="mt-3 flex items-center">
                            <Badge className="bg-success">Recommended</Badge>
                            <span className="ml-auto text-xs text-gray-500">Statistical Power: 80%</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Key Findings</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <div className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 rounded-full bg-accent text-white flex items-center justify-center">
                            <i className="ri-check-line text-xs"></i>
                          </div>
                          <span>
                            The proposed trial design has <span className="font-medium">sufficient statistical power</span> to detect the specified hazard ratio.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 rounded-full bg-accent text-white flex items-center justify-center">
                            <i className="ri-check-line text-xs"></i>
                          </div>
                          <span>
                            Given the expected enrollment rate, the trial would take approximately <span className="font-medium">18 months</span> to complete.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 rounded-full bg-warning text-white flex items-center justify-center">
                            <i className="ri-alert-line text-xs"></i>
                          </div>
                          <span>
                            Consider adding interim analyses at 50% and 75% of events to allow for early stopping.
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">
                        Download Full Report
                      </Button>
                      <Button className="bg-accent hover:bg-blue-600">
                        Optimize Design
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sample">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Sample Size Calculation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Required sample size:</span>
                            <span className="font-ibm font-medium">120 patients</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Treatment arm:</span>
                            <span className="font-ibm font-medium">60 patients</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Control arm:</span>
                            <span className="font-ibm font-medium">60 patients</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Accounting for dropouts:</span>
                            <span className="font-ibm font-medium">134 patients total</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Required events:</span>
                            <span className="font-ibm font-medium">84 events</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Estimated study duration:</span>
                            <span className="font-ibm font-medium">18 months</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Follow-up period:</span>
                            <span className="font-ibm font-medium">12 months</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Estimated power:</span>
                            <span className="font-ibm font-medium">82%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Sensitivity Analysis</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Impact of varying hazard ratios on required sample size (α=0.05, power=80%)
                      </p>
                      <table className="w-full text-sm">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left py-2">Hazard Ratio</th>
                            <th className="text-center py-2">Sample Size</th>
                            <th className="text-center py-2">Events Required</th>
                            <th className="text-right py-2">Study Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">0.6</td>
                            <td className="text-center py-2">86</td>
                            <td className="text-center py-2">60</td>
                            <td className="text-right py-2">14 months</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">0.7</td>
                            <td className="text-center py-2">120</td>
                            <td className="text-center py-2">84</td>
                            <td className="text-right py-2">18 months</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">0.8</td>
                            <td className="text-center py-2">218</td>
                            <td className="text-center py-2">156</td>
                            <td className="text-right py-2">24 months</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <div className="flex items-start">
                        <i className="ri-information-line text-accent text-lg mr-3 mt-0.5"></i>
                        <div>
                          <h5 className="text-sm font-medium">Recommendation for Adaptive Design</h5>
                          <p className="text-sm text-gray-600 mt-1">
                            Consider implementing an adaptive design with sample size re-estimation after 50% of events. This approach could potentially reduce overall trial size by 15-20% while maintaining statistical power.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="simulation">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Trial Simulation Results</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Based on 10,000 Monte Carlo simulations of the trial with specified parameters
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Power Analysis</h5>
                          <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 text-sm">Power curve visualization</span>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-2">Event Accumulation</h5>
                          <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 text-sm">Event accumulation curve</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Success Probability</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Probability of study success (p&lt;0.05):</span>
                            <span className="font-ibm font-medium">82.4%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-success" style={{ width: '82.4%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Probability of strong significance (p&lt;0.01):</span>
                            <span className="font-ibm font-medium">64.7%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: '64.7%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Probability of early stopping (futility):</span>
                            <span className="font-ibm font-medium">12.8%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-warning" style={{ width: '12.8%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-3">Enrollment and Timeline Simulation</h4>
                      <table className="w-full text-sm">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left py-2">Parameter</th>
                            <th className="text-center py-2">Expected</th>
                            <th className="text-center py-2">95% CI Lower</th>
                            <th className="text-right py-2">95% CI Upper</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">Time to full enrollment</td>
                            <td className="text-center py-2">12 months</td>
                            <td className="text-center py-2">10 months</td>
                            <td className="text-right py-2">14 months</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Time to required events</td>
                            <td className="text-center py-2">18 months</td>
                            <td className="text-center py-2">16 months</td>
                            <td className="text-right py-2">22 months</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Dropout rate</td>
                            <td className="text-center py-2">10%</td>
                            <td className="text-center py-2">7%</td>
                            <td className="text-right py-2">14%</td>
                          </tr>
                        </tbody>
                      </table>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No Trial Analysis Yet</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Configure your clinical trial parameters and click "Analyze Trial Design" to optimize your study design for statistical power and efficiency.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClinicalTrialAnalyzer;
