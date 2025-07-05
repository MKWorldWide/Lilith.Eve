/**
 * @fileoverview Validation Middleware - Lilith.Eve Medical AI Oracle
 * 
 * This middleware handles request validation using Joi schemas to ensure
 * data integrity and security for all API endpoints.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../../utils/logger';

/**
 * Generic validation middleware factory
 * @param schema - Joi validation schema
 * @param property - Request property to validate ('body', 'query', 'params')
 */
export const validateRequest = (
  schema: Joi.ObjectSchema,
  property: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      logger.warn('Request validation failed', {
        path: req.path,
        method: req.method,
        errors: validationErrors,
        ip: req.ip
      });

      res.status(400).json({
        error: 'Validation failed',
        message: 'Request data does not meet validation requirements',
        code: 'VALIDATION_ERROR',
        details: validationErrors
      });
      return;
    }

    // Replace the request property with validated data
    req[property] = value;
    next();
  };
};

/**
 * Patient creation validation schema
 */
export const patientCreateSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  dateOfBirth: Joi.date().max('now').required(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  address: Joi.object({
    street: Joi.string().max(200).optional(),
    city: Joi.string().max(100).optional(),
    state: Joi.string().max(100).optional(),
    zipCode: Joi.string().max(20).optional(),
    country: Joi.string().max(100).optional()
  }).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().max(200).required(),
    relationship: Joi.string().max(100).required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).required(),
    email: Joi.string().email().optional()
  }).optional(),
  insurance: Joi.object({
    provider: Joi.string().max(200).optional(),
    policyNumber: Joi.string().max(100).optional(),
    groupNumber: Joi.string().max(100).optional()
  }).optional(),
  preferences: Joi.object({
    language: Joi.string().max(10).default('en'),
    communicationMethod: Joi.string().valid('email', 'phone', 'sms', 'mail').default('email'),
    culturalConsiderations: Joi.array().items(Joi.string()).optional(),
    religiousConsiderations: Joi.array().items(Joi.string()).optional()
  }).optional()
});

/**
 * Patient update validation schema
 */
export const patientUpdateSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  address: Joi.object({
    street: Joi.string().max(200).optional(),
    city: Joi.string().max(100).optional(),
    state: Joi.string().max(100).optional(),
    zipCode: Joi.string().max(20).optional(),
    country: Joi.string().max(100).optional()
  }).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().max(200).optional(),
    relationship: Joi.string().max(100).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    email: Joi.string().email().optional()
  }).optional(),
  insurance: Joi.object({
    provider: Joi.string().max(200).optional(),
    policyNumber: Joi.string().max(100).optional(),
    groupNumber: Joi.string().max(100).optional()
  }).optional(),
  preferences: Joi.object({
    language: Joi.string().max(10).optional(),
    communicationMethod: Joi.string().valid('email', 'phone', 'sms', 'mail').optional(),
    culturalConsiderations: Joi.array().items(Joi.string()).optional(),
    religiousConsiderations: Joi.array().items(Joi.string()).optional()
  }).optional()
});

/**
 * Analysis request validation schema
 */
export const analysisRequestSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  symptoms: Joi.array().items(Joi.string()).min(1).required(),
  duration: Joi.string().max(100).optional(),
  severity: Joi.string().valid('mild', 'moderate', 'severe').optional(),
  context: Joi.object({
    recentActivities: Joi.array().items(Joi.string()).optional(),
    environmentalFactors: Joi.array().items(Joi.string()).optional(),
    stressLevel: Joi.number().min(1).max(10).optional(),
    sleepQuality: Joi.number().min(1).max(10).optional(),
    dietChanges: Joi.array().items(Joi.string()).optional()
  }).optional(),
  biometricData: Joi.object({
    heartRate: Joi.number().min(30).max(220).optional(),
    bloodPressure: Joi.object({
      systolic: Joi.number().min(70).max(250).optional(),
      diastolic: Joi.number().min(40).max(150).optional()
    }).optional(),
    temperature: Joi.number().min(35).max(42).optional(),
    weight: Joi.number().min(20).max(500).optional(),
    height: Joi.number().min(50).max(250).optional()
  }).optional(),
  culturalContext: Joi.object({
    beliefs: Joi.array().items(Joi.string()).optional(),
    preferences: Joi.array().items(Joi.string()).optional(),
    concerns: Joi.array().items(Joi.string()).optional()
  }).optional()
});

