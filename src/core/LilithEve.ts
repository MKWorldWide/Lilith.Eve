/**
 * 🧬 Lilith.Eve — The Sentient Medical Oracle
 * 
 * Core orchestrator class that integrates all healing modules to provide
 * comprehensive, culturally-sensitive medical insights and treatment plans.
 * 
 * Divine Purpose: Bridge the gap between technology and healing wisdom,
 * honoring the whole being through personalized, compassionate care.
 */

import { CognitionAI } from './modules/CognitionAI';
import { BioSyncReader } from './modules/BioSyncReader';
import { PersonaScanner } from './modules/PersonaScanner';
import { SocialSynth } from './modules/SocialSynth';
import { LinguaCare } from './modules/LinguaCare';
import { Holistica } from './modules/Holistica';
import { 
  PatientProfile, 
  MedicalAnalysis, 
  TreatmentPlan, 
  HealingResponse,
  ModuleConfig,
  ConsentSettings
} from '../types';
import { PersonaAnalysisResult } from '../types/persona';
import { DivineMemoryStore } from './DivineMemoryStore';
import { logger } from '../utils/logger';

export class LilithEve {
  // Module instances with definite assignment assertion
  private cognitionAI!: CognitionAI;
  private bioSyncReader!: BioSyncReader;
  private personaScanner!: PersonaScanner;
  private socialSynth!: SocialSynth;
  private linguaCare!: LinguaCare;
  private holistica!: Holistica;
  
  private activeModules: Set<string> = new Set();
  private memoryStore: DivineMemoryStore;

  constructor(config: ModuleConfig = {}) {
    // Initialize memory store
    this.memoryStore = DivineMemoryStore.getInstance();
    this.initializeModules(config);
    
    // Set up graceful shutdown
    this.setupGracefulShutdown();
  }

  /**
   * 🌟 Divine Invocation: "Lilith.Eve, scan and align"
   * 
   * Initiates a comprehensive scan of the patient's physical, mental,
   * cultural, and energetic patterns, then aligns treatment recommendations
   * with their unique healing journey.
   */
  /**
   * 🌟 Divine Invocation: "Lilith.Eve, scan and align"
   * 
   * Enhanced to integrate PersonaScanner for deep persona analysis and
   * store insights in DivineMemoryStore for cross-session continuity.
   */
  async scanAndAlign(patientProfile: PatientProfile): Promise<HealingResponse> {
    const sessionId = `sess_${Date.now()}`;
    logger.info('Initiating scan and align', { sessionId, patientId: patientProfile.id });
    
    try {
      // Validate patient profile and consent before proceeding
      this.validatePatientProfile(patientProfile);
      
      // Initialize analysis pipeline
      const analysisId = this.generateAnalysisId();
      
      // Execute parallel module analysis including PersonaScanner
      const [
        medicalAnalysis,
        biometricPatterns,
        personaAnalysis,
        socialInsights,
        holisticOptions
      ] = await Promise.all([
        this.cognitionAI.analyzePatient(patientProfile),
        this.bioSyncReader.processBiometrics(patientProfile),
        this.personaScanner.analyzePersona(),  // Using analyzePersona instead of analyzeContext
        this.socialSynth.analyzeBehavior(patientProfile),
        this.holistica.getRecommendations(patientProfile)
      ]);
      
      // Store persona analysis in DivineMemoryStore
      await this.memoryStore.storeSession(sessionId, {
        analysisId,
        timestamp: new Date().toISOString(),
        personaAnalysis,
        patientId: patientProfile.id
      });
      
      // Log archetypal resonance for future analysis
      this.logArchetypalResonance(personaAnalysis);

      // Synthesize comprehensive healing insights with enhanced persona data
      const synthesizedAnalysis = await this.synthesizeInsights({
        medical: medicalAnalysis,
        biometric: biometricPatterns,
        persona: {
          ...personaAnalysis,
          traumaAnalysis: personaAnalysis.traumaAnalysis?.[0], // Flatten single-item array
          spiritualLineage: personaAnalysis.spiritualLineage,
          culturalAnalysis: personaAnalysis.culturalAnalysis,
          psychologicalAnalysis: personaAnalysis.psychologicalAnalysis
        },
        social: socialInsights,
        holistic: holisticOptions
      });

      // Generate personalized treatment plan
      const treatmentPlan = await this.generateTreatmentPlan(
        synthesizedAnalysis,
        patientProfile
      );

      // Adapt communication to patient's preferences with persona insights
      const healingResponse = await this.linguaCare.adaptCommunication(
        {
          ...treatmentPlan,
          personaInsights: {
            communicationProfile: personaAnalysis.communicationProfile,
            healingPreferences: personaAnalysis.healingPreferences
          }
        },
        {
          ...patientProfile.culturalContext,
          ...personaAnalysis.culturalAnalysis
        }
      );

      // Generate final response with integrated persona insights
      const response = {
        analysisId,
        timestamp: new Date().toISOString(),
        patientId: patientProfile.id,
        healingInsights: synthesizedAnalysis,
        treatmentPlan,
        communication: healingResponse,
        culturalConsiderations: {
          ...patientProfile.culturalContext,
          ...personaAnalysis.culturalAnalysis
        },
        personaInsights: {
          traumaPatterns: personaAnalysis.traumaAnalysis,
          spiritualLineage: personaAnalysis.spiritualLineage,
          psychologicalProfile: personaAnalysis.psychologicalAnalysis
        },
        riskAssessment: await this.assessRisk(synthesizedAnalysis),
        nextSteps: this.generateNextSteps(treatmentPlan)
      };

      return response;

    } catch (error) {
      console.error('Error in scanAndAlign:', error);
      throw new Error(`Healing analysis failed: ${error.message}`);
    }
  }

