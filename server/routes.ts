import type { Express, Request, Response } from "express";
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
  app.post("/api/nlp/validate-target", (req: Request, res: Response) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      
      // In a real app, this would call a NLP service
      // For now, return a mock response
      res.json({
        confidence: Math.floor(Math.random() * 30) + 70, // 70-99% confidence
        relevantPublications: Math.floor(Math.random() * 200) + 50,
        suggestedTargets: [
          { name: "TNF-α Receptor", score: 0.94 },
          { name: "IL-6 Receptor", score: 0.89 },
          { name: "JAK2 Kinase", score: 0.76 },
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate target" });
    }
  });

  // Drug generation with RL
  app.post("/api/generate/drug", (req: Request, res: Response) => {
    try {
      const { targetId, parameters } = req.body;
      
      if (!targetId) {
        return res.status(400).json({ message: "Target ID is required" });
      }
      
      // In a real app, this would call a drug generation service
      res.json({
        generatedDrugs: [
          { name: "Compound A", smiles: "CCC1=CC=C(C=C1)NC(=O)NC2=CC=CC=C2F", score: 0.92 },
          { name: "Compound B", smiles: "CC1=CC=C(C=C1)COC(=O)N2CCCCC2", score: 0.88 },
          { name: "Compound C", smiles: "CC1=CC=CC=C1NC(=O)C2=CC=C(C=C2)Cl", score: 0.76 }
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate drugs" });
    }
  });

  // Drug-target interaction prediction
  app.post("/api/predict/interaction", (req: Request, res: Response) => {
    try {
      const { drugId, targetId } = req.body;
      
      if (!drugId || !targetId) {
        return res.status(400).json({ message: "Drug ID and Target ID are required" });
      }
      
      // In a real app, this would use ML models
      res.json({
        score: Math.floor(Math.random() * 30) + 70,
        confidence: Math.floor(Math.random() * 20) + 80,
        bindingSites: [
          { position: "S1", affinity: "High" },
          { position: "S2", affinity: "Medium" }
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to predict interaction" });
    }
  });

  // ADMET properties prediction
  app.post("/api/predict/admet", (req: Request, res: Response) => {
    try {
      const { smiles } = req.body;
      
      if (!smiles) {
        return res.status(400).json({ message: "SMILES string is required" });
      }
      
      // In a real app, this would use ADMET prediction models
      res.json({
        absorption: Math.floor(Math.random() * 30) + 70,
        distribution: Math.floor(Math.random() * 30) + 70,
        metabolism: Math.floor(Math.random() * 40) + 60,
        excretion: Math.floor(Math.random() * 30) + 70,
        toxicity: Math.floor(Math.random() * 30), // Lower is better for toxicity
        overallScore: Math.floor(Math.random() * 30) + 70
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to predict ADMET properties" });
    }
  });

  // Virtual screening
  app.post("/api/screen/virtual", (req: Request, res: Response) => {
    try {
      const { targetId, compounds } = req.body;
      
      if (!targetId || !compounds || !Array.isArray(compounds)) {
        return res.status(400).json({ 
          message: "Target ID and array of compounds are required" 
        });
      }
      
      // In a real app, this would use virtual screening methods
      res.json({
        results: compounds.map((c: any, i: number) => ({
          compoundId: i + 1,
          name: c.name || `Compound ${i+1}`,
          score: Math.floor(Math.random() * 40) + 60,
          bindingEnergy: -(Math.random() * 10 + 5).toFixed(2)
        }))
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to perform virtual screening" });
    }
  });

  // Clinical trial analysis
  app.post("/api/analyze/clinical-trial", (req: Request, res: Response) => {
    try {
      const { trialData } = req.body;
      
      if (!trialData) {
        return res.status(400).json({ message: "Trial data is required" });
      }
      
      // In a real app, this would analyze clinical trial data
      res.json({
        hazardRatio: (Math.random() * 0.5 + 0.5).toFixed(2),
        pValue: (Math.random() * 0.05).toFixed(4),
        confidenceInterval: [
          (Math.random() * 0.3 + 0.4).toFixed(2),
          (Math.random() * 0.5 + 0.9).toFixed(2)
        ],
        recommendation: "Proceed to Phase II with sample size of 120 patients."
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze clinical trial" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
