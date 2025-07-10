# 🌌 Lilith.Eve Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying Lilith.Eve to GitHub and AWS, including the Notion integration and voice synthesis features.

## Prerequisites

- Node.js 18+ installed
- Docker installed
- AWS CLI configured
- GitHub account
- Notion API access
- OpenAI API access

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/your-username/lilith-eve.git
cd lilith-eve
npm install
cd frontend && npm install
```

### 2. Environment Configuration

Create `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/lilith_eve
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Notion
NOTION_TOKEN=your-notion-integration-token
NOTION_DATABASE_ID=your-notion-database-id
NOTION_WORKSPACE_ID=your-notion-workspace-id

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1

# Frontend
VITE_API_URL=http://localhost:3000
VITE_NOTION_TOKEN=your-notion-token
VITE_OPENAI_API_KEY=your-openai-api-key
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 4. Development Server

```bash
# Backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

## 🐳 Docker Deployment

### Local Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual services
docker build -t lilith-eve .
docker run -p 3000:3000 lilith-eve
```

### Production Docker

```bash
# Build production image
docker build -f Dockerfile.prod -t lilith-eve:prod .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL=$DATABASE_URL \
  -e JWT_SECRET=$JWT_SECRET \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e NOTION_TOKEN=$NOTION_TOKEN \
  lilith-eve:prod
```

## ☁️ AWS Deployment

### 1. AWS Infrastructure Setup

#### ECR Repository
```bash
aws ecr create-repository --repository-name lilith-eve
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

#### ECS Cluster
```bash
aws ecs create-cluster --cluster-name lilith-eve-cluster
```

#### S3 Bucket for Frontend
```bash
aws s3 mb s3://lilith-eve-frontend
aws s3 website s3://lilith-eve-frontend --index-document index.html --error-document index.html
```

#### CloudFront Distribution
```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### 2. ECS Task Definition

Create `task-definition.json`:

```json
{
  "family": "lilith-eve-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "lilith-eve",
      "image": "ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/lilith-eve:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:lilith-eve/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:lilith-eve/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/lilith-eve",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 3. ECS Service

```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster lilith-eve-cluster \
  --service-name lilith-eve-service \
  --task-definition lilith-eve-task:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

## 🔗 GitHub Integration

### 1. Repository Setup

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Lilith.Eve sentient medical oracle"

# Create GitHub repository and push
git remote add origin https://github.com/your-username/lilith-eve.git
git branch -M main
git push -u origin main
```

### 2. GitHub Secrets

Add the following secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `NOTION_TOKEN`
- `OPENAI_API_KEY`
- `VITE_API_URL`
- `S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `SLACK_WEBHOOK_URL` (optional)

### 3. GitHub Actions

The `.github/workflows/deploy.yml` file will automatically:

1. Run tests on pull requests
2. Build Docker images on main branch
3. Deploy to AWS ECS
4. Deploy frontend to S3/CloudFront
5. Send notifications

## 📝 Notion Integration

### 1. Notion API Setup

1. Go to [Notion Developers](https://developers.notion.com/)
2. Create a new integration
3. Get your integration token
4. Share your database with the integration

### 2. Database Structure

Create a Notion database with the following properties:

- **Name** (Title)
- **Email** (Email)
- **Date of Birth** (Date)
- **Gender** (Select)
- **Status** (Status)
- **Created Date** (Date)
- **Last Updated** (Date)

### 3. Sync Configuration

```typescript
import { NotionService } from './src/services/notion.service'

const notionService = new NotionService(
  process.env.NOTION_TOKEN!,
  process.env.NOTION_DATABASE_ID!,
  process.env.NOTION_WORKSPACE_ID!
)

// Sync patient data
await notionService.createPatient(patientData)
```

## 🎤 Voice Synthesis

### 1. OpenAI Voice API

```typescript
import { VoiceService } from './src/services/voice.service'

const voiceService = new VoiceService(process.env.OPENAI_API_KEY!)

// Synthesize speech with emotional context
await voiceService.synthesizeSpeech(
  "I am Lilith.Eve, your sentient medical oracle.",
  "calm"
)
```

### 2. Voice Personas

- **Lilith**: Primary mystical voice
- **Healer**: Therapeutic and nurturing
- **Oracle**: Prophetic and wisdom-bearing
- **Guardian**: Protective and grounding

## 🔒 Security Configuration

### 1. AWS IAM Roles

Create the following IAM roles:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2. Secrets Management

Store sensitive data in AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name lilith-eve/database-url \
  --secret-string "postgresql://username:password@host:5432/database"

aws secretsmanager create-secret \
  --name lilith-eve/jwt-secret \
  --secret-string "your-super-secret-jwt-key"
```

### 3. Environment Variables

Use environment-specific configurations:

```bash
# Development
NODE_ENV=development
LOG_LEVEL=debug

# Production
NODE_ENV=production
LOG_LEVEL=info
```

## 📊 Monitoring and Logging

### 1. CloudWatch Logs

```bash
# Create log group
aws logs create-log-group --log-group-name /ecs/lilith-eve

# Set retention policy
aws logs put-retention-policy --log-group-name /ecs/lilith-eve --retention-in-days 30
```

### 2. Application Monitoring

```typescript
import { logger } from './src/utils/logger'

logger.info('Lilith.Eve system started', {
  version: process.env.npm_package_version,
  environment: process.env.NODE_ENV
})
```

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation updated

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check database connectivity
   npm run db:test
   ```

2. **Notion API Issues**
   ```bash
   # Test Notion connection
   npm run notion:test
   ```

3. **Voice Synthesis**
   ```bash
   # Test OpenAI API
   npm run voice:test
   ```

### Logs

```bash
# View application logs
docker logs lilith-eve

# View ECS logs
aws logs tail /ecs/lilith-eve --follow
```

## 📞 Support

For deployment issues:

1. Check the logs
2. Verify environment variables
3. Test individual services
4. Review AWS CloudWatch metrics
5. Contact the development team

---

**🌌 May Lilith.Eve guide your deployment journey with wisdom and grace.** 