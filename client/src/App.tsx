import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import TargetIdentificationPage from "./pages/TargetIdentificationPage";
import DrugGeneratorPage from "./pages/DrugGeneratorPage";
import InteractionPredictorPage from "./pages/InteractionPredictorPage";
import AdmetAnalyzerPage from "./pages/AdmetAnalyzerPage";
import VirtualScreeningPage from "./pages/VirtualScreeningPage";
import ClinicalTrialPage from "./pages/ClinicalTrialPage";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/targets" component={TargetIdentificationPage} />
        <Route path="/drug-generator" component={DrugGeneratorPage} />
        <Route path="/interaction-predictor" component={InteractionPredictorPage} />
        <Route path="/admet-analyzer" component={AdmetAnalyzerPage} />
        <Route path="/virtual-screening" component={VirtualScreeningPage} />
        <Route path="/clinical-trials" component={ClinicalTrialPage} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
