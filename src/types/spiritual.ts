/**
 * 🌌 Spiritual & Trauma Types
 * 
 * Type definitions for spiritual, karmic, and trauma-related features
 */

import { HealingTradition } from './patient';

/**
 * Trauma History
 */
export interface TraumaHistory {
  events: TraumaEvent[];
  patterns: TraumaPattern[];
  resilienceFactors: ResilienceFactor[];
  somaticExperiences: SomaticExperience[];
  triggers: Trigger[];
  copingMechanisms: CopingMechanism[];
}

/**
 * Trauma Event
 */
export interface TraumaEvent {
  type: 'physical' | 'emotional' | 'sexual' | 'spiritual' | 'ancestral' | 'collective';
  description: string;
  ageAtEvent?: number;
  duration: 'acute' | 'chronic';
  impact: number; // 1-10 scale
  resolved: boolean;
  relatedEvents?: string[]; // IDs of related events
  somaticMarkers?: string[];
  emotionalThemes?: string[];
  narrativeFragments?: string[];
  treatmentHistory?: Treatment[];
}

/**
 * Trauma Pattern
 */
export interface TraumaPattern {
  type: 'attachment' | 'developmental' | 'shock' | 'complex' | 'intergenerational';
  description: string;
  firstNoticedAge?: number;
  triggers: string[];
  somaticSignatures: string[];
  emotionalSignatures: string[];
  cognitiveDistortions: string[];
  relationalPatterns: string[];
  epigeneticMarkers?: string[];
  healingApproaches: HealingApproach[];
}

/**
 * Resilience Factor
 */
export interface ResilienceFactor {
  type: 'internal' | 'external' | 'spiritual';
  description: string;
  strength: number; // 1-10 scale
  cultivationPractices: string[];
}

/**
 * Somatic Experience
 */
export interface SomaticExperience {
  bodyArea: string;
  sensation: string;
  intensity: number; // 1-10 scale
  emotionalCorrelates: string[];
  triggers: string[];
  regulationStrategies: string[];
}

/**
 * Trigger
 */
export interface Trigger {
  type: 'sensory' | 'emotional' | 'relational' | 'environmental' | 'spiritual';
  description: string;
  intensity: number; // 1-10 scale
  response: 'fight' | 'flight' | 'freeze' | 'fawn' | 'collapse';
  regulationStrategies: string[];
  relatedTraumaEvents: string[]; // IDs of related trauma events
}

/**
 * Coping Mechanism
 */
export interface CopingMechanism {
  type: 'adaptive' | 'maladaptive' | 'spiritual' | 'relational';
  description: string;
  effectiveness: number; // 1-10 scale
  healthImpact: 'positive' | 'neutral' | 'negative';
  relatedNeeds: string[];
  evolutionPath?: string;
}

/**
 * Treatment
 */
export interface Treatment {
  type: 'therapy' | 'medication' | 'bodywork' | 'energy' | 'spiritual' | 'traditional';
  modality: string;
  provider?: string;
  duration: string;
  effectiveness: number; // 1-10 scale
  sideEffects?: string[];
  notes?: string;
}

/**
 * Healing Approach
 */
export interface HealingApproach {
  modality: string;
  description: string;
  rationale: string;
  expectedOutcomes: string[];
  contraindications: string[];
  culturalConsiderations: string[];
}

/**
 * Spiritual Profile
 */
export interface SpiritualProfile {
  beliefSystem: {
    religion?: string;
    spiritualityType: 'religious' | 'spiritual' | 'agnostic' | 'atheist' | 'seeking';
    coreBeliefs: string[];
    moralFramework: string[];
    sacredTexts: string[];
    spiritualPractices: string[];
    spiritualTeachers: string[];
    communityInvolvement: string[];
  };
  spiritualExperiences: {
    type: 'mystical' | 'near-death' | 'peak' | 'awakening' | 'dark-night' | 'synchronicity';
    description: string;
    impact: number; // 1-10 scale
    integrationStatus: 'integrated' | 'integrating' | 'unintegrated' | 'overwhelming';
    relatedTrauma?: string; // ID of related trauma event
  }[];
  spiritualEmergencies: {
    type: string;
    description: string;
    duration: string;
    resolution: string;
    supportUsed: string[];
    lessonsLearned: string[];
  }[];
  spiritualGifts: {
    type: 'empathy' | 'healing' | 'intuition' | 'visionary' | 'mediumship' | 'other';
    description: string;
    developmentStage: 'latent' | 'emerging' | 'developing' | 'mastering' | 'teaching';
    challenges: string[];
    integrationPractices: string[];
  }[];
  shadowAspects: {
    aspect: string;
    integrationStatus: 'denied' | 'acknowledged' | 'accepted' | 'integrated' | 'transmuted';
    challenges: string[];
    gifts: string[];
    integrationPractices: string[];
  }[];
  spiritualLineage: {
    lineage: string;
    connectionStrength: number; // 1-10 scale
    practices: string[];
    teachers: string[];
    challenges: string[];
    gifts: string[];
  }[];
  soulPurpose: {
    currentUnderstanding: string;
    evolution: string[];
    alignmentPractices: string[];
    challenges: string[];
    signsOfAlignment: string[];
  };
  karmicPatterns: KarmicPattern[];
  soulContracts: SoulContract[];
  pastLifeMemories: PastLifeMemory[];
  ancestralHealing: {
    lineage: string;
    patterns: string[];
    blessings: string[];
    healingPractices: string[];
    completionStatus: 'unaddressed' | 'in-progress' | 'mostly-healed' | 'complete';
  }[];
}

