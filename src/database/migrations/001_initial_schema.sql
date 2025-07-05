-- =====================================================
-- 🏥 Lilith.Eve Database Migration - Initial Schema
-- =====================================================
-- 
-- Migration: 001_initial_schema
-- Description: Initial database schema setup for Lilith.Eve
-- 
-- Divine Purpose: Establish the foundational database structure
-- for storing comprehensive patient data, AI analysis results,
-- and treatment plans with cultural sensitivity and security.
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64),
    execution_time_ms INTEGER
);

-- =====================================================
-- CORE PATIENT TABLES
-- =====================================================

-- Main patient profile table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE NOT NULL,
    mrn VARCHAR(255) UNIQUE, -- Medical Record Number
    
    -- Basic demographics
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(50),
    gender_identity VARCHAR(100),
    sexual_orientation VARCHAR(100),
    
    -- Contact information
    email VARCHAR(255),
    phone VARCHAR(50),
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Emergency contact
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(100),
    
    -- Cultural and linguistic information
    primary_language VARCHAR(50),
    preferred_language VARCHAR(50),
    interpreter_needed BOOLEAN DEFAULT FALSE,
    cultural_background TEXT,
    
    -- System metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    
    -- Status and flags
    is_active BOOLEAN DEFAULT TRUE,
    is_deceased BOOLEAN DEFAULT FALSE,
    date_of_death DATE,
    death_certificate_number VARCHAR(255),
    
    -- Audit trail
    version INTEGER DEFAULT 1,
    audit_trail JSONB
);

-- Patient demographics and social determinants
CREATE TABLE patient_demographics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Socioeconomic information
    education_level VARCHAR(100),
    employment_status VARCHAR(100),
    occupation VARCHAR(200),
    income_level VARCHAR(50),
    insurance_provider VARCHAR(200),
    insurance_policy_number VARCHAR(255),
    
    -- Housing and environment
    housing_type VARCHAR(100),
    housing_status VARCHAR(100),
    neighborhood_type VARCHAR(100),
    environmental_factors JSONB,
    
    -- Transportation
    transportation_access VARCHAR(100),
    transportation_barriers TEXT,
    
    -- Social support
    marital_status VARCHAR(50),
    family_size INTEGER,
    caregiver_available BOOLEAN,
    caregiver_relationship VARCHAR(100),
    
    -- Community context
    community_type VARCHAR(100),
    community_support_available BOOLEAN,
    community_health_resources JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(patient_id)
);

-- Cultural context and beliefs
CREATE TABLE patient_cultural_context (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Religious and spiritual information
    religion VARCHAR(100),
    spiritual_practices JSONB,
    religious_restrictions JSONB,
    
    -- Traditional healing practices
    traditional_healing_practices JSONB,
    traditional_medicine_use BOOLEAN,
    traditional_healer_consultation BOOLEAN,
    
    -- Cultural beliefs about health
    health_beliefs JSONB,
    illness_beliefs JSONB,
    healing_beliefs JSONB,
    
    -- Family and community dynamics
    family_decision_making VARCHAR(100),
    family_involvement_level VARCHAR(50),
    community_healing_practices JSONB,
    
    -- Communication preferences
    communication_style VARCHAR(100),
    nonverbal_communication_notes TEXT,
    cultural_communication_norms JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(patient_id)
);

-- =====================================================
-- MEDICAL HISTORY TABLES
-- =====================================================

-- Medical history overview
CREATE TABLE medical_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- General health information
    blood_type VARCHAR(10),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    bmi DECIMAL(4,2),
    
    -- Allergies and sensitivities
    allergies JSONB,
    drug_allergies JSONB,
    environmental_allergies JSONB,
    food_allergies JSONB,
    
    -- Immunization history
    immunizations JSONB,
    last_tetanus_shot DATE,
    flu_vaccine_date DATE,
    covid_vaccine_dates JSONB,
    
    -- Family medical history
    family_medical_history JSONB,
    genetic_conditions JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(patient_id)
);

