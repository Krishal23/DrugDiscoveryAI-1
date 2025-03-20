import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import SummaryCard from "@/components/dashboard/SummaryCard";
import QuickAccessTool from "@/components/dashboard/QuickAccessTool";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import InsightPanel from "@/components/dashboard/InsightPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
  });
  
  const { data: targets } = useQuery({
    queryKey: ['/api/targets'],
  });
  
  const { data: drugs } = useQuery({
    queryKey: ['/api/drugs'],
  });

  return (
    <>
      {/* Project Overview Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-ibm font-semibold">
            Active Project: {projects?.[0]?.name || "Anti-Inflammatory Target Discovery"}
          </h2>
          <Badge className="bg-success bg-opacity-20 text-success">
            {projects?.[0]?.status || "In Progress"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard 
            title="Targets Identified" 
            value={targets?.length || 7} 
            icon="ri-target-line" 
            changeText="2 new this week" 
            changeType="increase" 
            linkText="View all" 
            linkUrl="/targets" 
            iconColor="text-accent"
          />
          
          <SummaryCard 
            title="Candidate Compounds" 
            value={drugs?.length || 24} 
            icon="ri-flask-line" 
            changeText="8 new this week" 
            changeType="increase" 
            linkText="View all" 
            linkUrl="/drug-generator" 
            iconColor="text-secondary"
          />
          
          <SummaryCard 
            title="Promising Leads" 
            value={drugs?.filter((d: any) => d.status === "lead")?.length || 3} 
            icon="ri-star-line" 
            changeText="1 new this week" 
            changeType="increase" 
            linkText="View details" 
            linkUrl="/interaction-predictor" 
            iconColor="text-warning"
          />
        </div>
      </div>
      
      {/* Main Tools Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Tabs defaultValue="targets">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <TabsList className="bg-transparent">
                <TabsTrigger value="targets" className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-accent px-4 py-3 font-ibm text-sm font-medium text-gray-500 hover:text-gray-700">
                  Target Identification
                </TabsTrigger>
                <TabsTrigger value="drugs" className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-accent px-4 py-3 font-ibm text-sm font-medium text-gray-500 hover:text-gray-700">
                  Drug Generation
                </TabsTrigger>
                <TabsTrigger value="interactions" className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-accent px-4 py-3 font-ibm text-sm font-medium text-gray-500 hover:text-gray-700">
                  Interaction Prediction
                </TabsTrigger>
                <TabsTrigger value="admet" className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-accent px-4 py-3 font-ibm text-sm font-medium text-gray-500 hover:text-gray-700">
                  ADMET Analysis
                </TabsTrigger>
                <TabsTrigger value="screening" className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-accent px-4 py-3 font-ibm text-sm font-medium text-gray-500 hover:text-gray-700">
                  Virtual Screening
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="targets" className="p-6">
              <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                <div className="md:w-3/5">
                  <h3 className="text-lg font-ibm font-medium mb-4">Recent Targets</h3>
                  <div className="space-y-3">
                    {targets?.slice(0, 3).map((target: any) => (
                      <div 
                        key={target.id}
                        className="bg-gray-50 p-3 rounded border border-gray-200 hover:border-accent cursor-pointer"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h5 className="font-ibm font-medium text-primary">{target.name}</h5>
                            <p className="text-sm text-gray-600">{target.description}</p>
                          </div>
                          <div className="pill bg-success bg-opacity-20 text-success px-2 py-1 rounded-full text-xs font-medium self-start">
                            {target.confidence}% Confidence
                          </div>
                        </div>
                        <div className="mt-2 flex space-x-6 text-xs text-gray-500">
                          <span><i className="ri-file-text-line mr-1"></i> {target.publicationCount} Publications</span>
                          <span><i className="ri-link-m mr-1"></i> {target.pathwayCount} Pathways</span>
                          <span><i className="ri-medicine-bottle-line mr-1"></i> {target.existingDrugCount} Existing Drugs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <a href="/targets" className="text-sm text-accent hover:underline">View all identified targets</a>
                  </div>
                </div>
                
                <div className="md:w-2/5 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-ibm font-medium mb-4">Target Discovery Insights</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <h4 className="text-sm font-medium mb-1">Top Pathways</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>TNF signaling</span>
                          <span className="font-medium">24 targets</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>IL-6/JAK/STAT3</span>
                          <span className="font-medium">18 targets</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>NF-κB signaling</span>
                          <span className="font-medium">15 targets</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <h4 className="text-sm font-medium mb-1">Literature Analysis</h4>
                      <p className="text-xs text-gray-600">
                        Recent publications show increased interest in kinase inhibitors targeting JAK/STAT pathway for inflammatory conditions.
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <h4 className="text-sm font-medium mb-1">Target Validation</h4>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Average confidence score:</span>
                        <span className="font-medium">86%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-success" style={{ width: '86%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="drugs" className="p-6">
              <h3 className="text-lg font-ibm font-medium mb-4">Drug Generation Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Click on "Drug Generator" to access the full drug generation tools.
              </p>
            </TabsContent>
            
            <TabsContent value="interactions" className="p-6">
              <h3 className="text-lg font-ibm font-medium mb-4">Interaction Prediction Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Click on "Interaction Prediction" to access the full interaction prediction tools.
              </p>
            </TabsContent>
            
            <TabsContent value="admet" className="p-6">
              <h3 className="text-lg font-ibm font-medium mb-4">ADMET Analysis Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Click on "ADMET Prediction" to access the full ADMET analysis tools.
              </p>
            </TabsContent>
            
            <TabsContent value="screening" className="p-6">
              <h3 className="text-lg font-ibm font-medium mb-4">Virtual Screening Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Click on "Virtual Screening" to access the full virtual screening tools.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Quick Access Tools Section */}
      <div className="mb-8">
        <h2 className="text-xl font-ibm font-semibold mb-4">Quick Access Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAccessTool 
            title="Drug Generator" 
            description="Generate novel drug candidates using reinforcement learning" 
            icon="ri-flask-line" 
            iconBgColor="bg-accent bg-opacity-10" 
            iconColor="text-accent" 
            buttonText="Open Tool" 
            buttonBorderColor="border-accent" 
            buttonTextColor="text-accent" 
            buttonHoverBgColor="bg-accent" 
            linkTo="/drug-generator"
          />
          
          <QuickAccessTool 
            title="Interaction Predictor" 
            description="Predict drug-target interactions with ML models" 
            icon="ri-pulse-line" 
            iconBgColor="bg-secondary bg-opacity-10" 
            iconColor="text-secondary" 
            buttonText="Open Tool" 
            buttonBorderColor="border-secondary" 
            buttonTextColor="text-secondary" 
            buttonHoverBgColor="bg-secondary" 
            linkTo="/interaction-predictor"
          />
          
          <QuickAccessTool 
            title="ADMET Analyzer" 
            description="Predict absorption, distribution, metabolism properties" 
            icon="ri-test-tube-line" 
            iconBgColor="bg-primary bg-opacity-10" 
            iconColor="text-primary" 
            buttonText="Open Tool" 
            buttonBorderColor="border-primary" 
            buttonTextColor="text-primary" 
            buttonHoverBgColor="bg-primary" 
            linkTo="/admet-analyzer"
          />
          
          <QuickAccessTool 
            title="Clinical Trial Analyzer" 
            description="Optimize clinical trials with survival analysis" 
            icon="ri-line-chart-line" 
            iconBgColor="bg-success bg-opacity-10" 
            iconColor="text-success" 
            buttonText="Open Tool" 
            buttonBorderColor="border-success" 
            buttonTextColor="text-success" 
            buttonHoverBgColor="bg-success" 
            linkTo="/clinical-trials"
          />
        </div>
      </div>
      
      {/* Recent Activities & Insights */}
      <div>
        <h2 className="text-xl font-ibm font-semibold mb-4">Recent Activities & Insights</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-ibm font-medium">Project Timeline</h3>
              <button className="text-xs text-gray-500 hover:text-gray-700">
                <i className="ri-more-2-fill"></i>
              </button>
            </div>
            
            {/* Activity Timeline */}
            <ActivityTimeline />
          </div>
          
          {/* Key Insights Panel */}
          <InsightPanel />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
