---
layout: default
title: Lilith.Eve API Reference
---

# 🔧 **Lilith.Eve API Reference**

> *"The divine interface for healing and wisdom"*

## 🌟 **API Overview**

The Lilith.Eve API provides a comprehensive interface for medical analysis, treatment planning, and holistic healing. All endpoints are designed with **privacy-first principles** and **cultural sensitivity** at their core.

### **Base URL**
```
Production: https://api.lilith-eve.com/v1
Staging: https://staging-api.lilith-eve.com/v1
Development: http://localhost:3000/v1
```

### **Authentication**
All API requests require authentication using JWT tokens:

```http
Authorization: Bearer <your-jwt-token>
```

### **Rate Limiting**
- **Standard**: 100 requests per minute
- **Premium**: 1000 requests per minute
- **Enterprise**: Custom limits

## 🧠 **Core Endpoints**

### **1. Patient Analysis**

#### **POST /analysis/patient**

Initiates a comprehensive patient analysis using all available modules.

**Request Body:**
```json
{
  "patient_profile": {
    "id": "uuid",
    "demographics": {
      "age": 35,
      "gender": "female",
      "ethnicity": "mixed",
      "location": "San Francisco, CA"
    },
    "medical_history": {
      "conditions": ["hypertension", "anxiety"],
      "medications": ["lisinopril", "sertraline"],
      "allergies": ["penicillin"],
      "family_history": ["diabetes", "heart_disease"]
    },
    "cultural_context": {
      "religion": "buddhist",
      "traditional_practices": ["meditation", "herbal_medicine"],
      "communication_preference": "compassionate",
      "language": "english"
    },
    "consent_settings": {
      "biometric_access": true,
      "social_media_access": false,
      "holistic_therapies": true,
      "data_sharing": "minimal"
    }
  },
  "analysis_modules": ["cognition", "biosync", "persona", "social", "lingua", "holistica"],
  "priority": "standard" // "urgent", "standard", "comprehensive"
}
```

**Response:**
```json
{
  "analysis_id": "uuid",
  "status": "processing",
  "estimated_completion": "2024-01-15T10:30:00Z",
  "modules_status": {
    "cognition": "completed",
    "biosync": "processing",
    "persona": "completed",
    "social": "pending",
    "lingua": "pending",
    "holistica": "pending"
  },
  "initial_insights": {
    "risk_level": "moderate",
    "primary_concerns": ["stress_management", "sleep_quality"],
    "cultural_considerations": ["mindfulness_practices", "dietary_preferences"]
  }
}
```

#### **GET /analysis/{analysis_id}**

Retrieves the current status and results of a patient analysis.

**Response:**
```json
{
  "analysis_id": "uuid",
  "status": "completed",
  "completed_at": "2024-01-15T10:25:00Z",
  "results": {
    "cognition_analysis": {
      "medical_assessment": {
        "primary_diagnosis": "chronic_stress_syndrome",
        "secondary_conditions": ["sleep_disorder", "mild_anxiety"],
        "risk_factors": ["work_stress", "poor_sleep_hygiene"],
        "confidence_score": 0.87
      },
      "treatment_recommendations": {
        "pharmaceutical": [],
        "lifestyle": ["sleep_optimization", "stress_management"],
        "alternative": ["meditation", "acupuncture"]
      }
    },
    "biosync_analysis": {
      "heart_rate_variability": {
        "current": 45,
        "normal_range": [50, 100],
        "trend": "decreasing",
        "interpretation": "elevated_stress_levels"
      },
      "sleep_patterns": {
        "average_duration": 6.2,
        "quality_score": 0.65,
        "recommendations": ["consistent_bedtime", "reduce_screen_time"]
      }
    },
    "persona_analysis": {
      "cultural_insights": {
        "healing_preferences": ["mindfulness", "natural_remedies"],
        "communication_style": "gentle_encouragement",
        "family_dynamics": "supportive"
      },
      "psychological_profile": {
        "stress_triggers": ["work_deadlines", "social_obligations"],
        "coping_mechanisms": ["meditation", "exercise"],
        "motivation_factors": ["family_wellbeing", "personal_growth"]
      }
    }
  }
}
```