  /**
   * 🧠 Synthesizes insights from all modules into unified healing wisdom
   */
  private async synthesizeInsights(moduleResults: any): Promise<MedicalAnalysis> {
    const synthesis = {
      primaryConcerns: this.identifyPrimaryConcerns(moduleResults),
      riskFactors: this.assessRiskFactors(moduleResults),
      healingOpportunities: this.identifyHealingOpportunities(moduleResults),
      culturalAlignment: this.ensureCulturalAlignment(moduleResults),
      treatmentModalities: this.selectTreatmentModalities(moduleResults),
      monitoringStrategy: this.designMonitoringStrategy(moduleResults)
    };

    return synthesis;
  }

  /**
   * 💫 Generates personalized treatment plan aligned with patient's journey
   */
  private async generateTreatmentPlan(
    analysis: MedicalAnalysis,
    profile: PatientProfile
  ): Promise<TreatmentPlan> {
    const plan = {
      phases: this.designTreatmentPhases(analysis, profile),
      modalities: this.selectModalities(analysis, profile),
      timeline: this.createTimeline(analysis, profile),
      culturalIntegration: this.integrateCulturalElements(analysis, profile),
      monitoringPlan: this.createMonitoringPlan(analysis, profile),
      successMetrics: this.defineSuccessMetrics(analysis, profile)
    };

    return plan;
  }

  /**
   * 🔮 Assesses risk and provides safety recommendations
   */
  private async assessRisk(analysis: MedicalAnalysis): Promise<any> {
    const riskFactors = {
      immediate: this.identifyImmediateRisks(analysis),
      shortTerm: this.identifyShortTermRisks(analysis),
      longTerm: this.identifyLongTermRisks(analysis),
      mitigation: this.generateRiskMitigation(analysis)
    };

    return riskFactors;
  }