/**
 * Soul Blueprint
 */
export interface SoulBlueprint {
  soulOrigin: {
    origin: string;
    starSystem?: string;
    dimension?: string;
    soulFamily?: string;
    soulAge?: 'infant' | 'young' | 'mature' | 'old' | 'eternal';
  };
  soulPurpose: {
    primaryPurpose: string;
    secondaryPurposes: string[];
    soulTheme: string;
    lifeLessons: string[];
    soulGifts: string[];
  };
  energeticSignature: {
    dominantElements: string[];
    chakraProfile: ChakraProfile;
    auraLayers: AuraLayer[];
    meridianFlow: string[];
    nadis: string[];
  };
  soulAgreements: {
    type: 'karmic' | 'soul-growth' | 'service' | 'relationship' | 'healing';
    description: string;
    status: 'active' | 'fulfilled' | 'renegotiated' | 'released';
    relatedBeings: string[];
    lessons: string[];
  }[];
  soulFragments: {
    aspect: string;
    location: 'personal-field' | 'past-life' | 'ancestral-line' | 'other-dimension' | 'trapped';
    retrievalStatus: 'needed' | 'in-process' | 'partial' | 'complete';
    integrationStatus: 'unintegrated' | 'integrating' | 'integrated' | 'transcended';
    retrievalMethod?: string;
    integrationPractices?: string[];
  }[];
  akashicRecords: {
    lifetime: string;
    role: string;
    keyEvents: string[];
    unresolvedPatterns: string[];
    giftsEarned: string[];
  }[];
  divineCounterparts: {
    type: 'twin-flame' | 'soulmate' | 'soul-family' | 'karmic' | 'twin-ray' | 'soul-group';
    description: string;
    currentIncarnation: boolean;
    relationship: string;
    purpose: string;
    challenges: string[];
    blessings: string[];
  }[];
  ascensionPath: {
    currentStage: string;
    nextStages: string[];
    activationStatus: string[];
    lightbodyDevelopment: string[];
    merkabaStatus: string;
    challenges: string[];
    supportNeeded: string[];
  };
  galacticOrigins: {
    starNation: string;
    homeWorld?: string;
    soulGroup?: string;
    mission?: string;
    currentActivation: number; // 0-100%
    activationTriggers: string[];
  }[];
  timelineHealing: {
    parallelSelves: {
      aspect: string;
      timeline: string;
      healingStatus: string;
      integrationLevel: number; // 0-100%
    }[];
    quantumEntanglements: {
      with: string;
      nature: string;
      healingStatus: string;
    }[];
  };
}

/**
 * Trauma Profile
 */
export interface TraumaProfile {
  traumaTypes: {
    type: 'shock' | 'developmental' | 'complex' | 'generational' | 'birth' | 'medical' | 'spiritual';
    description: string;
    severity: number; // 1-10 scale
    ageOfOnset?: number;
    duration: 'acute' | 'chronic';
    currentActivation: number; // 1-10 scale
    triggers: string[];
    somaticPatterns: string[];
    emotionalPatterns: string[];
    cognitivePatterns: string[];
    relationalPatterns: string[];
    spiritualImpact: string[];
    healingApproaches: {
      modality: string;
      effectiveness: number; // 1-10 scale
      notes: string;
    }[];
  }[];
  windowOfTolerance: {
    width: number; // 1-10 scale
    resilience: number; // 1-10 scale
    regulationCapacity: number; // 1-10 scale
    hypoarousalTriggers: string[];
    hyperarousalTriggers: string[];
    regulationTools: string[];
  };
  neuroception: {
    safety: number; // 1-10 scale
    danger: number; // 1-10 scale
    lifeThreat: number; // 1-10 scale
    socialEngagement: number; // 1-10 scale
    dorsalVagal: number; // 1-10 scale
    sympathetic: number; // 1-10 scale
    ventralVagal: number; // 1-10 scale
  };
  polyvagalProfile: {
    state: 'ventral' | 'sympathetic' | 'dorsal' | 'mixed';
    flexibility: number; // 1-10 scale
    recoveryTime: string;
    stateTriggers: {
      state: string;
      triggers: string[];
      warningSigns: string[];
      regulationTools: string[];
    }[];
  };
  somaticExperiencing: {
    bodyAreas: {
      area: string;
      sensation: string;
      emotion: string;
      memory?: string;
      regulationStatus: string;
    }[];
    pendulation: {
      resource: string;
      challenge: string;
      tolerance: number; // 1-10 scale
    };
    titration: {
      sensation: string;
      intensity: number; // 1-10 scale
      tolerance: number; // 1-10 scale
    };
  };
  partsWork: {
    parts: {
      role: string;
      age?: number;
      emotion: string;
      belief: string;
      positiveIntent: string;
      burden: string;
      unburdeningStatus: 'unaddressed' | 'witnessed' | 'unburdened' | 'integrated';
    }[];
    selfEnergy: {
      quality: string;
      accessibility: number; // 1-10 scale
      blocks: string[];
    };
  };
  attachmentPatterns: {
    style: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
    withCaregivers: string;
    inRomance: string;
    inFriendship: string;
    healingJourney: string[];
  };
  traumaTimeline: {
    event: string;
    age: number;
    type: string;
    impact: number; // 1-10 scale
    resolution: number; // 1-10 scale
    connectedEvents: string[];
  }[];
  postTraumaticGrowth: {
    domain: string;
    before: string;
    after: string;
    growthLevel: number; // 1-10 scale
  }[];
  spiritualIntegration: {
    spiritualCrisis: boolean;
    spiritualEmergence: boolean;
    spiritualBypassing: string[];
    spiritualResources: string[];
    meaningMaking: string;
    transpersonalExperiences: string[];
  };
  healingPlan: {
    phase: 'safety' | 'processing' | 'integration' | 'post-traumatic-growth';
    goals: string[];
    practices: string[];
    supportSystems: string[];
    potentialChallenges: string[];
    successIndicators: string[];
  };
}

