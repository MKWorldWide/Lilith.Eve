# Contributing to Lilith.Eve

Thank you for your interest in contributing to Lilith.Eve! We appreciate your time and effort in helping us improve this project. This document outlines the process for contributing to the project.

## Code of Conduct

This project adheres to our [Covenant Code of Conduct](COVENANT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/your-username/lilith-eve.git
   cd lilith-eve
   ```
3. **Set up** the development environment
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```
4. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Prerequisites

- Node.js 20.x
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Available Scripts

- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Lint the code
- `npm run format` - Format the code
- `npm run build` - Build the project
- `npm run docs:generate` - Generate API documentation

### Coding Standards

- Follow the [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- Use meaningful commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification
- Write tests for new features and bug fixes
- Update documentation when adding new features or changing behavior

## Pull Request Process

1. Ensure your code passes all tests and linting checks
2. Update the documentation if needed
3. Add tests for your changes
4. Open a pull request with a clear title and description
5. Reference any related issues
6. Ensure the CI build passes

## Reporting Issues

When reporting issues, please include:

- A clear title and description
- Steps to reproduce the issue
- Expected vs. actual behavior
- Any relevant logs or screenshots
- Your environment (OS, Node.js version, etc.)

## Security Vulnerabilities

If you discover a security vulnerability, please report it by emailing security@lilith-eve.com. All security vulnerabilities will be promptly addressed.

## License

By contributing to Lilith.Eve, you agree that your contributions will be licensed under the [MIT License](LICENSE).