### **2. Treatment Planning**

#### **POST /treatment/plan**

Generates a personalized treatment plan based on analysis results.

**Request Body:**
```json
{
  "analysis_id": "uuid",
  "treatment_preferences": {
    "modality_preference": "holistic_first", // "conventional_first", "integrated"
    "intensity": "moderate", // "gentle", "moderate", "intensive"
    "duration": "3_months", // "1_month", "3_months", "6_months", "ongoing"
    "cultural_alignment": true,
    "family_involvement": true
  },
  "constraints": {
    "budget": "moderate",
    "time_availability": "evenings_weekends",
    "geographic_limitations": ["remote_options_only"],
    "contraindications": ["pregnancy", "severe_anxiety"]
  }
}
```

**Response:**
```json
{
  "treatment_plan_id": "uuid",
  "plan_overview": {
    "duration": "3_months",
    "phases": [
      {
        "phase": 1,
        "duration": "4_weeks",
        "focus": "stress_reduction",
        "modalities": ["meditation", "sleep_optimization", "gentle_exercise"]
      },
      {
        "phase": 2,
        "duration": "4_weeks",
        "focus": "lifestyle_integration",
        "modalities": ["mindful_eating", "social_connection", "nature_therapy"]
      },
      {
        "phase": 3,
        "duration": "4_weeks",
        "focus": "sustainability",
        "modalities": ["habit_formation", "community_support", "progress_tracking"]
      }
    ]
  },
  "detailed_recommendations": {
    "daily_practices": [
      {
        "practice": "morning_meditation",
        "duration": "15_minutes",
        "description": "Gentle mindfulness meditation focusing on breath awareness",
        "cultural_context": "Buddhist-inspired practice adapted for modern lifestyle",
        "expected_benefits": ["reduced_anxiety", "improved_focus", "better_sleep"]
      }
    ],
    "weekly_activities": [
      {
        "activity": "nature_walks",
        "frequency": "3_times_per_week",
        "duration": "30_minutes",
        "description": "Mindful walking in natural settings",
        "cultural_context": "Shinrin-yoku (forest bathing) principles",
        "expected_benefits": ["stress_reduction", "improved_mood", "connection_to_nature"]
      }
    ],
    "nutritional_guidance": {
      "principles": ["anti_inflammatory", "stress_supporting", "sleep_enhancing"],
      "recommended_foods": ["leafy_greens", "fatty_fish", "berries", "herbal_teas"],
      "avoid": ["excessive_caffeine", "processed_sugars", "late_night_meals"],
      "cultural_adaptations": ["buddhist_dietary_principles", "seasonal_eating"]
    }
  },
  "monitoring_plan": {
    "biometric_tracking": ["heart_rate_variability", "sleep_quality", "stress_levels"],
    "symptom_tracking": ["anxiety_levels", "sleep_duration", "energy_levels"],
    "progress_indicators": ["meditation_consistency", "sleep_improvement", "stress_reduction"],
    "check_in_frequency": "weekly"
  }
}
```

### **3. Real-time Monitoring**

#### **POST /monitoring/start**

Initiates real-time monitoring for a patient.

**Request Body:**
```json
{
  "patient_id": "uuid",
  "monitoring_config": {
    "biometric_devices": ["apple_watch", "oura_ring"],
    "social_monitoring": false,
    "crisis_detection": true,
    "alert_thresholds": {
      "heart_rate": {"min": 50, "max": 120},
      "sleep_duration": {"min": 6, "max": 10},
      "stress_level": {"max": 0.8}
    }
  }
}
```

#### **GET /monitoring/{patient_id}/status**

Retrieves current monitoring status and recent alerts.