-- Current medications
CREATE TABLE current_medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Medication details
    medication_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    route VARCHAR(50),
    start_date DATE,
    end_date DATE,
    
    -- Prescription information
    prescribing_physician VARCHAR(200),
    pharmacy VARCHAR(200),
    prescription_number VARCHAR(255),
    
    -- Medication management
    adherence_level VARCHAR(50),
    side_effects JSONB,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    
    -- Cost and access
    cost_per_month DECIMAL(10,2),
    insurance_coverage BOOLEAN,
    access_issues TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medical conditions and diagnoses
CREATE TABLE medical_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Condition details
    condition_name VARCHAR(255) NOT NULL,
    icd_10_code VARCHAR(20),
    diagnosis_date DATE,
    diagnosis_physician VARCHAR(200),
    
    -- Condition status
    status VARCHAR(50) DEFAULT 'active', -- active, resolved, chronic, managed
    severity VARCHAR(50),
    prognosis TEXT,
    
    -- Treatment information
    treatment_plan TEXT,
    treatment_effectiveness INTEGER CHECK (treatment_effectiveness >= 1 AND treatment_effectiveness <= 5),
    
    -- Complications and comorbidities
    complications JSONB,
    comorbidities JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mental health history
CREATE TABLE mental_health_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Mental health conditions
    mental_health_conditions JSONB,
    psychiatric_medications JSONB,
    
    -- Therapy and treatment
    current_therapy BOOLEAN,
    therapy_type VARCHAR(100),
    therapist_name VARCHAR(200),
    therapy_frequency VARCHAR(50),
    
    -- Mental health status
    current_mood VARCHAR(100),
    stress_level VARCHAR(50),
    anxiety_level VARCHAR(50),
    depression_symptoms JSONB,
    
    -- Crisis information
    suicide_risk_assessment JSONB,
    crisis_interventions JSONB,
    safety_plan TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(patient_id)
);

-- Lifestyle factors
CREATE TABLE lifestyle_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Physical activity
    exercise_frequency VARCHAR(50),
    exercise_type JSONB,
    sedentary_time_hours DECIMAL(4,2),
    physical_activity_barriers TEXT,
    
    -- Nutrition
    dietary_restrictions JSONB,
    food_preferences JSONB,
    meal_patterns VARCHAR(100),
    hydration_level VARCHAR(50),
    
    -- Sleep
    sleep_duration_hours DECIMAL(3,1),
    sleep_quality VARCHAR(50),
    sleep_disorders JSONB,
    sleep_hygiene_practices JSONB,
    
    -- Substance use
    tobacco_use VARCHAR(50),
    alcohol_consumption VARCHAR(50),
    drug_use JSONB,
    substance_treatment_history JSONB,
    
    -- Stress and coping
    stress_level VARCHAR(50),
    stress_sources JSONB,
    coping_mechanisms JSONB,
    relaxation_techniques JSONB,
    
    -- Preventive care
    preventive_screenings JSONB,
    dental_care_frequency VARCHAR(50),
    eye_care_frequency VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(patient_id)
);

-- =====================================================
-- HOLISTIC AND ALTERNATIVE THERAPY TABLES
-- =====================================================

-- Holistic preferences
CREATE TABLE holistic_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Spiritual and religious preferences
    spiritual_beliefs JSONB,
    religious_practices JSONB,
    spiritual_healing_preferences JSONB,
    
    -- Traditional healing preferences
    traditional_healing_practices JSONB,
    traditional_medicine_use BOOLEAN,
    cultural_healing_methods JSONB,
    
    -- Mind-body connection
    mind_body_practices JSONB,
    meditation_practices JSONB,
    energy_healing_preferences JSONB,
    
    -- Natural medicine preferences
    herbal_medicine_use BOOLEAN,
    aromatherapy_preferences JSONB,
    homeopathy_interest BOOLEAN,
    
    -- Lifestyle wellness
    nutrition_therapy_interest BOOLEAN,
    exercise_therapy_preferences JSONB,
    sleep_optimization_interest BOOLEAN,
    
    -- Integration preferences
    conventional_medicine_integration VARCHAR(50),
    alternative_therapy_combinations JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(patient_id)
);

