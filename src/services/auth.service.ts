type UUID = string;

interface LoginRequest { email: string; password: string; rememberMe?: boolean }
interface RegisterRequest { firstName: string; lastName: string; email: string; password: string; }

interface User {
  id: UUID;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  organizationId: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

const mem = {
  users: new Map<UUID, User>(),
  byEmail: new Map<string, UUID>(),
  sessions: new Map<UUID, { sessionId: UUID; userId: UUID; createdAt: number }[]>(),
  orgs: new Map<UUID, { id: UUID; name: string }>(),
};

function uuid(): UUID { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8; return v.toString(16);
}); }

function nowSec() { return Math.floor(Date.now() / 1000); }

export class AuthService {
  constructor() {
    if (mem.users.size === 0) {
      const id = uuid();
      const user: User = { id, email: 'admin@example.com', firstName: 'Admin', lastName: 'User', role: 'admin', permissions: ['*'], organizationId: 'org-1', isActive: true, isEmailVerified: true };
      mem.users.set(id, user); mem.byEmail.set(user.email, id);
      mem.orgs.set('org-1', { id: 'org-1', name: 'Lilith Org' });
    }
  }

  async login({ email, password, rememberMe = false }: LoginRequest) {
    const uid = mem.byEmail.get(email);
    const user = uid ? mem.users.get(uid)! : this._registerSilent(email);
    const sid = uuid();
    const list = mem.sessions.get(user.id) || []; list.push({ sessionId: sid, userId: user.id, createdAt: Date.now() }); mem.sessions.set(user.id, list);
    const exp = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60;
    const token = `mock.${Buffer.from(JSON.stringify({ sub: user.id, iat: nowSec(), exp: nowSec() + exp })).toString('base64')}`;
    const refreshToken = `r.${Buffer.from(JSON.stringify({ sub: user.id, iat: nowSec() })).toString('base64')}`;
    return { user, token, refreshToken, expiresIn: exp };
  }

  async register(data: RegisterRequest) {
    const id = uuid();
    const user: User = { id, email: data.email, firstName: data.firstName, lastName: data.lastName, role: 'patient', permissions: [], organizationId: 'org-1', isActive: true, isEmailVerified: false };
    mem.users.set(id, user); mem.byEmail.set(user.email, id);
    return { user };
  }

  async refreshToken(refreshToken: string) {
    const exp = 60 * 60; const token = `mock.${Buffer.from(JSON.stringify({ iat: nowSec(), exp: nowSec() + exp })).toString('base64')}`;
    return { token, refreshToken, expiresIn: exp };
  }

  async logout(userId: UUID, refreshToken?: string) {
    mem.sessions.set(userId, []); return { success: true };
  }

  async getProfile(userId: UUID) { return mem.users.get(userId) || null; }
  async updateProfile(userId: UUID, update: Partial<User>) {
    const u = mem.users.get(userId); if (!u) throw new Error('User not found'); const merged = { ...u, ...update }; mem.users.set(userId, merged); return merged;
  }

  async changePassword(userId: UUID, _data: any) { return { success: true }; }
  async requestPasswordReset(email: string) { return { success: true, email }; }
  async resetPassword(_token: string, _newPassword: string) { return { success: true }; }

  async verifyEmail(_token: string) { return { success: true }; }
  async resendEmailVerification(_userId: UUID) { return { success: true }; }

  async getSessions(userId: UUID) { return mem.sessions.get(userId) || []; }
  async revokeSession(userId: UUID, sessionId: UUID) {
    const list = (mem.sessions.get(userId) || []).filter(s => s.sessionId !== sessionId); mem.sessions.set(userId, list); return { success: true };
  }
  async revokeAllSessions(userId: UUID) { mem.sessions.set(userId, []); return { success: true }; }