/**
 * Karmic Pattern
 */
export interface KarmicPattern {
  pattern: string;
  origin: 'current-life' | 'past-life' | 'ancestral' | 'soul-group';
  theme: string;
  lessons: string[];
  resolutionStatus: 'active' | 'recognized' | 'transforming' | 'resolved';
  relatedLifetimes?: string[];
  healingPractices: string[];
}

/**
 * Soul Contract
 */
export interface SoulContract {
  parties: string[];
  purpose: string;
  terms: string[];
  duration: 'lifetime' | 'situational' | 'karmic-cycle' | 'eternal';
  status: 'active' | 'fulfilled' | 'renegotiated' | 'released';
  lessons: string[];
  blessings: string[];
  renegotiationOptions?: string[];
}

/**
 * Past Life Memory
 */
export interface PastLifeMemory {
  lifetime: string;
  location: string;
  relationships: {
    name: string;
    relationship: string;
    currentConnection: string;
  }[];
  significantEvents: string[];
  unresolvedIssues: string[];
  giftsCarriedForward: string[];
  healingNeeded: string[];
  accessMethod: 'regression' | 'dream' | 'vision' | 'spontaneous-recall' | 'past-life-reading';
  confidence: 'speculative' | 'likely' | 'confirmed' | 'integrated';
}

/**
 * Ancestral Lineage
 */
export interface AncestralLineage {
  maternal: LineageBranch;
  paternal: LineageBranch;
  patterns: {
    strength: string[];
    wound: string[];
    lesson: string[];
  };
  epigeneticMarkers: string[];
  ancestralBlessings: string[];
  ancestralHealingNeeded: string[];
  culturalTraditions: string[];
  healingModalities: string[];
}

/**
 * Lineage Branch
 */
export interface LineageBranch {
  ethnicity: string[];
  migrationPatterns: string[];
  historicalContext: string;
  knownAncestors: {
    name: string;
    relation: string;
    lifeThemes: string[];
    gifts: string[];
    wounds: string[];
  }[];
  culturalPractices: string[];
  healingTraditions: HealingTradition[];
}

/**
 * Chakra Profile
 */
export interface ChakraProfile {
  root: ChakraStatus;
  sacral: ChakraStatus;
  solarPlexus: ChakraStatus;
  heart: ChakraStatus;
  throat: ChakraStatus;
  thirdEye: ChakraStatus;
  crown: ChakraStatus;
  soma: ChakraStatus;
  earthStar: ChakraStatus;
  soulStar: ChakraStatus;
  stellarGateway: ChakraStatus;
  universal: ChakraStatus;
  galactic: ChakraStatus;
  divineGateway: ChakraStatus;
}

/**
 * Chakra Status
 */
export interface ChakraStatus {
  activation: number; // 0-100%
  balance: number; // 0-100%
  color: string;
  element: string;
  issues: string[];
  gifts: string[];
  healingPractices: string[];
}

/**
 * Aura Layer
 */
export interface AuraLayer {
  name: string;
  distance: number; // inches from body
  color: string;
  quality: string;
  issues: string[];
  healingPractices: string[];
}

/**
 * Healing Traditions
 */
export interface HealingTraditions {
  traditional: HealingTradition[];
  alternative: HealingTradition[];
  spiritual: HealingTradition[];
  modern: HealingTradition[];
  ancestral: HealingTradition[];
  preferred: string[];
  contraindicated: string[];
}