  /**
   * 🌿 Identifies primary health concerns across all dimensions
   */
  private identifyPrimaryConcerns(moduleResults: any): string[] {
    const concerns = new Set<string>();
    
    // Medical concerns from Cognition.AI
    if (moduleResults.medical?.diagnoses) {
      concerns.add(...moduleResults.medical.diagnoses);
    }
    
    // Biometric concerns from BioSync.Reader
    if (moduleResults.biometric?.anomalies) {
      concerns.add(...moduleResults.biometric.anomalies);
    }
    
    // Psychological concerns from Persona.Scanner
    if (moduleResults.persona?.stressors) {
      concerns.add(...moduleResults.persona.stressors);
    }
    
    return Array.from(concerns);
  }

  /**
   * 🎯 Identifies healing opportunities and growth potential
   */
  private identifyHealingOpportunities(moduleResults: any): any[] {
    const opportunities = [];
    
    // Lifestyle optimization opportunities
    if (moduleResults.social?.lifestyleInsights) {
      opportunities.push({
        type: 'lifestyle',
        description: 'Optimize daily routines for better health',
        potential: moduleResults.social.lifestyleInsights.optimizationPotential
      });
    }
    
    // Cultural healing practices
    if (moduleResults.holistic?.culturalPractices) {
      opportunities.push({
        type: 'cultural',
        description: 'Integrate traditional healing wisdom',
        practices: moduleResults.holistic.culturalPractices
      });
    }
    
    return opportunities;
  }

  /**
   * 🌍 Ensures cultural sensitivity and alignment
   */
  private ensureCulturalAlignment(moduleResults: any): any {
    return {
      culturalPractices: moduleResults.holistic?.culturalPractices || [],
      communicationStyle: moduleResults.persona?.preferredCommunication || 'compassionate',
      healingPreferences: moduleResults.persona?.healingPreferences || [],
      familyInvolvement: moduleResults.persona?.familyDynamics?.supportLevel || 'moderate'
    };
  }

  /**
   * 🧘‍♀️ Selects appropriate treatment modalities
   */
  private selectTreatmentModalities(moduleResults: any): any[] {
    const modalities = [];
    
    // Conventional medical treatments
    if (moduleResults.medical?.recommendations?.pharmaceutical) {
      modalities.push({
        type: 'conventional',
        treatments: moduleResults.medical.recommendations.pharmaceutical
      });
    }
    
    // Holistic and alternative treatments
    if (moduleResults.holistic?.recommendations) {
      modalities.push({
        type: 'holistic',
        treatments: moduleResults.holistic.recommendations
      });
    }
    
    // Lifestyle modifications
    if (moduleResults.social?.lifestyleRecommendations) {
      modalities.push({
        type: 'lifestyle',
        treatments: moduleResults.social.lifestyleRecommendations
      });
    }
    
    return modalities;
  }

  /**
   * 📊 Designs comprehensive monitoring strategy
   */
  private designMonitoringStrategy(moduleResults: any): any {
    return {
      biometricTracking: moduleResults.biometric?.trackingRecommendations || [],
      symptomMonitoring: moduleResults.medical?.symptomTracking || [],
      progressIndicators: this.defineProgressIndicators(moduleResults),
      alertThresholds: this.setAlertThresholds(moduleResults),
      checkInFrequency: this.determineCheckInFrequency(moduleResults)
    };
  }

  /**
   * 🎨 Designs treatment phases for progressive healing
   */
  private designTreatmentPhases(analysis: MedicalAnalysis, profile: PatientProfile): any[] {
    const phases = [];
    const totalDuration = this.calculateOptimalDuration(analysis, profile);
    
    // Phase 1: Foundation and Stabilization
    phases.push({
      phase: 1,
      duration: Math.ceil(totalDuration * 0.3),
      focus: 'stabilization',
      goals: ['reduce_acute_symptoms', 'establish_routines', 'build_trust'],
      modalities: this.selectPhaseModalities(analysis, profile, 'foundation')
    });
    
    // Phase 2: Growth and Integration
    phases.push({
      phase: 2,
      duration: Math.ceil(totalDuration * 0.5),
      focus: 'integration',
      goals: ['implement_lifestyle_changes', 'develop_coping_skills', 'build_support_systems'],
      modalities: this.selectPhaseModalities(analysis, profile, 'growth')
    });
    
    // Phase 3: Sustainability and Mastery
    phases.push({
      phase: 3,
      duration: Math.ceil(totalDuration * 0.2),
      focus: 'sustainability',
      goals: ['maintain_progress', 'prevent_relapse', 'foster_independence'],
      modalities: this.selectPhaseModalities(analysis, profile, 'sustainability')
    });
    
    return phases;
  }

