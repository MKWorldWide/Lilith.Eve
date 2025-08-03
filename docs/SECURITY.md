---
layout: default
title: Security Guide
---

# Security Guide

Security is woven into every layer of Lilith.Eve.

## Practices
- Helmet & rate limiting guard all HTTP traffic.
- Sensitive fields are redacted in logs via `sanitizeData`.
- JWT tokens are rotated and scoped to least privilege.

## Reporting
Please disclose vulnerabilities responsibly at `security@lilith-eve.com`.

*Last updated: 2025-08-03*
