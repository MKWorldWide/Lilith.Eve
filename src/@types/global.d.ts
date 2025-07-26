// Type definitions for Node.js process.env
namespace NodeJS {
  interface ProcessEnv {
    // Server Configuration
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    HOST?: string;
    
    // Logging
    LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug' | 'silly';
    ENABLE_HTTP_LOGGING?: string;
    
    // Security
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    ALLOWED_ORIGINS?: string;
    RATE_LIMIT_WINDOW_MS?: string;
    RATE_LIMIT_REQUESTS_PER_MINUTE?: string;
    
    // Database
    REDIS_URL?: string;
    MONGODB_URI: string;
    
    // External Services
    GOOGLE_CLOUD_API_KEY?: string;
    GOOGLE_TRANSLATE_API_KEY?: string;
    
    // Feature Flags
    ENABLE_SWAGGER?: string;
    ENABLE_GRAPHIQL?: string;
    
    // Package Info (from package.json)
    npm_package_name?: string;
    npm_package_version?: string;
    npm_package_description?: string;
    
    // Lilith.Eve Specific
    LILITH_ENV?: 'development' | 'staging' | 'production';
    SESSION_SECRET: string;
    ENCRYPTION_KEY: string;
    
    // Monitoring
    SENTRY_DSN?: string;
    NEW_RELIC_LICENSE_KEY?: string;
    
    // Email
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    EMAIL_FROM?: string;
    
    // File Storage
    S3_BUCKET_NAME?: string;
    S3_ACCESS_KEY?: string;
    S3_SECRET_KEY?: string;
    S3_REGION?: string;
    
    // Analytics
    GOOGLE_ANALYTICS_ID?: string;
    MIXPANEL_TOKEN?: string;
    
    // AI/ML Services
    OPENAI_API_KEY?: string;
    HUGGINGFACE_API_KEY?: string;
    
    // Voice Services
    ELEVEN_LABS_API_KEY?: string;
    
    // [key: string]: string | undefined; // Index signature for dynamic access
  }
}

// Ensure this file is treated as a module
export {};