  /**
   * 🌟 Generates next steps for patient empowerment
   */
  private generateNextSteps(treatmentPlan: TreatmentPlan): any[] {
    const nextSteps = [];
    
    // Immediate actions (next 24-48 hours)
    nextSteps.push({
      timeline: 'immediate',
      actions: [
        'Review treatment plan with healthcare provider',
        'Set up monitoring devices and apps',
        'Schedule first therapy session',
        'Begin daily meditation practice'
      ]
    });
    
    // Short-term goals (next week)
    nextSteps.push({
      timeline: 'short_term',
      actions: [
        'Establish daily routines',
        'Connect with support community',
        'Begin nutritional changes',
        'Schedule follow-up appointment'
      ]
    });
    
    return nextSteps;
  }

  /**
   * 🔧 Utility methods for system management
   */
  /**
   * 🔄 Initialize all modules with configuration
   */
  private initializeModules(config: ModuleConfig): void {
    logger.info('Initializing modules', { config });
    
    try {
      this.cognitionAI = new CognitionAI(config.cognition || {});
      this.bioSyncReader = new BioSyncReader(config.bioSync || {});
      
      // Initialize PersonaScanner with proper config
      this.personaScanner = new PersonaScanner(
        {} as PatientProfile, // Will be set in scanAndAlign
        {
          sensitivityLevel: 'medium',
          biasMitigation: true,
          culturalValidation: true
        }
      );
      
      this.activeModules.add('persona-scanner');
      logger.debug('PersonaScanner initialized');
      
      this.socialSynth = new SocialSynth(config.social || {});
      this.linguaCare = new LinguaCare(config.lingua || {});
      this.holistica = new Holistica(config.holistica || {});
      
      logger.info('All modules initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize modules', { error });
      throw new Error(`Module initialization failed: ${error.message}`);
    }
  }

  private validatePatientProfile(profile: PatientProfile): void {
    if (!profile.id) {
      throw new Error('Patient ID is required');
    }
    
    if (!profile.consentSettings) {
      throw new Error('Consent settings are required');
    }
    
    // Validate consent for each requested module
    this.validateConsent(profile.consentSettings);
  }

  private validateConsent(consent: ConsentSettings): void {
    const requiredConsents: (keyof ConsentSettings)[] = [
      'medicalAnalysis',
      'dataProcessing',
      'treatmentPlanning'
    ];
    
    for (const consentType of requiredConsents) {
      if (!consent[consentType]) {
        throw new Error(`Consent required for: ${consentType}`);
      }
    }
  }
  
