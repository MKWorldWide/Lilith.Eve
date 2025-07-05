/**
 * @fileoverview Authentication Types - Lilith.Eve Medical AI Oracle
 * 
 * This file defines TypeScript types and interfaces for authentication,
 * authorization, and user management throughout the system.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request } from 'express';

/**
 * User roles enumeration
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PATIENT = 'patient',
  RESEARCHER = 'researcher',
  ANALYST = 'analyst'
}

/**
 * Permission types
 */
export enum Permission {
  // Patient permissions
  PATIENT_READ = 'patient:read',
  PATIENT_CREATE = 'patient:create',
  PATIENT_UPDATE = 'patient:update',
  PATIENT_DELETE = 'patient:delete',
  PATIENT_ANALYZE = 'patient:analyze',
  
  // Medical data permissions
  MEDICAL_DATA_READ = 'medical_data:read',
  MEDICAL_DATA_CREATE = 'medical_data:create',
  MEDICAL_DATA_UPDATE = 'medical_data:update',
  MEDICAL_DATA_DELETE = 'medical_data:delete',
  
  // Treatment permissions
  TREATMENT_READ = 'treatment:read',
  TREATMENT_CREATE = 'treatment:create',
  TREATMENT_UPDATE = 'treatment:update',
  TREATMENT_DELETE = 'treatment:delete',
  TREATMENT_APPROVE = 'treatment:approve',
  
  // Analysis permissions
  ANALYSIS_READ = 'analysis:read',
  ANALYSIS_CREATE = 'analysis:create',
  ANALYSIS_UPDATE = 'analysis:update',
  ANALYSIS_DELETE = 'analysis:delete',
  ANALYSIS_EXECUTE = 'analysis:execute',
  
  // System permissions
  SYSTEM_CONFIG_READ = 'system_config:read',
  SYSTEM_CONFIG_UPDATE = 'system_config:update',
  SYSTEM_MONITORING = 'system:monitoring',
  SYSTEM_LOGS_READ = 'system_logs:read',
  
  // User management permissions
  USER_READ = 'user:read',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_ROLE_MANAGE = 'user_role:manage',
  
  // Organization permissions
  ORGANIZATION_READ = 'organization:read',
  ORGANIZATION_CREATE = 'organization:create',
  ORGANIZATION_UPDATE = 'organization:update',
  ORGANIZATION_DELETE = 'organization:delete',
  
  // AI model permissions
  AI_MODEL_READ = 'ai_model:read',
  AI_MODEL_CREATE = 'ai_model:create',
  AI_MODEL_UPDATE = 'ai_model:update',
  AI_MODEL_DELETE = 'ai_model:delete',
  AI_MODEL_TRAIN = 'ai_model:train',
  
  // Research permissions
  RESEARCH_DATA_READ = 'research_data:read',
  RESEARCH_DATA_CREATE = 'research_data:create',
  RESEARCH_DATA_UPDATE = 'research_data:update',
  RESEARCH_DATA_DELETE = 'research_data:delete',
  RESEARCH_ANALYZE = 'research:analyze'
}

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  organizationId: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Authenticated user interface
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  organizationId: string;
  sessionId: string;
}

/**
 * Extended request interface with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Login request interface
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register request interface
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationId?: string;
  role?: UserRole;
}

/**
 * Password reset request interface
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirm interface
 */
export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Change password interface
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Refresh token interface
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    permissions: Permission[];
    organizationId: string;
  };
}

/**
 * Token payload interface
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  organizationId: string;
  sessionId: string;
  iat: number;
  exp: number;
}

/**
 * Session interface
 */
export interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Organization interface
 */
export interface Organization {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'research_institute' | 'pharmaceutical' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  settings: {
    timezone: string;
    language: string;
    dateFormat: string;
    currency: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Role permission mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  
  [UserRole.ADMIN]: [
    Permission.PATIENT_READ,
    Permission.PATIENT_CREATE,
    Permission.PATIENT_UPDATE,
    Permission.PATIENT_DELETE,
    Permission.MEDICAL_DATA_READ,
    Permission.MEDICAL_DATA_CREATE,
    Permission.MEDICAL_DATA_UPDATE,
    Permission.TREATMENT_READ,
    Permission.TREATMENT_CREATE,
    Permission.TREATMENT_UPDATE,
    Permission.TREATMENT_APPROVE,
    Permission.ANALYSIS_READ,
    Permission.ANALYSIS_CREATE,
    Permission.ANALYSIS_EXECUTE,
    Permission.SYSTEM_CONFIG_READ,
    Permission.SYSTEM_MONITORING,
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.ORGANIZATION_READ,
    Permission.ORGANIZATION_UPDATE
  ],
  
  [UserRole.DOCTOR]: [
    Permission.PATIENT_READ,
    Permission.PATIENT_CREATE,
    Permission.PATIENT_UPDATE,
    Permission.MEDICAL_DATA_READ,
    Permission.MEDICAL_DATA_CREATE,
    Permission.MEDICAL_DATA_UPDATE,
    Permission.TREATMENT_READ,
    Permission.TREATMENT_CREATE,
    Permission.TREATMENT_UPDATE,
    Permission.TREATMENT_APPROVE,
    Permission.ANALYSIS_READ,
    Permission.ANALYSIS_CREATE,
    Permission.ANALYSIS_EXECUTE,
    Permission.RESEARCH_DATA_READ,
    Permission.RESEARCH_ANALYZE
  ],
  