  async enable2FA(_userId: UUID) { return { secret: '2fa-secret', otpauth: 'otpauth://totp/mock' }; }
  async verify2FA(_userId: UUID, _code: string) { return { success: true }; }
  async disable2FA(_userId: UUID, _password?: string) { return { success: true }; }
  async generateBackupCodes(_userId: UUID) { return { codes: Array.from({ length: 10 }).map(() => uuid().slice(0, 8)) }; }

  async getPermissions(_userId: UUID) { return ['*']; }
  async checkPermission(_userId: UUID, _permission: string) { return true; }
  async getRoles(_userId: UUID) { return ['admin']; }
  async checkRole(_userId: UUID, _role: string) { return true; }

  async getLoginHistory(_userId: UUID, _opts: any) { return { items: [], page: 1, total: 0 }; }
  async getSecurityEvents(_userId: UUID, _opts: any) { return { items: [], page: 1, total: 0 }; }
  async validateToken(_userId: UUID) { return { valid: true }; }

  async getAllUsers(_opts: any) {
    const users = Array.from(mem.users.values()); return { users, page: 1, limit: users.length, total: users.length };
  }
  async getUserById(id: UUID) { const u = mem.users.get(id); if (!u) throw new Error('User not found'); return u; }
  async createUser(data: Partial<User>) { const id = uuid(); const u: User = { id, email: data.email || `user${id}@example.com`, firstName: data.firstName || 'First', lastName: data.lastName || 'Last', role: data.role || 'patient', permissions: [], organizationId: data.organizationId || 'org-1', isActive: true, isEmailVerified: false }; mem.users.set(id, u); mem.byEmail.set(u.email, id); return u; }
  async updateUser(id: UUID, update: Partial<User>) { const u = mem.users.get(id); if (!u) throw new Error('User not found'); const merged = { ...u, ...update }; mem.users.set(id, merged); return merged; }
  async deleteUser(id: UUID) { mem.users.delete(id); return { success: true }; }
  async activateUser(id: UUID) { const u = mem.users.get(id); if (!u) throw new Error('User not found'); u.isActive = true; return u; }
  async deactivateUser(id: UUID) { const u = mem.users.get(id); if (!u) throw new Error('User not found'); u.isActive = false; return u; }
  async updateUserRoles(id: UUID, _roles: string[]) { const u = mem.users.get(id); if (!u) throw new Error('User not found'); return u; }
  async getUserPermissions(id: UUID) { const u = mem.users.get(id); if (!u) throw new Error('User not found'); return u.permissions; }
  async updateUserPermissions(id: UUID, permissions: string[]) { const u = mem.users.get(id); if (!u) throw new Error('User not found'); u.permissions = permissions; return u; }

  async getAllOrganizations(_opts: any) { const orgs = Array.from(mem.orgs.values()); return { organizations: orgs, page: 1, limit: orgs.length, total: orgs.length }; }
  async getOrganizationById(id: UUID) { const org = mem.orgs.get(id); if (!org) throw new Error('Organization not found'); return org; }
  async createOrganization(data: any) { const id = uuid(); const org = { id, name: data?.name || `Org ${id}` }; mem.orgs.set(id, org); return org; }
  async updateOrganization(id: UUID, update: any) { const org = mem.orgs.get(id); if (!org) throw new Error('Organization not found'); const merged = { ...org, ...update }; mem.orgs.set(id, merged); return merged; }
  async deleteOrganization(id: UUID) { mem.orgs.delete(id); return { success: true }; }

  async getUserStats() { return { totalUsers: mem.users.size }; }
  async getSessionStats() { let total = 0; for (const v of mem.sessions.values()) total += v.length; return { totalSessions: total }; }
  async getSecurityStats() { return { incidents: 0 }; }
  async getAuditLog(_opts: any) { return { items: [], total: 0 }; }

  private _registerSilent(email: string): User {
    const id = uuid(); const user: User = { id, email, firstName: 'User', lastName: 'Mock', role: 'patient', permissions: [], organizationId: 'org-1', isActive: true, isEmailVerified: true };
    mem.users.set(id, user); mem.byEmail.set(email, id); return user;
  }
}

