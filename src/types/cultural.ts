/**
 * Cultural Types
 * 
 * Type definitions for cultural context and considerations
 */

/**
 * Cultural Context
 */
export interface CulturalContext {
  culturalIdentity: {
    ethnicity: string[];
    nationality: string[];
    languages: {
      primary: string;
      secondary: string[];
      proficiency: 'none' | 'basic' | 'conversational' | 'fluent' | 'native';
    }[];
    religion: {
      affiliation: string;
      importance: 'not_important' | 'somewhat_important' | 'very_important';
      practices: string[];
    };
    values: string[];
    traditions: string[];
  };
  
  healthBeliefs: {
    causesOfIllness: string[];
    treatmentPreferences: string[];
    traditionalPractices: string[];
    decisionMaking: 'individual' | 'family' | 'community' | 'spiritual';
    modestyConcerns: string[];
    dietaryRestrictions: string[];
  };
  
  communicationStyle: {
    directness: 'direct' | 'indirect' | 'contextual';
    formality: 'formal' | 'informal' | 'situational';
    nonVerbalCues: string[];
    touch: 'accepted' | 'limited' | 'restricted';
    eyeContact: 'direct' | 'avoided' | 'moderate';
    personalSpace: 'close' | 'moderate' | 'distant';
  };
  
  familyStructure: {
    type: 'nuclear' | 'extended' | 'single_parent' | 'blended' | 'other';
    decisionMaker: string;
    caregiverRoles: string[];
    genderRoles: string[];
    elderRespect: 'high' | 'moderate' | 'low';
  };
  
  spiritualPractices: {
    prayer: {
      frequency: 'daily' | 'weekly' | 'occasionally' | 'never';
      times: string[];
      requirements: string[];
    };
    meditation: string[];
    rituals: string[];
    dietaryObservances: string[];
  };
  
  culturalConsiderations: {
    taboos: string[];
    sensitiveTopics: string[];
    genderConsiderations: string[];
    lifeEvents: {
      birth: string[];
      comingOfAge: string[];
      marriage: string[];
      death: string[];
    };
  };
}

/**
 * Cultural Assessment
 */
export interface CulturalAssessment {
  patientId: string;
  assessmentDate: string;
  assessor: string;
  culturalBackground: {
    countryOfOrigin: string;
    yearsInCurrentCountry: number;
    acculturationLevel: 'low' | 'moderate' | 'high';
  };
  
  languageNeeds: {
    primaryLanguage: string;
    interpreterNeeded: boolean;
    preferredLanguageForCare: string;
    literacyLevel: 'low' | 'moderate' | 'high';
  };
  
  healthLiteracy: {
    understandingOfHealthConcepts: 'low' | 'moderate' | 'high';
    preferredLearningMethods: string[];
    barriersToUnderstanding: string[];
  };
  
  culturalBeliefs: {
    healthAndIllness: string[];
    painExpression: string[];
    mentalHealthStigma: 'none' | 'some' | 'high';
    traditionalHealing: string[];
  };
  
  recommendations: {
    communication: string[];
    treatment: string[];
    education: string[];
    familyInvolvement: string[];
  };
}
