export class MockAuthService {
  async login({ email, password, rememberMe = false }: { email: string; password: string; rememberMe?: boolean }) {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60; // 7d or 1h
    return {
      user: {
        id: 'user_mock_123',
        email,
        firstName: 'Lilith',
        lastName: 'Eve',
        role: 'doctor',
        permissions: [],
        organizationId: 'org_mock_001'
      },
      token: `mock_access.${Buffer.from(JSON.stringify({ sub: email, iat: now, exp: now + expiresIn })).toString('base64')}`,
      refreshToken: `mock_refresh.${Buffer.from(JSON.stringify({ sub: email, iat: now })).toString('base64')}`,
      expiresIn
    };
  }

  async refreshToken(refreshToken: string) {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60; // 1h
    return {
      token: `mock_access.${Buffer.from(JSON.stringify({ sub: 'user_mock_123', iat: now, exp: now + expiresIn })).toString('base64')}`,
      refreshToken: refreshToken || `mock_refresh.${Buffer.from(JSON.stringify({ sub: 'user_mock_123', iat: now })).toString('base64')}`,
      expiresIn
    };
  }
}

