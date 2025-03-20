import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTargetSchema, 
  insertDrugSchema, 
  insertInteractionSchema, 
  insertAdmetPredictionSchema, 
  insertProjectSchema, 
  insertActivitySchema 
} from "@shared/schema";
import { z } from "zod";

// Import ML models
import { getTargetValidationNLP } from "./ml/nlpTargetValidation";
import { getInteractionPredictor } from "./ml/interactionPredictor";
import { getAdmetPredictor } from "./ml/admetPredictor";
import { getVirtualScreening } from "./ml/virtualScreening";
import { getClinicalTrialAnalyzer } from "./ml/clinicalTrialAnalyzer";
import { getDrugGenerator } from "./ml/drugGenerator";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Targets
  app.get("/api/targets", async (req: Request, res: Response) => {
    try {
      const targets = await storage.getTargets();
      res.json(targets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch targets" });
    }
  });

  app.get("/api/targets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const target = await storage.getTarget(id);
      
      if (!target) {
        return res.status(404).json({ message: "Target not found" });
      }
      
      res.json(target);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch target" });
    }
  });

  app.post("/api/targets", async (req: Request, res: Response) => {
    try {
      const targetData = insertTargetSchema.parse(req.body);
      const newTarget = await storage.createTarget(targetData);
      res.status(201).json(newTarget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid target data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create target" });
    }
  });

  app.put("/api/targets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const targetData = insertTargetSchema.partial().parse(req.body);
      const updatedTarget = await storage.updateTarget(id, targetData);
      
      if (!updatedTarget) {
        return res.status(404).json({ message: "Target not found" });
      }
      
      res.json(updatedTarget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid target data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update target" });
    }
  });

  app.delete("/api/targets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTarget(id);
      
      if (!success) {
        return res.status(404).json({ message: "Target not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete target" });
    }
  });

  // Drugs
  app.get("/api/drugs", async (req: Request, res: Response) => {
    try {
      const drugs = await storage.getDrugs();
      res.json(drugs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drugs" });
    }
  });

  app.get("/api/drugs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const drug = await storage.getDrug(id);
      
      if (!drug) {
        return res.status(404).json({ message: "Drug not found" });
      }
      
      res.json(drug);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drug" });
    }
  });

  app.get("/api/targets/:targetId/drugs", async (req: Request, res: Response) => {
    try {
      const targetId = parseInt(req.params.targetId);
      const drugs = await storage.getDrugsByTarget(targetId);
      res.json(drugs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drugs for target" });
    }
  });

  app.post("/api/drugs", async (req: Request, res: Response) => {
    try {
      const drugData = insertDrugSchema.parse(req.body);
      const newDrug = await storage.createDrug(drugData);
      res.status(201).json(newDrug);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid drug data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create drug" });
    }
  });

  app.put("/api/drugs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const drugData = insertDrugSchema.partial().parse(req.body);
      const updatedDrug = await storage.updateDrug(id, drugData);
      
      if (!updatedDrug) {
        return res.status(404).json({ message: "Drug not found" });
      }
      
      res.json(updatedDrug);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid drug data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update drug" });
    }
  });

  // Interactions
  app.get("/api/interactions", async (req: Request, res: Response) => {
    try {
      const interactions = await storage.getInteractions();
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interactions" });
    }
  });

  app.get("/api/drugs/:drugId/interactions", async (req: Request, res: Response) => {
    try {
      const drugId = parseInt(req.params.drugId);
      const interactions = await storage.getInteractionsByDrug(drugId);
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interactions for drug" });
    }
  });

  app.get("/api/targets/:targetId/interactions", async (req: Request, res: Response) => {
    try {
      const targetId = parseInt(req.params.targetId);
      const interactions = await storage.getInteractionsByTarget(targetId);
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interactions for target" });
    }
  });

  app.post("/api/interactions", async (req: Request, res: Response) => {
    try {
      const interactionData = insertInteractionSchema.parse(req.body);
      const newInteraction = await storage.createInteraction(interactionData);
      res.status(201).json(newInteraction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid interaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create interaction" });
    }
  });

  // ADMET Predictions
  app.get("/api/admet-predictions", async (req: Request, res: Response) => {
    try {
      const predictions = await storage.getAdmetPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ADMET predictions" });
    }
  });

  app.get("/api/drugs/:drugId/admet-prediction", async (req: Request, res: Response) => {
    try {
      const drugId = parseInt(req.params.drugId);
      const prediction = await storage.getAdmetPredictionByDrug(drugId);
      
      if (!prediction) {
        return res.status(404).json({ message: "ADMET prediction not found for this drug" });
      }
      
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ADMET prediction" });
    }
  });

  app.post("/api/admet-predictions", async (req: Request, res: Response) => {
    try {
      const predictionData = insertAdmetPredictionSchema.parse(req.body);
      const newPrediction = await storage.createAdmetPrediction(predictionData);
      res.status(201).json(newPrediction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ADMET prediction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ADMET prediction" });
    }
  });

  // Projects
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(projectData);
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Activities
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/projects/:projectId/activities", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const activities = await storage.getActivitiesByProject(projectId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities for project" });
    }
  });

  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const newActivity = await storage.createActivity(activityData);
      res.status(201).json(newActivity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // ML endpoints for drug discovery operations
  
  // Target validation with NLP
  app.post("/api/nlp/validate-target", async (req: Request, res: Response) => {
    try {
      const { targetDescription, geneName, disease } = req.body;
      
      if (!targetDescription || !geneName || !disease) {
        return res.status(400).json({ 
          message: "Target description, gene name, and disease are required" 
        });
      }
      
      // Get instance of NLP model
      const nlpModel = await getTargetValidationNLP();
      
      // Run validation using ML model
      const result = await nlpModel.validateTarget(targetDescription, geneName, disease);
      
      res.json(result);
    } catch (error) {
      console.error('Error in target validation:', error);
      res.status(500).json({ message: "Failed to validate target" });
    }
  });

  // Drug generation with RL/ML
  app.post("/api/generate/drug", async (req: Request, res: Response) => {
    try {
      const { targetId, similarTo, constraints, count } = req.body;
      
      if (!targetId) {
        return res.status(400).json({ message: "Target ID is required" });
      }
      
      // Get instance of drug generator model
      const generator = await getDrugGenerator();
      
      // Generate drug candidates using ML model
      const result = await generator.generateDrugCandidates(
        targetId, 
        similarTo, 
        constraints, 
        count || 5
      );
      
      res.json(result);
    } catch (error) {
      console.error('Error in drug generation:', error);
      res.status(500).json({ message: "Failed to generate drugs" });
    }
  });

  // Drug-target interaction prediction
  app.post("/api/predict/interaction", async (req: Request, res: Response) => {
    try {
      const { drugId, targetId } = req.body;
      
      if (!drugId || !targetId) {
        return res.status(400).json({ message: "Drug ID and Target ID are required" });
      }
      
      // Get the drug and target data from storage
      const drug = await storage.getDrug(Number(drugId));
      const target = await storage.getTarget(Number(targetId));
      
      if (!drug || !target) {
        return res.status(404).json({ 
          message: drug ? "Target not found" : "Drug not found" 
        });
      }
      
      // Get instance of interaction predictor model
      const predictor = await getInteractionPredictor();
      
      // Use a default protein sequence if not available
      const targetSequence = target.geneName || target.name;
      
      // Run interaction prediction using ML model
      const result = await predictor.predictInteraction(drug.smiles, targetSequence);
      
      res.json(result);
    } catch (error) {
      console.error('Error in interaction prediction:', error);
      res.status(500).json({ message: "Failed to predict interaction" });
    }
  });

  // ADMET properties prediction
  app.post("/api/predict/admet", async (req: Request, res: Response) => {
    try {
      const { smiles, drugId } = req.body;
      let smilesString = smiles;
      
      // If drugId is provided, get the SMILES from the database
      if (drugId && !smiles) {
        const drug = await storage.getDrug(Number(drugId));
        if (!drug) {
          return res.status(404).json({ message: "Drug not found" });
        }
        smilesString = drug.smiles;
      }
      
      if (!smilesString) {
        return res.status(400).json({ message: "SMILES string is required" });
      }
      
      // Get instance of ADMET predictor model
      const predictor = await getAdmetPredictor();
      
      // Run ADMET prediction using ML model
      const result = await predictor.predictAdmet(smilesString);
      
      res.json(result);
    } catch (error) {
      console.error('Error in ADMET prediction:', error);
      res.status(500).json({ message: "Failed to predict ADMET properties" });
    }
  });

  // Virtual screening
  app.post("/api/screen/virtual", async (req: Request, res: Response) => {
    try {
      const { targetId, screeningMode, topN } = req.body;
      
      if (!targetId) {
        return res.status(400).json({ 
          message: "Target ID is required" 
        });
      }
      
      // Get the target data from storage
      const target = await storage.getTarget(Number(targetId));
      
      if (!target) {
        return res.status(404).json({ message: "Target not found" });
      }
      
      // Get instance of virtual screening model
      const screeningModel = await getVirtualScreening();
      
      // Use default protein sequence if not available
      const targetSequence = target.geneName || target.name;
      
      // Run virtual screening using ML model
      const result = await screeningModel.screenCompounds(
        targetSequence, 
        screeningMode || 'docking', 
        topN || 10
      );
      
      res.json(result);
    } catch (error) {
      console.error('Error in virtual screening:', error);
      res.status(500).json({ message: "Failed to perform virtual screening" });
    }
  });

  // Clinical trial analysis
  app.post("/api/analyze/clinical-trial", async (req: Request, res: Response) => {
    try {
      const { trialData, drugId, comparatorId } = req.body;
      
      if (!trialData) {
        return res.status(400).json({ message: "Trial data is required" });
      }
      
      if (!drugId) {
        return res.status(400).json({ message: "Drug ID is required" });
      }
      
      // Get instance of clinical trial analyzer model
      const analyzer = await getClinicalTrialAnalyzer();
      
      // Run clinical trial analysis using ML model
      const result = await analyzer.analyzeTrial(Number(drugId), trialData, comparatorId);
      
      res.json(result);
    } catch (error) {
      console.error('Error in clinical trial analysis:', error);
      res.status(500).json({ message: "Failed to analyze clinical trial" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
