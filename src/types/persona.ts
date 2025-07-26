/**
 * 🌟 Persona Types
 * 
 * Type definitions for the PersonaScanner module and related functionality,
 * including trauma analysis and spiritual lineage mapping.
 */

import { PatientProfile } from './patient';

/**
 * Cultural Analysis
 */
export interface CulturalAnalysis {
  religion?: string;
  spiritualPractices?: any;
  traditionalPractices?: any;
  healthBeliefs?: any;
  communicationPatterns?: any;
  decisionMaking?: any;
  culturalSensitivity?: number;
  recommendations?: any[];
}

/**
 * Psychological Analysis
 */
export interface PsychologicalAnalysis {
  stressPatterns?: any;
  personalityTraits?: any;
  learningStyle?: any;
  motivationFactors?: any;
  emotionalPatterns?: any;
  psychologicalResilience?: number;
  recommendations?: any[];
}

/**
 * Communication Profile
 */
export interface CommunicationProfile {
  preferredStyle?: string;
  languagePreferences?: any;
  informationProcessing?: any;
  emotionalCommunication?: any;
  decisionCommunication?: any;
  accessibilityNeeds?: any[];
  recommendations?: any[];
}

/**
 * Healing Preferences
 */
export interface HealingPreferences {
  healingModalities?: any;
  traditionalMedicine?: any;
  spiritualHealing?: any;
  familyInvolvement?: any;
  communityHealing?: any;
  contraindications?: any[];
  recommendations?: any[];
}

/**
 * Family Dynamics
 */
export interface FamilyDynamics {
  familyStructure?: any;
  supportSystems?: any;
  decisionProcesses?: any;
  culturalRoles?: any;
  intergenerationalDynamics?: any;
  supportLevel?: string;
  recommendations?: any[];
}

/**
 * Community Context
 */
export interface CommunityContext {
  communityType?: any;
  accessibility?: any;
  culturalPractices?: any;
  socialNetworks?: any;
  healthResources?: any;
  supportQuality?: string;
  recommendations?: any[];
}

/**
 * Trauma Analysis
 */
export interface TraumaAnalysis {
  type: 'physical' | 'emotional' | 'spiritual' | 'ancestral' | 'collective';
  intensity: number;
  activationTriggers: string[];
  somaticManifestations: string[];
  emotionalSignatures: string[];
  narrativeThemes: string[];
  lineageConnection?: {
    generation: number;
    ancestorPatterns: string[];
    epigeneticMarkers: string[];
  };
  resilienceFactors: {
    personal: string[];
    communal: string[];
    spiritual: string[];
  };
  recommendedHealingModalities: string[];
}

/**
 * Spiritual Lineage
 */
export interface SpiritualLineage {
  currentIncarnation: {
    lifeThemes: string[];
    soulPurpose: string[];
    karmicLessons: string[];
  };
  lineagePatterns: LineagePattern[];
  pastLifeConnections: PastLifeConnection[];
  soulGroupConnections: SoulGroupConnection;
}

/**
 * Lineage Pattern
 */
export interface LineagePattern {
  lineage: string;
  generation: number;
  patterns: {
    strength: string[];
    wound: string[];
    lesson: string[];
  };
  karmicThemes: string[];
  soulContracts: string[];
  epigeneticMarkers?: string[];
  culturalTraditions: string[];
  healingModalities: string[];
}

/**
 * Past Life Connection
 */
export interface PastLifeConnection {
  lifetime: string;
  relationship: string;
  unresolvedPatterns: string[];
  healingOpportunities: string[];
}

/**
 * Soul Group Connection
 */
export interface SoulGroupConnection {
  role: string;
  relationships: string[];
  collectivePurpose: string;
}

/**
 * Healing Recommendation
 */
export interface HealingRecommendation {
  category: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  practices: string[];
  contraindications?: string[];
  culturalConsiderations?: string[];
}

/**
 * Persona Analysis Result
 */
export interface PersonaAnalysisResult {
  culturalAnalysis: CulturalAnalysis;
  psychologicalAnalysis: PsychologicalAnalysis;
  communicationProfile: CommunicationProfile;
  healingPreferences: HealingPreferences;
  familyDynamics: FamilyDynamics;
  communityContext: CommunityContext;
  traumaAnalysis: TraumaAnalysis[];
  spiritualLineage: SpiritualLineage;
  recommendations: HealingRecommendation[];
  timestamp: string;
}
