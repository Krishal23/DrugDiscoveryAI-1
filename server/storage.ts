import { 
  users, type User, type InsertUser,
  targets, type Target, type InsertTarget,
  drugs, type Drug, type InsertDrug,
  interactions, type Interaction, type InsertInteraction,
  admetPredictions, type AdmetPrediction, type InsertAdmetPrediction,
  projects, type Project, type InsertProject,
  activities, type Activity, type InsertActivity
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Target operations
  getTargets(): Promise<Target[]>;
  getTarget(id: number): Promise<Target | undefined>;
  createTarget(target: InsertTarget): Promise<Target>;
  updateTarget(id: number, target: Partial<InsertTarget>): Promise<Target | undefined>;
  deleteTarget(id: number): Promise<boolean>;

  // Drug operations
  getDrugs(): Promise<Drug[]>;
  getDrugsByTarget(targetId: number): Promise<Drug[]>;
  getDrug(id: number): Promise<Drug | undefined>;
  createDrug(drug: InsertDrug): Promise<Drug>;
  updateDrug(id: number, drug: Partial<InsertDrug>): Promise<Drug | undefined>;
  deleteDrug(id: number): Promise<boolean>;

  // Interaction operations
  getInteractions(): Promise<Interaction[]>;
  getInteraction(id: number): Promise<Interaction | undefined>;
  getInteractionsByDrug(drugId: number): Promise<Interaction[]>;
  getInteractionsByTarget(targetId: number): Promise<Interaction[]>;
  createInteraction(interaction: InsertInteraction): Promise<Interaction>;

  // ADMET operations
  getAdmetPredictions(): Promise<AdmetPrediction[]>;
  getAdmetPrediction(id: number): Promise<AdmetPrediction | undefined>;
  getAdmetPredictionByDrug(drugId: number): Promise<AdmetPrediction | undefined>;
  createAdmetPrediction(prediction: InsertAdmetPrediction): Promise<AdmetPrediction>;

  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;

  // Activity operations
  getActivities(): Promise<Activity[]>;
  getActivitiesByProject(projectId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private targets: Map<number, Target>;
  private drugs: Map<number, Drug>;
  private interactions: Map<number, Interaction>;
  private admetPredictions: Map<number, AdmetPrediction>;
  private projects: Map<number, Project>;
  private activities: Map<number, Activity>;

  private userId: number;
  private targetId: number;
  private drugId: number;
  private interactionId: number;
  private admetPredictionId: number;
  private projectId: number;
  private activityId: number;

  constructor() {
    this.users = new Map();
    this.targets = new Map();
    this.drugs = new Map();
    this.interactions = new Map();
    this.admetPredictions = new Map();
    this.projects = new Map();
    this.activities = new Map();

    this.userId = 1;
    this.targetId = 1;
    this.drugId = 1;
    this.interactionId = 1;
    this.admetPredictionId = 1;
    this.projectId = 1;
    this.activityId = 1;

    // Seed with initial data
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Target operations
  async getTargets(): Promise<Target[]> {
    return Array.from(this.targets.values());
  }

  async getTarget(id: number): Promise<Target | undefined> {
    return this.targets.get(id);
  }

  async createTarget(insertTarget: InsertTarget): Promise<Target> {
    const id = this.targetId++;
    const createdAt = new Date();
    const target: Target = { ...insertTarget, id, createdAt };
    this.targets.set(id, target);
    return target;
  }

  async updateTarget(id: number, targetUpdate: Partial<InsertTarget>): Promise<Target | undefined> {
    const target = this.targets.get(id);
    if (!target) return undefined;

    const updatedTarget = { ...target, ...targetUpdate };
    this.targets.set(id, updatedTarget);
    return updatedTarget;
  }

  async deleteTarget(id: number): Promise<boolean> {
    return this.targets.delete(id);
  }

  // Drug operations
  async getDrugs(): Promise<Drug[]> {
    return Array.from(this.drugs.values());
  }

  async getDrugsByTarget(targetId: number): Promise<Drug[]> {
    return Array.from(this.drugs.values()).filter(drug => drug.targetId === targetId);
  }

  async getDrug(id: number): Promise<Drug | undefined> {
    return this.drugs.get(id);
  }

  async createDrug(insertDrug: InsertDrug): Promise<Drug> {
    const id = this.drugId++;
    const createdAt = new Date();
    const drug: Drug = { ...insertDrug, id, createdAt };
    this.drugs.set(id, drug);
    return drug;
  }

  async updateDrug(id: number, drugUpdate: Partial<InsertDrug>): Promise<Drug | undefined> {
    const drug = this.drugs.get(id);
    if (!drug) return undefined;

    const updatedDrug = { ...drug, ...drugUpdate };
    this.drugs.set(id, updatedDrug);
    return updatedDrug;
  }

  async deleteDrug(id: number): Promise<boolean> {
    return this.drugs.delete(id);
  }

  // Interaction operations
  async getInteractions(): Promise<Interaction[]> {
    return Array.from(this.interactions.values());
  }

  async getInteraction(id: number): Promise<Interaction | undefined> {
    return this.interactions.get(id);
  }

  async getInteractionsByDrug(drugId: number): Promise<Interaction[]> {
    return Array.from(this.interactions.values()).filter(interaction => interaction.drugId === drugId);
  }

  async getInteractionsByTarget(targetId: number): Promise<Interaction[]> {
    return Array.from(this.interactions.values()).filter(interaction => interaction.targetId === targetId);
  }

  async createInteraction(insertInteraction: InsertInteraction): Promise<Interaction> {
    const id = this.interactionId++;
    const createdAt = new Date();
    const interaction: Interaction = { ...insertInteraction, id, createdAt };
    this.interactions.set(id, interaction);
    return interaction;
  }

  // ADMET operations
  async getAdmetPredictions(): Promise<AdmetPrediction[]> {
    return Array.from(this.admetPredictions.values());
  }

  async getAdmetPrediction(id: number): Promise<AdmetPrediction | undefined> {
    return this.admetPredictions.get(id);
  }

  async getAdmetPredictionByDrug(drugId: number): Promise<AdmetPrediction | undefined> {
    return Array.from(this.admetPredictions.values()).find(prediction => prediction.drugId === drugId);
  }

  async createAdmetPrediction(insertPrediction: InsertAdmetPrediction): Promise<AdmetPrediction> {
    const id = this.admetPredictionId++;
    const createdAt = new Date();
    const prediction: AdmetPrediction = { ...insertPrediction, id, createdAt };
    this.admetPredictions.set(id, prediction);
    return prediction;
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const createdAt = new Date();
    const project: Project = { ...insertProject, id, createdAt };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = { ...project, ...projectUpdate };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // Activity operations
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async getActivitiesByProject(projectId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.projectId === projectId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const timestamp = new Date();
    const activity: Activity = { ...insertActivity, id, timestamp };
    this.activities.set(id, activity);
    return activity;
  }

  // Seed initial data for demonstration
  private seedData() {
    // Create a user
    const user: InsertUser = {
      username: "researcher",
      password: "password123",
      name: "Dr. Jane Doe",
      role: "Research Scientist"
    };
    this.createUser(user);

    // Create a project
    const project: InsertProject = {
      name: "Anti-Inflammatory Target Discovery",
      description: "Research project focused on finding novel anti-inflammatory targets",
      status: "In Progress"
    };
    this.createProject(project);

    // Create targets
    const tnfrTarget: InsertTarget = {
      name: "TNF-α Receptor (TNFR1)",
      description: "Tumor Necrosis Factor Receptor Type 1",
      uniprotId: "P19438",
      geneName: "TNFRSF1A",
      confidence: 94,
      druggabilityScore: 85,
      molecularWeight: "50 kDa",
      subcellularLocation: "Cell membrane",
      publicationCount: 245,
      pathwayCount: 12,
      existingDrugCount: 6,
      evidenceSummary: "TNFR1 is strongly associated with inflammatory processes across 245 publications. Key experimental validations include: Knockout studies in mouse models (n=18), Human genetic association studies (n=42), Expression analysis in disease tissues (n=73)"
    };
    
    const il6rTarget: InsertTarget = {
      name: "IL-6 Receptor",
      description: "Interleukin-6 Receptor Subunit Alpha",
      uniprotId: "P08887",
      geneName: "IL6R",
      confidence: 89,
      druggabilityScore: 80,
      molecularWeight: "48 kDa",
      subcellularLocation: "Cell membrane",
      publicationCount: 178,
      pathwayCount: 8,
      existingDrugCount: 4,
      evidenceSummary: "IL-6 receptor is involved in inflammatory signaling cascades"
    };
    
    const jak2Target: InsertTarget = {
      name: "JAK2 Kinase",
      description: "Janus Kinase 2",
      uniprotId: "O60674",
      geneName: "JAK2",
      confidence: 76,
      druggabilityScore: 75,
      molecularWeight: "130 kDa",
      subcellularLocation: "Cytoplasm",
      publicationCount: 132,
      pathwayCount: 9,
      existingDrugCount: 3,
      evidenceSummary: "JAK2 plays a crucial role in cytokine receptor signaling"
    };
    
    this.createTarget(tnfrTarget);
    this.createTarget(il6rTarget);
    this.createTarget(jak2Target);

    // Create drugs
    const drug1: InsertDrug = {
      name: "TNF-23",
      smiles: "CC1=CC=C(C=C1)NC(=O)NC2=CC=CC=C2F",
      targetId: 1,
      status: "lead",
      properties: { mw: 244.25, logP: 3.2, hDonors: 2, hAcceptors: 2 }
    };
    
    const drug2: InsertDrug = {
      name: "IL6R-12",
      smiles: "COC1=CC=C(C=C1)CN2C=NC3=CC=CC=C32",
      targetId: 2,
      status: "generated",
      properties: { mw: 264.32, logP: 3.5, hDonors: 0, hAcceptors: 2 }
    };
    
    this.createDrug(drug1);
    this.createDrug(drug2);

    // Create interactions
    const interaction1: InsertInteraction = {
      drugId: 1,
      targetId: 1,
      score: 85,
      confidence: 92,
      predictionMethod: "SVM"
    };
    
    const interaction2: InsertInteraction = {
      drugId: 2,
      targetId: 2,
      score: 72,
      confidence: 83,
      predictionMethod: "Random Forest"
    };
    
    this.createInteraction(interaction1);
    this.createInteraction(interaction2);

    // Create ADMET predictions
    const admet1: InsertAdmetPrediction = {
      drugId: 1,
      absorption: 75,
      distribution: 68,
      metabolism: 45,
      excretion: 82,
      toxicity: 32,
      overallScore: 65,
      predictionMethod: "XGBoost"
    };
    
    const admet2: InsertAdmetPrediction = {
      drugId: 2,
      absorption: 88,
      distribution: 72,
      metabolism: 65,
      excretion: 77,
      toxicity: 18,
      overallScore: 78,
      predictionMethod: "Neural Network"
    };
    
    this.createAdmetPrediction(admet1);
    this.createAdmetPrediction(admet2);

    // Create activities
    const activity1: InsertActivity = {
      projectId: 1,
      description: "New target identified: JAK2 Kinase",
      activityType: "target_identification"
    };
    
    const activity2: InsertActivity = {
      projectId: 1,
      description: "Drug generation completed",
      activityType: "drug_generation"
    };
    
    const activity3: InsertActivity = {
      projectId: 1,
      description: "ADMET analysis flagged compound TNF-23",
      activityType: "admet_analysis"
    };
    
    const activity4: InsertActivity = {
      projectId: 1,
      description: "Virtual screening completed",
      activityType: "virtual_screening"
    };
    
    this.createActivity(activity1);
    this.createActivity(activity2);
    this.createActivity(activity3);
    this.createActivity(activity4);
  }
}

export const storage = new MemStorage();
