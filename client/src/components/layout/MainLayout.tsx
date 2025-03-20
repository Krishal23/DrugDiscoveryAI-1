import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useLocation } from "wouter";

interface MainLayoutProps {
  children: React.ReactNode;
}

const getTitleFromLocation = (location: string): string => {
  switch (location) {
    case "/":
      return "Drug Discovery Dashboard";
    case "/targets":
      return "Target Identification & Validation";
    case "/drug-generator":
      return "Drug Candidate Generation";
    case "/interaction-predictor":
      return "Drug-Target Interaction Prediction";
    case "/admet-analyzer":
      return "ADMET Properties Prediction";
    case "/virtual-screening":
      return "Virtual Screening & Drug Repurposing";
    case "/clinical-trials":
      return "Clinical Trial Optimization";
    default:
      return "Drug Discovery Assistant";
  }
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [location] = useLocation();
  const title = getTitleFromLocation(location);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <Header title={title} />
        <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
