<div align="center">

<img src="./public/logo.svg" width="150" height="150" alt="Senda Logo">

# Senda CMS

**Modern Content Management for AI-Generated Meditation Courses**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](./package.json)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)](./next.config.ts)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](./tsconfig.json)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](https://github.com/fariassdev/senda/blob/main/LICENSE)

A modern frontend application built with **Next.js 16** and **TypeScript** for managing meditation course creation and content delivery. Features admin authentication, AI-powered script generation, and real-time course management.

**Part of the [Senda Project](https://github.com/fariassdev/senda) — A multirepo coordinated with [Senda API](https://github.com/fariassdev/senda-api)**

[Getting Started](#getting-started) • [Configuration](#configuration) • [Development](#development) • [Deployment](#deployment)

</div>

## Overview

Senda CMS is the admin interface for the Senda platform. It provides an intuitive dashboard for managing meditation courses, generating lesson scripts via AI, and producing high-quality audio content through Kokoro TTS integration.

### Key Features

- **Course Management** — Create, organize, and manage meditation courses with multi-level hierarchy
- **AI Script Generation** — Generate lesson scripts using Google Gemini AI
- **Audio Production** — Convert scripts to audio via Kokoro TTS integration
- **Admin Authentication** — JWT-based security with role-based access control
- **Real-time Status** — Monitor generation progress and task status
- **Responsive Design** — Mobile-friendly interface built with Tailwind CSS
- **Modern Stack** — Next.js App Router, React 19, TypeScript, and component library

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git
- Access to Senda API running locally or remotely
- Running from the Senda project root (recommended)

### Installation

**Option 1: Full Stack (Recommended)**

From the Senda project root:

```bash
cd senda
make setup    # Sets up entire stack including CMS, API, database, TTS
```

**Option 2: CMS Only**

If developing CMS in isolation:

```bash
# Clone the repository
git clone https://github.com/fariassdev/senda-cms.git
cd senda-cms

# Install dependencies with Bun (recommended)
bun install

# or with npm
npm install
```

### Configuration

```bash
# Copy environment template
cp .env.local.example .env.local
```

**Edit `.env.local` with:**

```env
# API Configuration (adjust port if using local API)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081    # Senda API endpoint
NEXT_PUBLIC_BUILD=development                      # Environment: development|staging|production

# Authentication
JWT_SECRET=your-secret-key-here                    # Must match backend
```

### Development Server

```bash
# Start development server with Turbopack
bun dev

# or with npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the CMS.

### Available Commands

```bash
bun dev              # Start development server
bun build            # Build for production
bun start            # Run production server
bun lint             # Run ESLint
bun lint:fix         # Auto-fix linting issues
bun format           # Format code with Prettier
bun test             # Run tests (if configured)
```

## Tech Stack

### Frontend

| Layer             | Technology        | Purpose                              |
| ----------------- | ----------------- | ------------------------------------ |
| **Framework**     | Next.js 16        | React meta-framework with App Router |
| **Language**      | TypeScript        | Type-safe development                |
| **Styling**       | Tailwind CSS      | Utility-first CSS framework          |
| **UI Components** | shadcn/ui         | Accessible component library         |
| **CSS-in-JS**     | Styled Components | Complex styling patterns             |

### State Management

| Tool                             | Purpose                            |
| -------------------------------- | ---------------------------------- |
| **React Query (TanStack Query)** | Server state management & API sync |
| **Zustand**                      | Client state management            |
| **React Hook Form**              | Form state & validation            |

### Security

| Feature             | Implementation            |
| ------------------- | ------------------------- |
| **Authentication**  | JWT token-based           |
| **Authorization**   | Admin-only access control |
| **Protocol**        | HTTPS enforcement         |
| **CSRF Protection** | Token-based protection    |

### Development Tools

| Tool            | Purpose                |
| --------------- | ---------------------- |
| **ESLint**      | Code quality & linting |
| **Prettier**    | Code formatting        |
| **Husky**       | Git hooks automation   |
| **lint-staged** | Pre-commit linting     |
| **commitlint**  | Conventional commits   |

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── containers/          # Connected components with business logic
├── hooks/               # Custom React hooks
├── stores/              # Zustand state stores
├── services/            # API services and utilities
├── models/              # Data models and normalizers
├── styles/              # Global styles and theme tokens
└── lib/                 # Utility functions and configurations
```

## API Integration

The CMS integrates with the Senda API for course and lesson management. Key endpoints include:

- **Courses**: CRUD operations for meditation courses
- **Lessons**: Lesson management within courses
- **Script Generation**: AI-powered content generation
- **Audio Generation**: Text-to-speech conversion

For detailed API documentation, start the Senda API project and fetch the OpenAPI spec at: `http://localhost:8000/api/openapi.json`

## Authentication

The system uses JWT-based authentication with admin-only access control. All users must have administrative privileges to access the CMS.

### Key Features:

- Secure login with email/password
- Automatic session management
- Token refresh mechanism
- Cross-tab session synchronization
- Secure logout functionality

## UI Components

Built with shadcn/ui components and customized with styled-components:

- Modern, accessible component library
- Consistent design system
- Responsive layouts
- Dark/light theme support
- Form components with validation

## Deployment

The application is deployed on **Vercel** with automatic deployments from GitHub.

### Production URLs

- **CMS Application**: `https://senda-cms-tfg.vercel.app`

### Branch Strategy

- **Production**: `main` branch → automatic deployment to production
- **Staging**: `develop` branch → automatic deployment to staging
- **Preview**: Pull Requests → preview deployments
- **Development**: Local development with docker compose or `bun dev`

### Environment Variables

Required environment variables for deployment:

| Variable                   | Description                                                   | Required |
| -------------------------- | ------------------------------------------------------------- | -------- |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL                                               | ✅       |
| `NEXT_PUBLIC_BUILD`        | Environment identifier (`production`/`preview`/`development`) | ✅       |
| `JWT_SECRET`               | JWT token secret (must match backend)                         | ✅       |

### Health Check Endpoint

The application exposes a health check endpoint for monitoring:

```bash
curl https://your-deployment-url/api/health
# Response: { "status": "ok", "timestamp": "2025-12-19T02:00:00.000Z", "version": "0.1.0" }
```

### Deployment Troubleshooting

| Issue                              | Solution                                               |
| ---------------------------------- | ------------------------------------------------------ |
| Build fails with TypeScript errors | Run `bun typecheck` locally before pushing             |
| Environment variables not working  | Ensure `NEXT_PUBLIC_` prefix for client-side variables |
| API connection errors              | Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly     |
| CORS errors                        | Ensure backend allows requests from production domain  |

### Local Production Build

Test the production build locally:

```bash
bun run build
bun start
```

## Documentation

- [UX Design Specification](./docs/ux-design-specification.md) - Complete UX and design guidelines
- [Design System](./docs/design-system.md) - Component design system
- [Deployment Guide](./docs/deployment.md) - Detailed deployment instructions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Quality

- Follow conventional commit messages
- Ensure all tests pass
- Maintain code coverage standards
- Use TypeScript for type safety

## License

AGPL-3.0 License — see [LICENSE](https://github.com/fariassdev/senda/blob/main/LICENSE) for details

## Support

For technical support or questions:

- Create an issue in the repository
- Contact the development team
- Review the documentation in the `docs/` directory

---

Built with Next.js, TypeScript, and Bun.