**Response:**
```json
{
  "monitoring_active": true,
  "last_updated": "2024-01-15T10:30:00Z",
  "current_metrics": {
    "heart_rate": 72,
    "heart_rate_variability": 52,
    "sleep_quality": 0.75,
    "stress_level": 0.45,
    "activity_level": 0.68
  },
  "recent_alerts": [
    {
      "timestamp": "2024-01-15T08:15:00Z",
      "type": "elevated_stress",
      "severity": "moderate",
      "description": "Stress levels elevated above normal range",
      "recommendations": ["deep_breathing", "take_break", "gentle_stretching"]
    }
  ],
  "trends": {
    "stress_level": "decreasing",
    "sleep_quality": "improving",
    "heart_rate_variability": "stable"
  }
}
```

### **4. Cultural & Holistic Integration**

#### **GET /holistic/modalities/{culture}**

Retrieves available holistic healing modalities for a specific cultural context.

**Response:**
```json
{
  "culture": "buddhist",
  "available_modalities": [
    {
      "modality": "meditation",
      "types": ["mindfulness", "loving_kindness", "body_scan", "breath_awareness"],
      "cultural_context": "Traditional Buddhist meditation practices adapted for modern healthcare",
      "evidence_level": "strong",
      "contraindications": ["severe_psychosis", "acute_trauma"],
      "practitioners": ["buddhist_teachers", "mindfulness_instructors", "therapists"]
    },
    {
      "modality": "herbal_medicine",
      "types": ["adaptogens", "nervines", "sleep_support"],
      "cultural_context": "Traditional Chinese and Ayurvedic herbs with modern safety standards",
      "evidence_level": "moderate",
      "contraindications": ["pregnancy", "medication_interactions"],
      "practitioners": ["herbalists", "naturopaths", "integrative_physicians"]
    }
  ]
}
```

#### **POST /holistic/recommendation**

Generates culturally-appropriate holistic treatment recommendations.

**Request Body:**
```json
{
  "patient_profile": {
    "cultural_background": "buddhist",
    "health_concerns": ["stress", "sleep_issues"],
    "preferences": ["natural_remedies", "mindfulness_practices"],
    "contraindications": []
  },
  "context": {
    "season": "winter",
    "life_phase": "midlife",
    "stress_level": "moderate"
  }
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "modality": "meditation",
      "specific_practice": "metta_meditation",
      "rationale": "Loving-kindness meditation aligns with Buddhist principles and supports emotional wellbeing",
      "instructions": "Practice 10-15 minutes daily, focusing on cultivating compassion for self and others",
      "expected_benefits": ["reduced_anxiety", "improved_self_compassion", "better_sleep"],
      "cultural_significance": "Traditional Buddhist practice for developing loving-kindness and compassion"
    },
    {
      "modality": "herbal_medicine",
      "specific_herbs": ["ashwagandha", "chamomile", "valerian"],
      "rationale": "Adaptogenic herbs support stress response and promote restful sleep",
      "dosage": "As directed by qualified herbalist",
      "precautions": "Consult healthcare provider if taking medications",
      "cultural_integration": "Combines traditional wisdom with modern safety standards"
    }
  ]
}
```

### **5. Communication & Education**

#### **POST /communication/adapt**

Adapts medical communication to patient's preferences and cultural context.

**Request Body:**
```json
{
  "content": "Your blood pressure readings indicate hypertension. We recommend lifestyle modifications including diet changes and exercise.",
  "patient_context": {
    "education_level": "high_school",
    "health_literacy": "moderate",
    "cultural_background": "buddhist",
    "communication_style": "compassionate",
    "language": "english"
  },
  "content_type": "diagnosis_explanation"
}
```

