import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface InsightItemProps {
  title: string;
  content: string;
  borderColor: string;
  bgColor: string;
}

interface StatItemProps {
  label: string;
  value: number;
  colorClass: string;
}

const InsightItem = ({ title, content, borderColor, bgColor }: InsightItemProps) => {
  return (
    <div className={`p-3 ${bgColor} rounded-md border-l-2 ${borderColor}`}>
      <h4 className="font-ibm font-medium text-sm mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  );
};

const StatItem = ({ label, value, colorClass }: StatItemProps) => {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-ibm">{value}%</span>
      </div>
      <Progress value={value} className={`h-2 ${colorClass}`} />
    </div>
  );
};

const InsightPanel = () => {
  const insights = [
    {
      title: "Lead Compound Structure",
      content: "Compounds with benzothiazole scaffold show consistently better binding to TNF-α receptor.",
      borderColor: "border-accent",
      bgColor: "bg-accent bg-opacity-5"
    },
    {
      title: "ADMET Improvement",
      content: "Adding 4-fluorine substitution improves metabolic stability across multiple compounds.",
      borderColor: "border-success",
      bgColor: "bg-success bg-opacity-5"
    },
    {
      title: "Clinical Consideration",
      content: "Patient stratification by TNF-α expression levels may improve efficacy in clinical trials.",
      borderColor: "border-warning",
      bgColor: "bg-warning bg-opacity-5"
    }
  ];

  const stats = [
    { label: "Target Validation Confidence", value: 87, colorClass: "bg-accent" },
    { label: "Candidate Efficiency Rate", value: 62, colorClass: "bg-success" },
    { label: "ADMET Success Prediction", value: 41, colorClass: "bg-warning" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="font-ibm font-medium mb-4">Key Project Insights</h3>
      
      {/* Insights Content */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <InsightItem 
            key={index} 
            title={insight.title} 
            content={insight.content} 
            borderColor={insight.borderColor} 
            bgColor={insight.bgColor} 
          />
        ))}
      </div>
      
      {/* Statistical Highlights */}
      <div className="mt-6">
        <h4 className="font-ibm font-medium text-sm mb-3">Statistical Highlights</h4>
        
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <StatItem 
              key={index} 
              label={stat.label} 
              value={stat.value} 
              colorClass={stat.colorClass} 
            />
          ))}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full mt-6 py-2 text-sm text-accent border border-accent rounded-md hover:bg-accent hover:text-white transition-colors"
      >
        View Full Analytics
      </Button>
    </div>
  );
};

export default InsightPanel;