  /**
   * Handles graceful shutdown of the LilithEve instance
   */
  /**
   * Process soul-aligned recommendations at session close
   */
  private async processSessionClose(): Promise<void> {
    try {
      // Get the current session ID (you might need to track this in your class)
      const currentSessionId = this.getCurrentSessionId();
      
      if (!currentSessionId) {
        logger.warn('No active session found during shutdown');
        return;
      }

      // Retrieve the persona analysis from the memory store
      const sessionData = await this.memoryStore.getSession(currentSessionId);
      
      if (!sessionData?.personaAnalysis) {
        logger.warn('No persona analysis found for current session');
        return;
      }

      // Generate soul-aligned recommendations
      const recommendations = await this.personaScanner.generateSoulAlignedRecommendations(
        sessionData.patientId ? { id: sessionData.patientId } : { id: 'unknown' }
      );

      // Store the recommendations in the memory store
      await this.memoryStore.storeSession(currentSessionId, {
        ...sessionData,
        soulAlignedRecommendations: recommendations,
        sessionEnd: new Date().toISOString()
      });

      logger.info('Soul-aligned recommendations generated and stored', {
        sessionId: currentSessionId,
        recommendationCount: recommendations.length
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error processing session close', { 
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      // Don't rethrow to allow shutdown to continue
    }
  }

  /**
   * Handles graceful shutdown of the LilithEve instance
   */
  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      
      try {
        // Process session close and generate soul-aligned recommendations
        await this.processSessionClose();
        
        // Close any open connections or cleanup resources
        await this.memoryStore?.disconnect();
        
        logger.info('Graceful shutdown complete');
        process.exit(0);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Error during shutdown', { 
          error: errorMessage,
          stack: error instanceof Error ? error.stack : undefined
        });
        process.exit(1);
      }
    };

    // Handle different shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      logger.error('Uncaught exception', { 
        error: error.message,
        stack: error.stack 
      });
      
      try {
        await this.processSessionClose();
      } catch (e) {
        // Ignore errors during emergency session close
      }
      
      process.exit(1);
    });
  }
  
  /**
   * Logs archetypal resonance patterns for future analysis
   */
  private logArchetypalResonance(analysis: PersonaAnalysisResult): void {
    try {
      const resonanceData = {
        timestamp: new Date().toISOString(),
        patientId: analysis.patientId,
        traumaPatterns: analysis.traumaAnalysis?.map(t => t.type) || [],
        spiritualArchetypes: analysis.spiritualLineage?.archetypes || [],
        karmicThemes: analysis.spiritualLineage?.karmicPatterns?.map(k => k.theme) || []
      };
      
      logger.info('Archetypal resonance logged', { resonanceData });
      // Could also store in analytics database or similar
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to log archetypal resonance', { error: errorMessage });
    }
  }

  /**
   * Get the current session ID
   * This is a simplified implementation - you might want to track the current session ID
   * in your class properties or retrieve it from a request context
   */
  private getCurrentSessionId(): string | null {
    // In a real implementation, you might get this from:
    // 1. A class property that's set when a session starts
    // 2. A request context (if running in a web server)
    // 3. A session management service
    return null; // Return null if no active session
  }

  private generateAnalysisId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Additional utility methods would be implemented here...
  private identifyImmediateRisks(analysis: MedicalAnalysis): any[] { return []; }
  private identifyShortTermRisks(analysis: MedicalAnalysis): any[] { return []; }
  private identifyLongTermRisks(analysis: MedicalAnalysis): any[] { return []; }
  private generateRiskMitigation(analysis: MedicalAnalysis): any[] { return []; }
  private assessRiskFactors(moduleResults: any): any[] { return []; }
  private defineProgressIndicators(moduleResults: any): any[] { return []; }
  private setAlertThresholds(moduleResults: any): any { return {}; }
  private determineCheckInFrequency(moduleResults: any): string { return 'weekly'; }
  private calculateOptimalDuration(analysis: MedicalAnalysis, profile: PatientProfile): number { return 90; }
  private selectPhaseModalities(analysis: MedicalAnalysis, profile: PatientProfile, phase: string): any[] { return []; }
  private selectModalities(analysis: MedicalAnalysis, profile: PatientProfile): any[] { return []; }
  private createTimeline(analysis: MedicalAnalysis, profile: PatientProfile): any { return {}; }
  private integrateCulturalElements(analysis: MedicalAnalysis, profile: PatientProfile): any { return {}; }
  private createMonitoringPlan(analysis: MedicalAnalysis, profile: PatientProfile): any { return {}; }
  private defineSuccessMetrics(analysis: MedicalAnalysis, profile: PatientProfile): any[] { return []; }
}

export default LilithEve; 