**Response:**
```json
{
  "adapted_content": "I understand this news might feel concerning. Your body is showing signs of stress in your blood pressure readings, which is quite common in our busy lives. Together, we can work on gentle, natural ways to support your body's natural healing abilities. This might include mindful eating practices, gentle movement, and stress-reducing activities that align with your values.",
  "communication_style": "compassionate",
  "cultural_elements": ["mindfulness", "natural_healing", "gentle_approach"],
  "readability_score": 8.2,
  "emotional_tone": "supportive",
  "additional_context": "Uses Buddhist principles of compassion and natural healing"
}
```

## 🔐 **Security & Privacy Endpoints**

### **POST /consent/update**

Updates patient consent settings for data access and processing.

**Request Body:**
```json
{
  "patient_id": "uuid",
  "consent_updates": {
    "biometric_access": true,
    "social_media_access": false,
    "holistic_therapies": true,
    "data_sharing": "minimal",
    "research_participation": false
  },
  "reason": "Patient requested to enable biometric monitoring for sleep tracking"
}
```

### **DELETE /data/{patient_id}**

Initiates complete data deletion for a patient (GDPR compliance).

**Response:**
```json
{
  "deletion_id": "uuid",
  "status": "initiated",
  "estimated_completion": "2024-01-22T10:30:00Z",
  "data_types": ["profile", "medical_records", "analysis_results", "treatment_plans"],
  "confirmation_required": true
}
```

## 📊 **Analytics & Reporting**

### **GET /analytics/patient/{patient_id}**

Retrieves comprehensive analytics for a patient's healing journey.

**Response:**
```json
{
  "patient_id": "uuid",
  "journey_summary": {
    "start_date": "2024-01-01T00:00:00Z",
    "current_phase": "lifestyle_integration",
    "overall_progress": 0.75,
    "key_achievements": ["improved_sleep", "reduced_stress", "consistent_meditation"]
  },
  "biometric_trends": {
    "heart_rate_variability": {
      "baseline": 45,
      "current": 58,
      "improvement": "+29%",
      "trend": "increasing"
    },
    "sleep_quality": {
      "baseline": 0.65,
      "current": 0.82,
      "improvement": "+26%",
      "trend": "improving"
    }
  },
  "treatment_adherence": {
    "meditation": 0.85,
    "exercise": 0.72,
    "nutrition": 0.68,
    "sleep_hygiene": 0.91
  },
  "outcome_metrics": {
    "anxiety_reduction": 0.40,
    "sleep_improvement": 0.35,
    "overall_wellbeing": 0.45,
    "life_satisfaction": 0.38
  }
}
```

## 🚨 **Error Handling**

### **Standard Error Response**
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request contains invalid parameters",
    "details": {
      "field": "patient_profile.age",
      "issue": "Age must be between 0 and 120"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "uuid"
  }
}
```

### **Common Error Codes**
- `AUTHENTICATION_FAILED` - Invalid or expired token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `PATIENT_NOT_FOUND` - Patient ID does not exist
- `ANALYSIS_IN_PROGRESS` - Analysis is still being processed
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INVALID_CONSENT` - Required consent not granted
- `CULTURAL_CONTEXT_MISSING` - Cultural information required

## 📚 **SDK Libraries**

### **JavaScript/TypeScript**
```bash
npm install @lilith-eve/sdk
```

```typescript
import { LilithEve } from '@lilith-eve/sdk';

const lilith = new LilithEve({
  apiKey: 'your-api-key',
  environment: 'production'
});

const analysis = await lilith.analyzePatient(patientProfile);
const treatmentPlan = await lilith.generateTreatmentPlan(analysis.id);
```

### **Python**
```bash
pip install lilith-eve-sdk
```

```python
from lilith_eve import LilithEve

lilith = LilithEve(api_key="your-api-key", environment="production")
analysis = lilith.analyze_patient(patient_profile)
treatment_plan = lilith.generate_treatment_plan(analysis.id)
```

*Last updated: 2025-08-03*

---

*"Through the API of Lilith.Eve, we bridge the gap between technology and healing, providing a divine interface for compassionate care."*