-- Alternative therapy sessions
CREATE TABLE alternative_therapy_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Session details
    therapy_type VARCHAR(100) NOT NULL,
    session_date DATE NOT NULL,
    session_duration_minutes INTEGER,
    practitioner_name VARCHAR(200),
    practitioner_credentials VARCHAR(200),
    
    -- Session content
    session_notes TEXT,
    techniques_used JSONB,
    patient_response TEXT,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    
    -- Follow-up
    follow_up_required BOOLEAN,
    follow_up_date DATE,
    recommendations TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COMMUNICATION AND ACCESSIBILITY TABLES
-- =====================================================

-- Communication preferences
CREATE TABLE communication_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Language preferences
    preferred_language VARCHAR(50),
    literacy_level VARCHAR(50),
    medical_literacy_level VARCHAR(50),
    digital_literacy_level VARCHAR(50),
    
    -- Communication style
    communication_style VARCHAR(100),
    formality_level VARCHAR(50),
    directness_level VARCHAR(50),
    emotional_tone_preference VARCHAR(100),
    
    -- Accessibility needs
    visual_accessibility_needs JSONB,
    auditory_accessibility_needs JSONB,
    cognitive_accessibility_needs JSONB,
    motor_accessibility_needs JSONB,
    
    -- Learning preferences
    learning_style VARCHAR(100),
    information_processing_style VARCHAR(100),
    retention_strategies JSONB,
    engagement_methods JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(patient_id)
);

-- =====================================================
-- CONSENT AND PRIVACY TABLES
-- =====================================================

-- Patient consent settings
CREATE TABLE patient_consent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Consent categories
    data_processing_consent BOOLEAN DEFAULT FALSE,
    biometric_access_consent BOOLEAN DEFAULT FALSE,
    social_analysis_consent BOOLEAN DEFAULT FALSE,
    communication_analysis_consent BOOLEAN DEFAULT FALSE,
    holistic_analysis_consent BOOLEAN DEFAULT FALSE,
    
    -- Consent details
    consent_date TIMESTAMP WITH TIME ZONE,
    consent_version VARCHAR(20),
    consent_document_url VARCHAR(500),
    
    -- Withdrawal information
    consent_withdrawn BOOLEAN DEFAULT FALSE,
    withdrawal_date TIMESTAMP WITH TIME ZONE,
    withdrawal_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(patient_id)
);

-- =====================================================
-- AI ANALYSIS TABLES
-- =====================================================

-- Main analysis sessions
CREATE TABLE analysis_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- Session metadata
    session_type VARCHAR(100) NOT NULL, -- 'comprehensive', 'biometric', 'cultural', 'social', 'holistic'
    session_status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed', 'cancelled'
    priority_level VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    
    -- Analysis parameters
    analysis_parameters JSONB,
    requested_modules JSONB, -- Which AI modules to run
    excluded_modules JSONB, -- Which modules to skip
    
    -- Timing information
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    processing_duration_ms INTEGER,
    
    -- System information
    system_version VARCHAR(50),
    ai_model_versions JSONB,
    processing_node VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Audit trail
    version INTEGER DEFAULT 1,
    audit_trail JSONB
);

-- Cognition.AI analysis results
CREATE TABLE cognition_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_session_id UUID NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    
    -- Medical knowledge synthesis
    medical_synthesis JSONB,
    diagnosis_analysis JSONB,
    risk_assessment JSONB,
    treatment_recommendations JSONB,
    
    -- Reasoning and confidence
    reasoning_engine_results JSONB,
    confidence_scores JSONB,
    uncertainty_metrics JSONB,
    
    -- Medical knowledge sources
    knowledge_sources JSONB,
    evidence_levels JSONB,
    clinical_guidelines_referenced JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- BioSync.Reader analysis results
CREATE TABLE biometric_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_session_id UUID NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    
    -- Device data collection
    connected_devices JSONB,
    data_collection_status JSONB,
    data_quality_metrics JSONB,
    
    -- Pattern analysis
    heart_rate_variability JSONB,
    sleep_patterns JSONB,
    activity_patterns JSONB,
    stress_patterns JSONB,
    respiratory_patterns JSONB,
    
    -- Health insights
    health_insights JSONB,
    anomaly_detection JSONB,
    trend_analysis JSONB,
    
    -- Monitoring recommendations
    monitoring_plan JSONB,
    alert_thresholds JSONB,
    device_recommendations JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Persona.Scanner analysis results