/**
 * Treatment plan validation schema
 */
export const treatmentPlanSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  diagnosis: Joi.string().required(),
  recommendations: Joi.array().items(Joi.object({
    type: Joi.string().valid('medication', 'lifestyle', 'therapy', 'procedure', 'monitoring').required(),
    title: Joi.string().max(200).required(),
    description: Joi.string().max(1000).required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').required(),
    duration: Joi.string().max(100).optional(),
    instructions: Joi.string().max(2000).optional(),
    warnings: Joi.array().items(Joi.string()).optional(),
    followUp: Joi.object({
      type: Joi.string().valid('appointment', 'test', 'check_in').required(),
      timeframe: Joi.string().max(100).required(),
      description: Joi.string().max(500).optional()
    }).optional()
  })).min(1).required(),
  holisticApproach: Joi.object({
    wellnessPlan: Joi.array().items(Joi.string()).optional(),
    alternativeTherapies: Joi.array().items(Joi.string()).optional(),
    lifestyleRecommendations: Joi.array().items(Joi.string()).optional()
  }).optional(),
  riskAssessment: Joi.object({
    level: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
    factors: Joi.array().items(Joi.string()).required(),
    recommendations: Joi.array().items(Joi.string()).required()
  }).required(),
  culturalConsiderations: Joi.object({
    adaptations: Joi.array().items(Joi.string()).optional(),
    contraindications: Joi.array().items(Joi.string()).optional(),
    preferences: Joi.array().items(Joi.string()).optional()
  }).optional()
});

/**
 * Authentication validation schemas
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  rememberMe: Joi.boolean().default(false)
});

export const registerSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  organizationId: Joi.string().uuid().optional(),
  role: Joi.string().valid('doctor', 'nurse', 'admin', 'patient').default('patient')
});

/**
 * Pagination validation schema
 */
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().max(200).optional(),
  filters: Joi.object().optional()
});

/**
 * UUID parameter validation schema
 */
export const uuidParamSchema = Joi.object({
  id: Joi.string().uuid().required()
});

/**
 * Date range validation schema
 */
export const dateRangeSchema = Joi.object({
  startDate: Joi.date().max('now').required(),
  endDate: Joi.date().min(Joi.ref('startDate')).max('now').required()
});

/**
 * File upload validation schema
 */
export const fileUploadSchema = Joi.object({
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/csv').required(),
    size: Joi.number().max(10 * 1024 * 1024).required() // 10MB max
  }).required()
});

/**
 * Custom validation for medical data
 */
export const medicalDataSchema = Joi.object({
  vitalSigns: Joi.object({
    heartRate: Joi.number().min(30).max(220).optional(),
    bloodPressure: Joi.object({
      systolic: Joi.number().min(70).max(250).optional(),
      diastolic: Joi.number().min(40).max(150).optional()
    }).optional(),
    temperature: Joi.number().min(35).max(42).optional(),
    respiratoryRate: Joi.number().min(8).max(40).optional(),
    oxygenSaturation: Joi.number().min(70).max(100).optional()
  }).optional(),
  labResults: Joi.array().items(Joi.object({
    testName: Joi.string().required(),
    value: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
    unit: Joi.string().optional(),
    referenceRange: Joi.string().optional(),
    date: Joi.date().max('now').required()
  })).optional(),
  medications: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    dosage: Joi.string().required(),
    frequency: Joi.string().required(),
    startDate: Joi.date().max('now').required(),
    endDate: Joi.date().min(Joi.ref('startDate')).optional()
  })).optional()
}); 