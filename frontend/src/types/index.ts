/**
 * Core TypeScript Types for Lilith.Eve Dashboard
 * 
 * This file contains all the type definitions used throughout the dashboard,
 * including API responses, component props, and state management types.
 */

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  lastLogin: string
  permissions: Permission[]
}

export type UserRole = 'patient' | 'guardian' | 'doctor' | 'admin' | 'devops'

export interface Permission {
  resource: string
  actions: string[]
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// ============================================================================
// SYSTEM VITALS TYPES
// ============================================================================

export interface SystemVital {
  module: string
  status: 'active' | 'inactive' | 'error' | 'warning'
  lastSync: string
  anomalies: number
  performance: number
  uptime: number
  responseTime: number
}

export interface ModuleStatus {
  name: string
  status: SystemVital['status']
  lastSync: string
  anomalies: string[]
  performance: number
  details: Record<string, any>
}

// ============================================================================
// PATIENT TYPES
// ============================================================================

export interface Patient {
  id: string
  name: string
  email: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phone: string
  address: Address
  emergencyContact: EmergencyContact
  medicalHistory: MedicalHistory
  culturalContext: CulturalContext
  lifestyle: Lifestyle
  holisticPreferences: HolisticPreferences
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email: string
}

export interface MedicalHistory {
  conditions: MedicalCondition[]
  medications: Medication[]
  allergies: Allergy[]
  surgeries: Surgery[]
  familyHistory: FamilyHistory[]
}

export interface MedicalCondition {
  id: string
  name: string
  diagnosisDate: string
  severity: 'mild' | 'moderate' | 'severe'
  status: 'active' | 'resolved' | 'chronic'
  notes: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  prescribedBy: string
  notes: string
}

export interface Allergy {
  id: string
  allergen: string
  severity: 'mild' | 'moderate' | 'severe'
  reaction: string
  notes: string
}

export interface Surgery {
  id: string
  procedure: string
  date: string
  hospital: string
  surgeon: string
  notes: string
}

export interface FamilyHistory {
  id: string
  condition: string
  relationship: string
  ageOfOnset?: number
  notes: string
}

export interface CulturalContext {
  ethnicity: string[]
  religion: string
  spiritualBeliefs: string
  culturalPractices: string[]
  language: string
  dietaryRestrictions: string[]
  traditionalMedicine: string[]
}

export interface Lifestyle {
  diet: string
  exercise: string
  sleepPattern: string
  stressLevel: 'low' | 'moderate' | 'high'
  occupation: string
  hobbies: string[]
  socialSupport: string
}

export interface HolisticPreferences {
  alternativeMedicine: string[]
  spiritualPractices: string[]
  meditation: boolean
  yoga: boolean
  acupuncture: boolean
  herbalMedicine: boolean
  energyHealing: boolean
  chakraWork: boolean
}

// ============================================================================
// ENERGY SIGNATURE TYPES
// ============================================================================

export interface EnergySignature {
  patientId: string
  timestamp: string
  chakras: ChakraStatus[]
  aura: AuraData
  eeg: EEGData
  biometrics: BiometricData
  emotionalState: EmotionalState
}

export interface ChakraStatus {
  name: string
  level: number
  color: string
  status: 'balanced' | 'overactive' | 'underactive' | 'blocked'
  notes: string
}

export interface AuraData {
  colors: string[]
  intensity: number
  size: number
  clarity: number
  polarity: {
    left: number
    right: number
  }
}

export interface EEGData {
  alpha: number[]
  beta: number[]
  delta: number[]
  theta: number[]
  gamma: number[]
  timestamp: number[]
}

export interface BiometricData {
  heartRate: number
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  temperature: number
  oxygenSaturation: number
  respiratoryRate: number
}

export interface EmotionalState {
  primary: string
  secondary: string[]
  intensity: number
  valence: 'positive' | 'negative' | 'neutral'
  arousal: 'low' | 'medium' | 'high'
}

// ============================================================================
// AI ANALYSIS TYPES
// ============================================================================

export interface AIAnalysis {
  id: string
  patientId: string
  timestamp: string
  type: 'diagnostic' | 'treatment' | 'prognostic' | 'holistic'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  modules: ModuleAnalysis[]
  insights: Insight[]
  recommendations: Recommendation[]
  confidence: number
}

export interface ModuleAnalysis {
  module: string
  status: 'success' | 'error' | 'warning'
  data: Record<string, any>
  processingTime: number
  confidence: number
}

export interface Insight {
  id: string
  type: 'observation' | 'pattern' | 'correlation' | 'prediction'
  category: string
  title: string
  description: string
  confidence: number
  evidence: string[]
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface Recommendation {
  id: string
  type: 'medication' | 'lifestyle' | 'spiritual' | 'diagnostic' | 'referral'
  title: string
  description: string
  rationale: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  implementation: string
  expectedOutcome: string
  timeline: string
  cost: number
}

// ============================================================================
// TREATMENT TYPES
// ============================================================================

export interface TreatmentPlan {
  id: string
  patientId: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  title: string
  description: string
  goals: TreatmentGoal[]
  interventions: Intervention[]
  timeline: TreatmentTimeline
  progress: TreatmentProgress
  reviews: TreatmentReview[]
}

export interface TreatmentGoal {
  id: string
  title: string
  description: string
  targetDate: string
  status: 'pending' | 'in-progress' | 'achieved' | 'failed'
  metrics: GoalMetric[]
}

export interface GoalMetric {
  name: string
  currentValue: number
  targetValue: number
  unit: string
  progress: number
}

export interface Intervention {
  id: string
  type: 'medication' | 'therapy' | 'lifestyle' | 'spiritual' | 'procedure'
  title: string
  description: string
  dosage?: string
  frequency?: string
  duration: string
  startDate: string
  endDate?: string
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  effectiveness: number
  sideEffects: string[]
  notes: string
}

export interface TreatmentTimeline {
  phases: TreatmentPhase[]
  milestones: Milestone[]
  estimatedDuration: string
}

export interface TreatmentPhase {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  objectives: string[]
  interventions: string[]
}

export interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  status: 'pending' | 'achieved' | 'delayed'
  criteria: string[]
}

export interface TreatmentProgress {
  overallProgress: number
  phaseProgress: Record<string, number>
  goalProgress: Record<string, number>
  lastAssessment: string
  nextAssessment: string
  notes: string
}

export interface TreatmentReview {
  id: string
  date: string
  reviewer: string
  type: 'progress' | 'effectiveness' | 'completion'
  findings: string
  recommendations: string
  nextSteps: string
}

// ============================================================================
// DECISION FLOW TYPES
// ============================================================================

export interface DecisionNode {
  id: string
  type: 'input' | 'process' | 'decision' | 'output'
  name: string
  description: string
  status: 'idle' | 'active' | 'completed' | 'error'
  data: Record<string, any>
  children: string[]
  parent?: string
  position: { x: number; y: number }
}

export interface DecisionFlow {
  id: string
  name: string
  description: string
  nodes: DecisionNode[]
  edges: DecisionEdge[]
  status: 'idle' | 'running' | 'completed' | 'error'
  currentNode?: string
  history: DecisionHistory[]
}

export interface DecisionEdge {
  id: string
  source: string
  target: string
  condition?: string
  label?: string
}

export interface DecisionHistory {
  timestamp: string
  nodeId: string
  action: string
  data: Record<string, any>
  duration: number
}

// ============================================================================
// LILITH'S THOUGHTS TYPES
// ============================================================================

export interface LilithThought {
  id: string
  timestamp: string
  type: 'observation' | 'analysis' | 'recommendation' | 'question' | 'insight'
  category: 'medical' | 'spiritual' | 'emotional' | 'cultural' | 'system'
  content: string
  confidence: number
  relatedData: {
    patientId?: string
    analysisId?: string
    treatmentId?: string
    module?: string
  }
  metadata: {
    processingTime: number
    modelVersion: string
    context: string[]
  }
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface DashboardProps {
  className?: string
}

export interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export interface HeaderProps {
  title?: string
  subtitle?: string
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  text?: string
}

// ============================================================================
// WEBSOCKET TYPES
// ============================================================================

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
  id?: string
}

export interface SystemUpdate {
  type: 'vital' | 'thought' | 'analysis' | 'treatment'
  data: any
  timestamp: string
}

// ============================================================================
// CHART AND VISUALIZATION TYPES
// ============================================================================

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

export interface TimeSeriesData {
  timestamp: string
  value: number
  category?: string
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Status = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface Notification {
  id: string
  type: Status
  title: string
  message: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export interface Breadcrumb {
  label: string
  path: string
  active?: boolean
}

export interface MenuItem {
  id: string
  label: string
  icon: string
  path: string
  children?: MenuItem[]
  badge?: string | number
  disabled?: boolean
} 