CREATE TABLE persona_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_session_id UUID NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    
    -- Cultural analysis
    cultural_context_analysis JSONB,
    spiritual_practices_analysis JSONB,
    traditional_healing_analysis JSONB,
    health_beliefs_analysis JSONB,
    
    -- Psychological analysis
    psychological_patterns JSONB,
    personality_traits JSONB,
    learning_style_analysis JSONB,
    motivation_factors JSONB,
    
    -- Communication analysis
    communication_preferences JSONB,
    cultural_communication_patterns JSONB,
    accessibility_needs JSONB,
    
    -- Family and community analysis
    family_dynamics_analysis JSONB,
    community_context_analysis JSONB,
    social_support_analysis JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SocialSynth analysis results
CREATE TABLE social_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_session_id UUID NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    
    -- Social determinants analysis
    housing_analysis JSONB,
    education_analysis JSONB,
    employment_analysis JSONB,
    healthcare_access_analysis JSONB,
    transportation_analysis JSONB,
    
    -- Lifestyle analysis
    physical_activity_analysis JSONB,
    nutrition_analysis JSONB,
    sleep_analysis JSONB,
    substance_use_analysis JSONB,
    stress_management_analysis JSONB,
    
    -- Environmental analysis
    environmental_factors JSONB,
    community_health_analysis JSONB,
    health_equity_analysis JSONB,
    
    -- Economic analysis
    economic_factors JSONB,
    insurance_analysis JSONB,
    cost_barriers_analysis JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LinguaCare analysis results
CREATE TABLE communication_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_session_id UUID NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    
    -- Language processing
    language_preferences JSONB,
    translation_analysis JSONB,
    language_complexity_analysis JSONB,
    medical_terminology_adaptation JSONB,
    
    -- Cultural adaptation
    cultural_adaptation_analysis JSONB,
    spiritual_context_adaptation JSONB,
    traditional_healing_adaptation JSONB,
    cultural_metaphors_analysis JSONB,
    
    -- Accessibility features
    accessibility_analysis JSONB,
    visual_accessibility JSONB,
    auditory_accessibility JSONB,
    cognitive_accessibility JSONB,
    
    -- Communication strategy
    communication_strategy JSONB,
    channel_recommendations JSONB,
    timing_strategy JSONB,
    tone_strategy JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Holistica analysis results
CREATE TABLE holistic_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_session_id UUID NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    
    -- Holistic preferences analysis
    spiritual_beliefs_analysis JSONB,
    traditional_healing_analysis JSONB,
    mind_body_connection_analysis JSONB,
    energy_healing_analysis JSONB,
    
    -- Alternative therapy identification
    mind_body_therapies JSONB,
    energy_healing_therapies JSONB,
    natural_medicine_approaches JSONB,
    traditional_practices JSONB,
    wellness_approaches JSONB,
    
    -- Integrative approach
    conventional_integration JSONB,
    synergistic_combinations JSONB,
    treatment_sequencing JSONB,
    monitoring_protocols JSONB,
    
    -- Wellness plan
    wellness_plan JSONB,
    spiritual_wellness JSONB,
    emotional_wellness JSONB,
    physical_wellness JSONB,
    social_wellness JSONB,
    
    -- Safety assessment
    safety_assessment JSONB,
    contraindications JSONB,
    drug_herb_interactions JSONB,
    practitioner_qualifications JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TREATMENT PLAN TABLES
-- =====================================================

-- Comprehensive treatment plans
CREATE TABLE treatment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    analysis_session_id UUID NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    
    -- Plan metadata
    plan_name VARCHAR(255) NOT NULL,
    plan_type VARCHAR(100) NOT NULL, -- 'comprehensive', 'focused', 'emergency', 'maintenance'
    plan_status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'completed', 'cancelled', 'archived'
    priority_level VARCHAR(20) DEFAULT 'normal',
    
    -- Plan overview
    plan_summary TEXT,
    treatment_goals JSONB,
    expected_outcomes JSONB,
    timeline_weeks INTEGER,
    
    -- Risk assessment
    risk_level VARCHAR(20), -- 'low', 'moderate', 'high', 'critical'
    risk_factors JSONB,
    safety_considerations JSONB,
    contraindications JSONB,
    
    -- Cultural and holistic integration
    cultural_considerations JSONB,
    holistic_integration JSONB,
    traditional_healing_integration JSONB,
    
    -- Communication strategy
    communication_plan JSONB,
    patient_education_materials JSONB,
    follow_up_schedule JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit trail
    version INTEGER DEFAULT 1,
    audit_trail JSONB
);

