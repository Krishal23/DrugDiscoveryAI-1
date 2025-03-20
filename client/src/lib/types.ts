// Common interfaces for API responses

export interface NlpValidationResponse {
  confidence: number;
  relevantPublications: number;
  suggestedTargets: {
    name: string;
    score: number;
  }[];
}

export interface DrugGenerationResponse {
  generatedDrugs: {
    name: string;
    smiles: string;
    score: number;
  }[];
}

export interface InteractionPredictionResponse {
  score: number;
  confidence: number;
  bindingSites: {
    position: string;
    affinity: string;
  }[];
}

export interface AdmetPredictionResponse {
  absorption: number;
  distribution: number;
  metabolism: number;
  excretion: number;
  toxicity: number;
  overallScore: number;
}

export interface VirtualScreeningResponse {
  results: {
    compoundId: number;
    name: string;
    score: number;
    bindingEnergy: string;
  }[];
}

export interface ClinicalTrialAnalysisResponse {
  hazardRatio: string;
  pValue: string;
  confidenceInterval: string[];
  recommendation: string;
}

// Utility types for frontend components

export interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: string;
  changeText: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  linkText: string;
  linkUrl: string;
  iconColor: string;
}

export interface QuickAccessToolProps {
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

export interface MoleculeViewerProps {
  pdbId?: string;
  smilesString?: string;
}

// Declare global types for 3Dmol.js
declare global {
  interface Window {
    $3Dmol: any;
  }
}
