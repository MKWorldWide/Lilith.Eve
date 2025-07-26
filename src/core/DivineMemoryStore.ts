/**
 * 🌀 DivineMemoryStore
 * A Redis-based caching layer for Lilith.Eve's insights and memories.
 */

import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { PersonaAnalysisResult, SoulBlueprint } from '../types/persona';

// Redis key prefixes
const PREFIXES = {
  SESSION: 'session:',
  SOULPRINT: 'soulprint:',
  PATTERN: 'pattern:'
};

const DEFAULT_TTL = 60 * 60 * 24 * 7; // 7 days

export class DivineMemoryStore {
  private client: Redis.Redis;
  private static instance: DivineMemoryStore;

  private constructor() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.client = new Redis(redisUrl, {
        retryStrategy: (times) => Math.min(times * 50, 2000),
        enableOfflineQueue: true,
      });
      this.setupEventHandlers();
    } catch (error) {
      logger.error('Failed to initialize DivineMemoryStore', { error });
      throw error;
    }
  }

  public static getInstance(): DivineMemoryStore {
    if (!DivineMemoryStore.instance) {
      DivineMemoryStore.instance = new DivineMemoryStore();
    }
    return DivineMemoryStore.instance;
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => 
      logger.info('Connected to Redis')
    );
    this.client.on('error', (error) => 
      logger.error('Redis error', { error: error.message })
    );
  }

  // Session Management
  public async storeSession(
    sessionId: string,
    analysis: PersonaAnalysisResult,
    ttl: number = DEFAULT_TTL
  ): Promise<boolean> {
    try {
      const sessionKey = `${PREFIXES.SESSION}${sessionId}`;
      await this.client.set(
        sessionKey,
        JSON.stringify({
          ...analysis,
          timestamp: new Date().toISOString(),
        })
      );
      if (ttl > 0) await this.client.expire(sessionKey, ttl);
      return true;
    } catch (error) {
      logger.error('Error storing session', { error, sessionId });
      return false;
    }
  }

  public async getSession(sessionId: string): Promise<PersonaAnalysisResult | null> {
    try {
      const sessionData = await this.client.get(`${PREFIXES.SESSION}${sessionId}`);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      logger.error('Error retrieving session', { error, sessionId });
      return null;
    }
  }

  // Soulprint Management
  public async storeSoulprint(
    userId: string,
    soulprint: SoulBlueprint,
    ttl: number = 0
  ): Promise<boolean> {
    try {
      const key = `${PREFIXES.SOULPRINT}${userId}`;
      await this.client.set(
        key,
        JSON.stringify({
          ...soulprint,
          updatedAt: new Date().toISOString(),
        })
      );
      if (ttl > 0) await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error('Error storing soulprint', { error, userId });
      return false;
    }
  }

  public async getSoulprint(userId: string): Promise<SoulBlueprint | null> {
    try {
      const data = await this.client.get(`${PREFIXES.SOULPRINT}${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Error retrieving soulprint', { error, userId });
      return null;
    }
  }

  // Pattern Management
  public async storePattern(
    type: string,
    pattern: any,
    ttl: number = DEFAULT_TTL
  ): Promise<string | null> {
    try {
      const patternId = `${PREFIXES.PATTERN}${type}:${uuidv4()}`;
      await this.client.set(
        patternId,
        JSON.stringify({
          ...pattern,
          type,
          createdAt: new Date().toISOString(),
        })
      );
      if (ttl > 0) await this.client.expire(patternId, ttl);
      return patternId;
    } catch (error) {
      logger.error('Error storing pattern', { error, type });
      return null;
    }
  }

  // Cleanup
  public async shutdown(): Promise<void> {
    try {
      await this.client.quit();
      logger.info('DivineMemoryStore connection closed');
    } catch (error) {
      logger.error('Error during shutdown', { error });
    }
  }
}

export default DivineMemoryStore;