-- Treatment plan components
CREATE TABLE treatment_plan_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    treatment_plan_id UUID NOT NULL REFERENCES treatment_plans(id) ON DELETE CASCADE,
    
    -- Component details
    component_name VARCHAR(255) NOT NULL,
    component_type VARCHAR(100) NOT NULL, -- 'medication', 'therapy', 'lifestyle', 'holistic', 'monitoring'
    component_category VARCHAR(100), -- 'conventional', 'alternative', 'integrative'
    
    -- Component description
    description TEXT,
    rationale TEXT,
    expected_benefits JSONB,
    potential_risks JSONB,
    
    -- Implementation details
    dosage_schedule JSONB,
    duration_weeks INTEGER,
    frequency VARCHAR(100),
    instructions TEXT,
    
    -- Cultural and accessibility considerations
    cultural_adaptations JSONB,
    accessibility_features JSONB,
    communication_adaptations JSONB,
    
    -- Monitoring and evaluation
    monitoring_parameters JSONB,
    success_metrics JSONB,
    adjustment_criteria JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Treatment plan progress tracking
CREATE TABLE treatment_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    treatment_plan_id UUID NOT NULL REFERENCES treatment_plans(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES treatment_plan_components(id) ON DELETE CASCADE,
    
    -- Progress status
    status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'paused', 'discontinued'
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    
    -- Effectiveness tracking
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    patient_satisfaction_rating INTEGER CHECK (patient_satisfaction_rating >= 1 AND patient_satisfaction_rating <= 5),
    adherence_level VARCHAR(50),
    
    -- Outcomes and side effects
    outcomes_achieved JSONB,
    side_effects JSONB,
    complications JSONB,
    
    -- Adjustments made
    adjustments_made JSONB,
    adjustment_reasons JSONB,
    adjustment_effectiveness JSONB,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SYSTEM INTERACTION TABLES
-- =====================================================

-- Patient interactions with Lilith.Eve
CREATE TABLE patient_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    analysis_session_id UUID REFERENCES analysis_sessions(id) ON DELETE SET NULL,
    
    -- Interaction details
    interaction_type VARCHAR(100) NOT NULL, -- 'consultation', 'question', 'feedback', 'emergency', 'follow_up'
    interaction_channel VARCHAR(50), -- 'web', 'mobile', 'voice', 'chat', 'video'
    interaction_duration_seconds INTEGER,
    
    -- Content and context
    patient_input TEXT,
    system_response TEXT,
    adapted_response TEXT,
    cultural_adaptations_applied JSONB,
    
    -- Interaction quality
    patient_satisfaction_rating INTEGER CHECK (patient_satisfaction_rating >= 1 AND patient_satisfaction_rating <= 5),
    understanding_level VARCHAR(50),
    engagement_level VARCHAR(50),
    
    -- Follow-up actions
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_type VARCHAR(100),
    follow_up_priority VARCHAR(20),
    
    -- Timestamps
    interaction_started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    interaction_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System learning and feedback
CREATE TABLE system_learning (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_interaction_id UUID REFERENCES patient_interactions(id) ON DELETE SET NULL,
    analysis_session_id UUID REFERENCES analysis_sessions(id) ON DELETE SET NULL,
    
    -- Learning data
    learning_type VARCHAR(100) NOT NULL, -- 'patient_feedback', 'outcome_analysis', 'pattern_recognition', 'error_correction'
    learning_category VARCHAR(100), -- 'cultural', 'medical', 'communication', 'holistic', 'social'
    
    -- Learning content
    original_prediction JSONB,
    actual_outcome JSONB,
    prediction_accuracy DECIMAL(5,4),
    learning_insights JSONB,
    
    -- Model improvements
    model_adjustments JSONB,
    confidence_adjustments JSONB,
    threshold_adjustments JSONB,
    
    -- Cultural and contextual learning
    cultural_learning JSONB,
    contextual_adaptations JSONB,
    communication_improvements JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Patient lookup indexes
CREATE INDEX idx_patients_external_id ON patients(external_id);
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_patients_dob ON patients(date_of_birth);
CREATE INDEX idx_patients_email ON patients(email);

-- Medical history indexes
CREATE INDEX idx_medical_conditions_patient_id ON medical_conditions(patient_id);
CREATE INDEX idx_medical_conditions_status ON medical_conditions(status);
CREATE INDEX idx_current_medications_patient_id ON current_medications(patient_id);
CREATE INDEX idx_current_medications_name ON current_medications(medication_name);

-- Cultural context indexes
CREATE INDEX idx_cultural_context_patient_id ON patient_cultural_context(patient_id);
CREATE INDEX idx_cultural_context_religion ON patient_cultural_context(religion);

-- Holistic preferences indexes
CREATE INDEX idx_holistic_preferences_patient_id ON holistic_preferences(patient_id);
CREATE INDEX idx_alternative_therapy_sessions_patient_id ON alternative_therapy_sessions(patient_id);
CREATE INDEX idx_alternative_therapy_sessions_date ON alternative_therapy_sessions(session_date);

-- Consent indexes
CREATE INDEX idx_patient_consent_patient_id ON patient_consent(patient_id);
CREATE INDEX idx_patient_consent_status ON patient_consent(consent_withdrawn);

-- Analysis session indexes
CREATE INDEX idx_analysis_sessions_patient_id ON analysis_sessions(patient_id);
CREATE INDEX idx_analysis_sessions_session_id ON analysis_sessions(session_id);
CREATE INDEX idx_analysis_sessions_status ON analysis_sessions(session_status);
CREATE INDEX idx_analysis_sessions_started_at ON analysis_sessions(started_at);

-- Analysis results indexes
CREATE INDEX idx_cognition_analysis_session_id ON cognition_analysis(analysis_session_id);
CREATE INDEX idx_biometric_analysis_session_id ON biometric_analysis(analysis_session_id);
CREATE INDEX idx_persona_analysis_session_id ON persona_analysis(analysis_session_id);
CREATE INDEX idx_social_analysis_session_id ON social_analysis(analysis_session_id);
CREATE INDEX idx_communication_analysis_session_id ON communication_analysis(analysis_session_id);
CREATE INDEX idx_holistic_analysis_session_id ON holistic_analysis(analysis_session_id);

-- Treatment plan indexes
CREATE INDEX idx_treatment_plans_patient_id ON treatment_plans(patient_id);
CREATE INDEX idx_treatment_plans_session_id ON treatment_plans(analysis_session_id);
CREATE INDEX idx_treatment_plans_status ON treatment_plans(plan_status);
CREATE INDEX idx_treatment_plans_created_at ON treatment_plans(created_at);

-- Treatment components indexes
CREATE INDEX idx_treatment_plan_components_plan_id ON treatment_plan_components(treatment_plan_id);
CREATE INDEX idx_treatment_plan_components_type ON treatment_plan_components(component_type);

-- Progress tracking indexes
CREATE INDEX idx_treatment_progress_plan_id ON treatment_progress(treatment_plan_id);
CREATE INDEX idx_treatment_progress_component_id ON treatment_progress(component_id);
CREATE INDEX idx_treatment_progress_status ON treatment_progress(status);

-- Interaction indexes
CREATE INDEX idx_patient_interactions_patient_id ON patient_interactions(patient_id);
CREATE INDEX idx_patient_interactions_session_id ON patient_interactions(analysis_session_id);
CREATE INDEX idx_patient_interactions_type ON patient_interactions(interaction_type);
CREATE INDEX idx_patient_interactions_started_at ON patient_interactions(interaction_started_at);

-- Learning indexes
CREATE INDEX idx_system_learning_interaction_id ON system_learning(patient_interaction_id);
CREATE INDEX idx_system_learning_session_id ON system_learning(analysis_session_id);
CREATE INDEX idx_system_learning_type ON system_learning(learning_type);

-- =====================================================
-- TRIGGERS FOR AUDIT TRAIL
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.version = OLD.version + 1;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_demographics_updated_at BEFORE UPDATE ON patient_demographics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_cultural_context_updated_at BEFORE UPDATE ON patient_cultural_context
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_history_updated_at BEFORE UPDATE ON medical_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mental_health_history_updated_at BEFORE UPDATE ON mental_health_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lifestyle_factors_updated_at BEFORE UPDATE ON lifestyle_factors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holistic_preferences_updated_at BEFORE UPDATE ON holistic_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_preferences_updated_at BEFORE UPDATE ON communication_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_consent_updated_at BEFORE UPDATE ON patient_consent
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analysis_sessions_updated_at BEFORE UPDATE ON analysis_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cognition_analysis_updated_at BEFORE UPDATE ON cognition_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_biometric_analysis_updated_at BEFORE UPDATE ON biometric_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_persona_analysis_updated_at BEFORE UPDATE ON persona_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_analysis_updated_at BEFORE UPDATE ON social_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_analysis_updated_at BEFORE UPDATE ON communication_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holistic_analysis_updated_at BEFORE UPDATE ON holistic_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_plans_updated_at BEFORE UPDATE ON treatment_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_plan_components_updated_at BEFORE UPDATE ON treatment_plan_components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_progress_updated_at BEFORE UPDATE ON treatment_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_interactions_updated_at BEFORE UPDATE ON patient_interactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_learning_updated_at BEFORE UPDATE ON system_learning
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Comprehensive patient view
CREATE VIEW patient_comprehensive_view AS
SELECT 
    p.*,
    pd.education_level,
    pd.employment_status,
    pd.income_level,
    pd.insurance_provider,
    pcc.religion,
    pcc.traditional_healing_practices,
    mh.blood_type,
    mh.allergies,
    mh.immunizations,
    mhh.current_mood,
    mhh.stress_level,
    lf.exercise_frequency,
    lf.sleep_duration_hours,
    hp.spiritual_beliefs,
    hp.traditional_medicine_use,
    cp.preferred_language,
    cp.communication_style,
    pc.data_processing_consent,
    pc.biometric_access_consent
FROM patients p
LEFT JOIN patient_demographics pd ON p.id = pd.patient_id
LEFT JOIN patient_cultural_context pcc ON p.id = pcc.patient_id
LEFT JOIN medical_history mh ON p.id = mh.patient_id
LEFT JOIN mental_health_history mhh ON p.id = mhh.patient_id
LEFT JOIN lifestyle_factors lf ON p.id = lf.patient_id
LEFT JOIN holistic_preferences hp ON p.id = hp.patient_id
LEFT JOIN communication_preferences cp ON p.id = cp.patient_id
LEFT JOIN patient_consent pc ON p.id = pc.patient_id
WHERE p.is_active = TRUE;

-- Comprehensive analysis view
CREATE VIEW analysis_comprehensive_view AS
SELECT 
    as.id as session_id,
    as.patient_id,
    as.session_type,
    as.session_status,
    as.started_at,
    as.completed_at,
    p.first_name,
    p.last_name,
    p.date_of_birth,
    ca.medical_synthesis,
    ca.diagnosis_analysis,
    ba.health_insights,
    pa.cultural_context_analysis,
    sa.social_determinants_analysis,
    comma.communication_strategy,
    ha.holistic_analysis
FROM analysis_sessions as
JOIN patients p ON as.patient_id = p.id
LEFT JOIN cognition_analysis ca ON as.id = ca.analysis_session_id
LEFT JOIN biometric_analysis ba ON as.id = ba.analysis_session_id
LEFT JOIN persona_analysis pa ON as.id = pa.analysis_session_id
LEFT JOIN social_analysis sa ON as.id = sa.analysis_session_id
LEFT JOIN communication_analysis comma ON as.id = comma.analysis_session_id
LEFT JOIN holistic_analysis ha ON as.id = ha.analysis_session_id
WHERE as.session_status = 'completed';

-- Treatment plan summary view
CREATE VIEW treatment_plan_summary_view AS
SELECT 
    tp.id as plan_id,
    tp.patient_id,
    tp.plan_name,
    tp.plan_type,
    tp.plan_status,
    tp.risk_level,
    tp.created_at,
    p.first_name,
    p.last_name,
    COUNT(tpc.id) as component_count,
    COUNT(CASE WHEN tpc.component_type = 'medication' THEN 1 END) as medication_components,
    COUNT(CASE WHEN tpc.component_type = 'therapy' THEN 1 END) as therapy_components,
    COUNT(CASE WHEN tpc.component_type = 'holistic' THEN 1 END) as holistic_components
FROM treatment_plans tp
JOIN patients p ON tp.patient_id = p.id
LEFT JOIN treatment_plan_components tpc ON tp.id = tpc.treatment_plan_id
GROUP BY tp.id, tp.patient_id, tp.plan_name, tp.plan_type, tp.plan_status, tp.risk_level, tp.created_at, p.first_name, p.last_name;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE patients IS 'Core patient information with comprehensive demographic and contact data';
COMMENT ON TABLE patient_demographics IS 'Social determinants of health and socioeconomic information';
COMMENT ON TABLE patient_cultural_context IS 'Cultural background, beliefs, and traditional healing practices';
COMMENT ON TABLE medical_history IS 'Comprehensive medical history including allergies and immunizations';
COMMENT ON TABLE current_medications IS 'Active medications with adherence and effectiveness tracking';
COMMENT ON TABLE medical_conditions IS 'Medical conditions and diagnoses with treatment information';
COMMENT ON TABLE mental_health_history IS 'Mental health conditions, therapy, and crisis information';
COMMENT ON TABLE lifestyle_factors IS 'Lifestyle factors including exercise, nutrition, sleep, and substance use';
COMMENT ON TABLE holistic_preferences IS 'Holistic and alternative therapy preferences and beliefs';
COMMENT ON TABLE alternative_therapy_sessions IS 'Records of alternative therapy sessions and outcomes';
COMMENT ON TABLE communication_preferences IS 'Communication style, accessibility needs, and learning preferences';
COMMENT ON TABLE patient_consent IS 'Patient consent settings for data processing and analysis';
COMMENT ON TABLE analysis_sessions IS 'Main analysis sessions tracking all AI module interactions';
COMMENT ON TABLE cognition_analysis IS 'Cognition.AI medical knowledge synthesis and reasoning results';
COMMENT ON TABLE biometric_analysis IS 'BioSync.Reader biometric pattern recognition and health insights';
COMMENT ON TABLE persona_analysis IS 'Persona.Scanner cultural and psychological context analysis';
COMMENT ON TABLE social_analysis IS 'SocialSynth social determinants and lifestyle analysis';
COMMENT ON TABLE communication_analysis IS 'LinguaCare adaptive communication and language processing';
COMMENT ON TABLE holistic_analysis IS 'Holistica holistic and alternative therapy integration';
COMMENT ON TABLE treatment_plans IS 'Comprehensive treatment plans integrating all analysis results';
COMMENT ON TABLE treatment_plan_components IS 'Individual components of treatment plans with implementation details';
COMMENT ON TABLE treatment_progress IS 'Progress tracking for treatment plan components and outcomes';
COMMENT ON TABLE patient_interactions IS 'Patient interactions with Lilith.Eve system';
COMMENT ON TABLE system_learning IS 'System learning and feedback for continuous improvement';

COMMENT ON VIEW patient_comprehensive_view IS 'Comprehensive view combining all patient information for analysis';
COMMENT ON VIEW analysis_comprehensive_view IS 'Comprehensive view of all analysis results for a session';
COMMENT ON VIEW treatment_plan_summary_view IS 'Summary view of treatment plans with component counts';

-- =====================================================
-- MIGRATION COMPLETION
-- =====================================================

-- Record migration completion
INSERT INTO schema_migrations (migration_name, checksum, execution_time_ms)
VALUES ('001_initial_schema', 'sha256_checksum_placeholder', 0);

-- Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'Migration 001_initial_schema completed successfully';
    RAISE NOTICE 'Lilith.Eve database schema initialized with divine purpose';
END $$; 