-- =====================================================
-- 🏥 Lilith.Eve Database Schema - Patients & Medical Data
-- =====================================================
-- 
-- Divine Purpose: Store and manage comprehensive patient data
-- with cultural sensitivity, security, and holistic awareness.
-- 
-- This schema supports the full spectrum of patient information
-- including medical history, cultural context, social determinants,
-- and holistic preferences for personalized care delivery.
-- =====================================================

-- Enable UUID extension for secure ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

COMMENT ON VIEW patient_comprehensive_view IS 'Comprehensive view combining all patient information for analysis'; 