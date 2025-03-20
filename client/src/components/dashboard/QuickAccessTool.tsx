import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface QuickAccessToolProps {
  title: string;
  description: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  buttonText: string;
  buttonBorderColor: string;
  buttonTextColor: string;
  buttonHoverBgColor: string;
  linkTo: string;
}

const QuickAccessTool = ({
  title,
  description,
  icon,
  iconBgColor,
  iconColor,
  buttonText,
  buttonBorderColor,
  buttonTextColor,
  buttonHoverBgColor,
  linkTo
}: QuickAccessToolProps) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm text-center card-hover">
      <div className={`${iconBgColor} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
        <i className={`${icon} ${iconColor} text-xl`}></i>
      </div>
      <h3 className="font-ibm font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <Link href={linkTo}>
        <Button 
          variant="outline" 
          className={`w-full py-2 text-sm border ${buttonBorderColor} ${buttonTextColor} rounded-md hover:${buttonHoverBgColor} hover:text-white transition-colors`}
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};

export default QuickAccessTool;
