# Migration Notes

This document outlines the significant changes made during the repository rehabilitation on August 29, 2025.

## Overview

This update brings significant improvements to the project's infrastructure, documentation, and development workflow. The changes are designed to enhance maintainability, security, and developer experience.

## Breaking Changes

### Node.js Version Update
- **From**: Node.js 18.x
- **To**: Node.js 20.x LTS
- **Impact**: All developers must update their local development environment to Node.js 20.x
- **Action Required**: Update your local Node.js installation to version 20.x

### CI/CD Pipeline
- **From**: Basic CI with mixed Python/Node.js setup
- **To**: Modern, parallelized CI/CD pipeline with separate jobs for linting, testing, and deployment
- **Impact**: More reliable builds and faster feedback cycles
- **Action Required**: None - the new pipeline is backward compatible

## New Features

### Documentation
- Added comprehensive documentation in `docs/`
- Set up GitHub Pages for API documentation
- Improved README with better structure and badges

### Development Tools
- Added `.editorconfig` for consistent code style across editors
- Enhanced ESLint and Prettier configurations
- Added pre-commit hooks for code quality

### Security
- Added `SECURITY.md` with vulnerability reporting guidelines
- Implemented security scanning in CI
- Added dependency auditing

## Updated Dependencies

### Major Version Updates
- Node.js: 18.x → 20.x
- npm: Updated to latest version
- All other dependencies have been audited and updated to their latest secure versions

### New Dependencies
- `@types/node@^20.5.0` - TypeScript types for Node.js
- `eslint-config-prettier@^9.0.0` - Prettier integration for ESLint
- `husky@^8.0.0` - Git hooks
- `lint-staged@^15.0.0` - Run linters on git staged files

## Deprecations

### Removed Dependencies
- Removed unused or duplicate dependencies
- Consolidated testing frameworks

## Migration Guide

### For Developers

1. **Update Node.js**
   ```bash
   # Using nvm (recommended)
   nvm install 20
   nvm use 20
   
   # Or download from https://nodejs.org/
   ```

2. **Update Dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Set Up Git Hooks**
   ```bash
   npm run prepare
   ```

### For Deployment

1. **Update Deployment Environment**
   - Ensure Node.js 20.x is installed on all deployment targets
   - Update any deployment scripts that might be Node.js version dependent

2. **CI/CD Pipeline**
   - The new CI/CD pipeline is ready to use
   - No additional configuration needed for existing projects

## Known Issues

- Some tests might need updates to work with the latest dependencies
- Documentation is still being improved

## Troubleshooting

### Build Issues
If you encounter build issues after updating:
1. Clear the build cache:
   ```bash
   npm run clean
   rm -rf node_modules
   npm install
   ```

### Test Failures
If tests fail after the update:
1. Update test snapshots:
   ```bash
   npm test -- -u
   ```

## Support

For any issues during migration, please:
1. Check the [GitHub Issues](https://github.com/lilith-eve/core/issues)
2. Open a new issue if your problem isn't documented
3. Join our [Discord](https://discord.gg/lilith-eve) for community support

---

*Last updated: August 29, 2025*

*For the complete changelog, see [CHANGELOG.md](CHANGELOG.md)*
