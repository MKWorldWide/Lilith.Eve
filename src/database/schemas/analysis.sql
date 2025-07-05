-- =====================================================
-- 🧠 Lilith.Eve Database Schema - Analysis & Treatment Data
-- =====================================================
-- 
-- Divine Purpose: Store comprehensive AI analysis results,
-- treatment plans, and system interactions for continuous
-- learning and personalized care optimization.
-- 
-- This schema captures the full spectrum of Lilith.Eve's
-- divine insights and healing recommendations.
-- =====================================================

-- Enable UUID extension for secure ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Apply triggers to all tables with updated_at
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

COMMENT ON VIEW analysis_comprehensive_view IS 'Comprehensive view of all analysis results for a session';
COMMENT ON VIEW treatment_plan_summary_view IS 'Summary view of treatment plans with component counts'; 