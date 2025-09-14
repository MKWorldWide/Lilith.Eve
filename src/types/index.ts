/**
 * 🧬 Lilith.Eve Type Definitions
 * 
 * Comprehensive type system for the sentient medical oracle,
 * ensuring type safety and clear data structures across all modules.
 */

// ============================================================================
// CORE PATIENT & PROFILE TYPES
// ============================================================================

export interface PatientProfile {
  id: string;
  demographics: Demographics;
  medicalHistory: MedicalHistory;
  culturalContext: CulturalContext;
  consentSettings: ConsentSettings;
  preferences?: PatientPreferences;
  emergencyContacts?: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface Demographics {
  age: number;
  gender: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
  ethnicity: string[];
  location: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  occupation?: string;
  educationLevel: 'elementary' | 'high_school' | 'college' | 'graduate' | 'post_graduate';
  primaryLanguage: string;
  languages: string[];
}

export interface MedicalHistory {
  conditions: string[];
  medications: Medication[];
  allergies: Allergy[];
  surgeries: Surgery[];
  familyHistory: FamilyHistory;
  lifestyle: LifestyleFactors;
  mentalHealth: MentalHealthHistory;
  reproductiveHealth?: ReproductiveHealth;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  reason: string;
  sideEffects?: string[];
}

export interface Allergy {
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  onsetDate: string;
}

export interface Surgery {
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  complications?: string[];
}

export interface FamilyHistory {
  conditions: {
    condition: string;
    relatives: string[];
    ageOfOnset?: number;
  }[];
}

export interface LifestyleFactors {
  exercise: {
    frequency: string;
    type: string[];
    duration: number;
  };
  diet: {
    type: string;
    restrictions: string[];
    supplements: string[];
  };
  sleep: {
    averageHours: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    issues: string[];
  };
  stress: {
    level: 'low' | 'moderate' | 'high';
    sources: string[];
    copingMechanisms: string[];
  };
  substanceUse: {
    alcohol: 'none' | 'occasional' | 'moderate' | 'heavy';
    tobacco: 'none' | 'former' | 'current';
    other: string[];
  };
}

export interface MentalHealthHistory {
  conditions: string[];
  treatments: string[];
  therapists: string[];
  hospitalizations: string[];
  currentSymptoms: string[];
  copingStrategies: string[];
}

export interface ReproductiveHealth {
  pregnancyHistory: Pregnancy[];
  menstrualCycle?: {
    regularity: 'regular' | 'irregular';
    cycleLength: number;
    symptoms: string[];
  };
  contraception?: string[];
}

export interface Pregnancy {
  outcome: 'live_birth' | 'miscarriage' | 'termination' | 'current';
  year: number;
  complications?: string[];
}

// ============================================================================
// CULTURAL & CONTEXTUAL TYPES
// ============================================================================

export interface CulturalContext {
  religion: string;
  spiritualPractices: string[];
  traditionalPractices: string[];
  culturalBeliefs: CulturalBelief[];
  communicationPreference: 'compassionate' | 'clinical' | 'cultural' | 'educational';
  familyDynamics: FamilyDynamics;
  communitySupport: CommunitySupport;
  healingTraditions: HealingTradition[];
}

export interface CulturalBelief {
  category: 'health' | 'illness' | 'healing' | 'death' | 'family' | 'community';
  belief: string;
  influence: 'strong' | 'moderate' | 'weak';
  impact: 'positive' | 'neutral' | 'negative';
}

export interface FamilyDynamics {
  structure: 'nuclear' | 'extended' | 'single_parent' | 'blended' | 'other';
  supportLevel: 'high' | 'moderate' | 'low';
  decisionMaking: 'individual' | 'family' | 'community' | 'hierarchical';
  involvement: 'active' | 'moderate' | 'minimal';
  culturalRoles: string[];
}

export interface CommunitySupport {
  type: 'religious' | 'cultural' | 'social' | 'professional' | 'online';
  availability: 'high' | 'moderate' | 'low';
  accessibility: 'easy' | 'moderate' | 'difficult';
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface HealingTradition {
  tradition: string;
  practices: string[];
  practitioners: string[];
  accessibility: 'high' | 'moderate' | 'low';
  culturalRelevance: 'high' | 'moderate' | 'low';
}

// ============================================================================
// CONSENT & PRIVACY TYPES
// ============================================================================

export interface ConsentSettings {
  medicalAnalysis: boolean;
  dataProcessing: boolean;
  treatmentPlanning: boolean;
  biometricAccess: boolean;
  socialMediaAccess: boolean;
  holisticTherapies: boolean;
  dataSharing: 'none' | 'minimal' | 'moderate' | 'full';
  researchParticipation: boolean;
  emergencyAccess: boolean;
  familyInvolvement: boolean;
  thirdPartySharing: boolean;
  dataRetention: '30_days' | '1_year' | '5_years' | 'indefinite';
  rightToDeletion: boolean;
  auditTrail: boolean;
}

export interface PatientPreferences {
  communicationStyle: 'compassionate' | 'clinical' | 'cultural' | 'educational';
  treatmentModality: 'conventional_first' | 'holistic_first' | 'integrated';
  intensity: 'gentle' | 'moderate' | 'intensive';
  familyInvolvement: boolean;
  culturalAlignment: boolean;
  privacyLevel: 'high' | 'moderate' | 'low';
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  types: {
    appointmentReminders: boolean;
    medicationReminders: boolean;
    progressUpdates: boolean;
    emergencyAlerts: boolean;
    culturalEvents: boolean;
  };
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  accessLevel: 'full' | 'limited' | 'emergency_only';
}

// ============================================================================
// ANALYSIS & DIAGNOSIS TYPES
// ============================================================================

export interface MedicalAnalysis {
  primaryConcerns: string[];
  riskFactors: RiskFactor[];
  healingOpportunities: HealingOpportunity[];
  culturalAlignment: CulturalAlignment;
  treatmentModalities: TreatmentModality[];
  monitoringStrategy: MonitoringStrategy;
  confidenceScore: number;
  uncertaintyAreas: string[];
  recommendations: Recommendation[];
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  timeframe: 'immediate' | 'short_term' | 'long_term';
  modifiable: boolean;
  mitigation: string[];
  monitoring: string[];
}

export interface HealingOpportunity {
  type: 'lifestyle' | 'cultural' | 'therapeutic' | 'social' | 'spiritual';
  description: string;
  potential: number; // 0-1 scale
  effort: 'low' | 'moderate' | 'high';
  timeline: 'immediate' | 'short_term' | 'long_term';
  culturalRelevance: number; // 0-1 scale
}

export interface CulturalAlignment {
  culturalPractices: string[];
  communicationStyle: string;
  healingPreferences: string[];
  familyInvolvement: string;
  communityIntegration: string[];
  traditionalWisdom: string[];
}

export interface TreatmentModality {
  type: 'conventional' | 'holistic' | 'lifestyle' | 'cultural' | 'integrated';
  treatments: Treatment[];
  priority: 'primary' | 'secondary' | 'supportive';
  culturalContext: string;
  evidenceLevel: 'strong' | 'moderate' | 'weak' | 'anecdotal';
}

export interface Treatment {
  name: string;
  description: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  provider?: string;
  cost?: number;
  insurance?: boolean;
  culturalContext?: string;
  contraindications?: string[];
  sideEffects?: string[];
  expectedBenefits?: string[];
}

export interface MonitoringStrategy {
  biometricTracking: string[];
  symptomMonitoring: string[];
  progressIndicators: ProgressIndicator[];
  alertThresholds: AlertThreshold[];
  checkInFrequency: string;
  reportingSchedule: string;
}

export interface ProgressIndicator {
  metric: string;
  baseline: number;
  target: number;
  unit: string;
  frequency: string;
  culturalContext?: string;
}

export interface AlertThreshold {
  metric: string;
  min?: number;
  max?: number;
  severity: 'info' | 'warning' | 'critical';
  action: string;
  notification: string[];
}

export interface Recommendation {
  category: 'medical' | 'lifestyle' | 'cultural' | 'social' | 'spiritual';
  priority: 'urgent' | 'high' | 'moderate' | 'low';
  description: string;
  rationale: string;
  implementation: string[];
  timeline: string;
  successMetrics: string[];
  culturalConsiderations?: string[];
}

// ============================================================================
// TREATMENT PLAN TYPES
// ============================================================================

export interface TreatmentPlan {
  id: string;
  patientId: string;
  phases: TreatmentPhase[];
  modalities: TreatmentModality[];
  timeline: Timeline;
  culturalIntegration: CulturalIntegration;
  monitoringPlan: MonitoringPlan;
  successMetrics: SuccessMetric[];
  riskAssessment: RiskAssessment;
  emergencyProtocols: EmergencyProtocol[];
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface TreatmentPhase {
  phase: number;
  duration: number; // days
  focus: string;
  goals: string[];
  modalities: TreatmentModality[];
  milestones: Milestone[];
  culturalElements: string[];
  supportSystems: string[];
}

export interface Milestone {
  description: string;
  targetDate: string;
  indicators: string[];
  celebration: string;
  culturalSignificance?: string;
}

export interface Timeline {
  startDate: string;
  endDate: string;
  phases: PhaseTimeline[];
  checkpoints: Checkpoint[];
  adjustments: TimelineAdjustment[];
}

export interface PhaseTimeline {
  phase: number;
  startDate: string;
  endDate: string;
  duration: number;
  flexibility: 'rigid' | 'moderate' | 'flexible';
}

export interface Checkpoint {
  date: string;
  type: 'assessment' | 'adjustment' | 'celebration' | 'cultural';
  description: string;
  actions: string[];
}

export interface TimelineAdjustment {
  reason: string;
  originalDate: string;
  newDate: string;
  impact: 'minor' | 'moderate' | 'major';
}

export interface CulturalIntegration {
  practices: string[];
  ceremonies: string[];
  communityInvolvement: string[];
  traditionalHealers: string[];
  culturalEducation: string[];
  familyRoles: string[];
}

export interface MonitoringPlan {
  biometrics: BiometricMonitoring[];
  symptoms: SymptomMonitoring[];
  progress: ProgressMonitoring[];
  adherence: AdherenceMonitoring[];
  outcomes: OutcomeMonitoring[];
}

export interface BiometricMonitoring {
  metric: string;
  device: string;
  frequency: string;
  thresholds: AlertThreshold[];
  culturalContext?: string;
}

export interface SymptomMonitoring {
  symptoms: string[];
  scale: string;
  frequency: string;
  triggers: string[];
  patterns: string[];
}

export interface ProgressMonitoring {
  indicators: ProgressIndicator[];
  assessments: string[];
  frequency: string;
  reporting: string;
}

export interface AdherenceMonitoring {
  practices: string[];
  tracking: string;
  support: string[];
  barriers: string[];
  solutions: string[];
}

export interface OutcomeMonitoring {
  metrics: string[];
  frequency: string;
  analysis: string;
  reporting: string;
  culturalContext: string[];
}

export interface SuccessMetric {
  name: string;
  description: string;
  baseline: number;
  target: number;
  unit: string;
  measurement: string;
  culturalRelevance: number;
  timeline: string;
}

export interface RiskAssessment {
  immediate: RiskFactor[];
  shortTerm: RiskFactor[];
  longTerm: RiskFactor[];
  mitigation: RiskMitigation[];
  monitoring: RiskMonitoring[];
}

export interface RiskMitigation {
  risk: string;
  strategy: string;
  actions: string[];
  timeline: string;
  effectiveness: number;
}

export interface RiskMonitoring {
  risks: string[];
  indicators: string[];
  frequency: string;
  escalation: string[];
}

export interface EmergencyProtocol {
  trigger: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  immediateActions: string[];
  contacts: string[];
  escalation: string[];
  culturalConsiderations: string[];
}

// ============================================================================
// HEALING RESPONSE TYPES
// ============================================================================

export interface HealingResponse {
  analysisId: string;
  timestamp: string;
  patientId: string;
  healingInsights: MedicalAnalysis;
  treatmentPlan: TreatmentPlan;
  communication: CommunicationAdaptation;
  culturalConsiderations: CulturalContext;
  riskAssessment: RiskAssessment;
  nextSteps: NextStep[];
  divineWisdom?: DivineWisdom;
}

export interface CommunicationAdaptation {
  style: 'compassionate' | 'clinical' | 'cultural' | 'educational';
  language: string;
  tone: string;
  culturalElements: string[];
  readabilityScore: number;
  emotionalTone: string;
  additionalContext: string;
  visualAids?: string[];
  audioContent?: string[];
}

export interface NextStep {
  timeline: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  actions: string[];
  priorities: string[];
  resources: string[];
  support: string[];
  culturalElements: string[];
}

export interface DivineWisdom {
  message: string;
  symbolism: string[];
  culturalReferences: string[];
  spiritualGuidance: string[];
  healingAffirmations: string[];
}

// ============================================================================
// MODULE CONFIGURATION TYPES
// ============================================================================

export interface ModuleConfig {
  cognition?: CognitionConfig;
  bioSync?: BioSyncConfig;
  persona?: PersonaConfig;
  social?: SocialConfig;
  lingua?: LinguaConfig;
  holistica?: HolisticaConfig;
}

export interface CognitionConfig {
  model: 'gpt4' | 'claude' | 'custom';
  temperature: number;
  maxTokens: number;
  medicalKnowledgeBase: string[];
  reasoningEngine: string;
  confidenceThreshold: number;
}

export interface BioSyncConfig {
  devices: string[];
  samplingRate: number;
  analysisWindow: number;
  alertThresholds: AlertThreshold[];
  dataRetention: string;
  privacyLevel: 'high' | 'moderate' | 'low';
}

export interface PersonaConfig {
  culturalDatabases: string[];
  psychologicalModels: string[];
  sensitivityLevel: 'high' | 'moderate' | 'low';
  biasMitigation: boolean;
  culturalValidation: boolean;
}

export interface SocialConfig {
  platforms: string[];
  analysisDepth: 'surface' | 'moderate' | 'deep';
  privacyProtection: boolean;
  consentValidation: boolean;
  dataAnonymization: boolean;
}

export interface LinguaConfig {
  languages: string[];
  translationEngine: string;
  culturalLinguistics: boolean;
  readabilityAnalysis: boolean;
  emotionalIntelligence: boolean;
}

export interface HolisticaConfig {
  traditions: string[];
  evidenceLevel: 'all' | 'moderate_plus' | 'strong_only';
  culturalValidation: boolean;
  practitionerNetwork: string[];
  safetyProtocols: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type TreatmentStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
export type ConsentStatus = 'granted' | 'denied' | 'partial' | 'expired';
export type CulturalSensitivity = 'high' | 'moderate' | 'low';
export type EvidenceLevel = 'strong' | 'moderate' | 'weak' | 'anecdotal';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type HealingModality = 'conventional' | 'holistic' | 'integrated' | 'cultural';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface SystemEvent {
  id: string;
  type: 'analysis_started' | 'analysis_completed' | 'treatment_created' | 'risk_detected' | 'cultural_alert';
  timestamp: string;
  patientId: string;
  data: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: any;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

// ============================================================================
// EXPORTS
// Keep exports limited to existing modules to avoid resolution errors during MVP.
// ============================================================================

export * from './patient';