  [UserRole.NURSE]: [
    Permission.PATIENT_READ,
    Permission.PATIENT_UPDATE,
    Permission.MEDICAL_DATA_READ,
    Permission.MEDICAL_DATA_CREATE,
    Permission.MEDICAL_DATA_UPDATE,
    Permission.TREATMENT_READ,
    Permission.TREATMENT_UPDATE,
    Permission.ANALYSIS_READ
  ],
  
  [UserRole.PATIENT]: [
    Permission.PATIENT_READ,
    Permission.MEDICAL_DATA_READ,
    Permission.TREATMENT_READ,
    Permission.ANALYSIS_READ
  ],
  
  [UserRole.RESEARCHER]: [
    Permission.PATIENT_READ,
    Permission.MEDICAL_DATA_READ,
    Permission.ANALYSIS_READ,
    Permission.ANALYSIS_CREATE,
    Permission.ANALYSIS_EXECUTE,
    Permission.RESEARCH_DATA_READ,
    Permission.RESEARCH_DATA_CREATE,
    Permission.RESEARCH_DATA_UPDATE,
    Permission.RESEARCH_ANALYZE
  ],
  
  [UserRole.ANALYST]: [
    Permission.PATIENT_READ,
    Permission.MEDICAL_DATA_READ,
    Permission.ANALYSIS_READ,
    Permission.ANALYSIS_CREATE,
    Permission.ANALYSIS_EXECUTE,
    Permission.RESEARCH_DATA_READ,
    Permission.RESEARCH_ANALYZE,
    Permission.SYSTEM_MONITORING
  ]
};

/**
 * Permission descriptions
 */
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  [Permission.PATIENT_READ]: 'Read patient information',
  [Permission.PATIENT_CREATE]: 'Create new patient records',
  [Permission.PATIENT_UPDATE]: 'Update patient information',
  [Permission.PATIENT_DELETE]: 'Delete patient records',
  [Permission.PATIENT_ANALYZE]: 'Analyze patient data',
  
  [Permission.MEDICAL_DATA_READ]: 'Read medical data',
  [Permission.MEDICAL_DATA_CREATE]: 'Create medical data records',
  [Permission.MEDICAL_DATA_UPDATE]: 'Update medical data',
  [Permission.MEDICAL_DATA_DELETE]: 'Delete medical data',
  
  [Permission.TREATMENT_READ]: 'Read treatment plans',
  [Permission.TREATMENT_CREATE]: 'Create treatment plans',
  [Permission.TREATMENT_UPDATE]: 'Update treatment plans',
  [Permission.TREATMENT_DELETE]: 'Delete treatment plans',
  [Permission.TREATMENT_APPROVE]: 'Approve treatment plans',
  
  [Permission.ANALYSIS_READ]: 'Read analysis results',
  [Permission.ANALYSIS_CREATE]: 'Create new analyses',
  [Permission.ANALYSIS_UPDATE]: 'Update analysis results',
  [Permission.ANALYSIS_DELETE]: 'Delete analysis results',
  [Permission.ANALYSIS_EXECUTE]: 'Execute AI analyses',
  
  [Permission.SYSTEM_CONFIG_READ]: 'Read system configuration',
  [Permission.SYSTEM_CONFIG_UPDATE]: 'Update system configuration',
  [Permission.SYSTEM_MONITORING]: 'Access system monitoring',
  [Permission.SYSTEM_LOGS_READ]: 'Read system logs',
  
  [Permission.USER_READ]: 'Read user information',
  [Permission.USER_CREATE]: 'Create new users',
  [Permission.USER_UPDATE]: 'Update user information',
  [Permission.USER_DELETE]: 'Delete users',
  [Permission.USER_ROLE_MANAGE]: 'Manage user roles',
  
  [Permission.ORGANIZATION_READ]: 'Read organization information',
  [Permission.ORGANIZATION_CREATE]: 'Create new organizations',
  [Permission.ORGANIZATION_UPDATE]: 'Update organization information',
  [Permission.ORGANIZATION_DELETE]: 'Delete organizations',
  
  [Permission.AI_MODEL_READ]: 'Read AI model information',
  [Permission.AI_MODEL_CREATE]: 'Create new AI models',
  [Permission.AI_MODEL_UPDATE]: 'Update AI models',
  [Permission.AI_MODEL_DELETE]: 'Delete AI models',
  [Permission.AI_MODEL_TRAIN]: 'Train AI models',
  
  [Permission.RESEARCH_DATA_READ]: 'Read research data',
  [Permission.RESEARCH_DATA_CREATE]: 'Create research data',
  [Permission.RESEARCH_DATA_UPDATE]: 'Update research data',
  [Permission.RESEARCH_DATA_DELETE]: 'Delete research data',
  [Permission.RESEARCH_ANALYZE]: 'Analyze research data'
}; 