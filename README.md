# Senda CMS

A modern content management system designed to streamline the creation and management of guided meditation courses. Built with Next.js 15, TypeScript, and powered by AI capabilities through the Senda API.

## 🧘‍♀️ Overview

Senda CMS provides an intuitive interface for creating meditation courses, generating lesson scripts, and producing audio content. The system leverages AI to automate content generation while maintaining high quality and consistency across all meditation courses.

### Key Features

- **Course Management**: Create, organize, and manage meditation courses with intuitive workflows
- **AI-Powered Script Generation**: Automatically generate lesson scripts using the Senda API
- **Audio Production**: Convert scripts to high-quality audio using Kokoro TTS integration
- **Admin Authentication**: Secure JWT-based authentication system with admin-only access
- **Real-time Status Tracking**: Monitor course and lesson generation progress
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended package manager)
- Node.js 18+ (if not using Bun)
- Access to the Senda API

### Installation

1. Clone the repository:

```bash
git clone https://github.com/fariassdev/senda-cms.git
cd senda-cms
```

2. Install dependencies using Bun:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.local.example .env
```

Configure the following environment variables:

- `NEXT_PUBLIC_API_BASE_URL`: Senda API base URL
- `NEXT_PUBLIC_BUILD`: Environment identifier (development/staging/production)
- `JWT_SECRET`: JWT token secret (must match backend)

### Development

Start the development server with Turbopack:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Available Scripts

- `bun dev` - Start development server with Turbopack
- `bun build` - Build the application for production
- `bun start` - Start the production server
- `bun lint` - Run ESLint for code quality
- `bun lint:fix` - Auto-fix linting issues
- `bun format` - Format code with Prettier

## 🏗️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Styled Components** - CSS-in-JS for complex styling

### State Management

- **React Query (TanStack Query)** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form state management

### Authentication & Security

- **JWT Authentication** - Secure token-based authentication
- **Admin-only Access Control** - Role-based permissions
- **HTTPS Enforcement** - Security best practices
- **CSRF Protection** - Cross-site request forgery protection

### Development Tools

- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Commitlint** - Conventional commit messages

## 📁 Project Structure

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

## 🔌 API Integration

The CMS integrates with the Senda API for course and lesson management. Key endpoints include:

- **Courses**: CRUD operations for meditation courses
- **Lessons**: Lesson management within courses
- **Script Generation**: AI-powered content generation
- **Audio Generation**: Text-to-speech conversion

For detailed API documentation, start the Senda API project and fetch the OpenAPI spec at: `http://localhost:8000/api/openapi.json`

## 🔐 Authentication

The system uses JWT-based authentication with admin-only access control. All users must have administrative privileges to access the CMS.

### Key Features:

- Secure login with email/password
- Automatic session management
- Token refresh mechanism
- Cross-tab session synchronization
- Secure logout functionality

## 🎨 UI Components

Built with shadcn/ui components and customized with styled-components:

- Modern, accessible component library
- Consistent design system
- Responsive layouts
- Dark/light theme support
- Form components with validation

## 📊 Success Metrics

- **Performance**: < 2s page load time, < 1s average response time
- **Reliability**: > 99.9% system uptime
- **Security**: > 99% authentication success rate, zero security breaches
- **Content Quality**: > 95% script generation success rate

## 🚀 Deployment

The application is deployed on **Google Cloud Run** with automatic deployments from GitHub.

### Production URLs

- **CMS Application**: `https://senda-production-ofsz2twzra-uc.a.run.app`
- **Health Check**: `https://senda-production-ofsz2twzra-uc.a.run.app/api/health`

### Branch Strategy

- **Production**: `main` branch → automatic deployment
- **Preview**: Pull Requests → preview deployments
- **Development**: Local development with `bun dev`

### Environment Variables

See [`.env.production.example`](./.env.production.example) for all required variables.

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

## 📚 Documentation

- [Product Requirements Document](./docs/PRD.md) - Comprehensive project requirements
- [API Integration Guide](./docs/api-integration.md) - API implementation details
- [Project Checklist](./docs/project-checklist.md) - Development milestones

## 🤝 Contributing

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

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For technical support or questions:

- Create an issue in the repository
- Contact the development team
- Review the documentation in the `docs/` directory

---

Built with ❤️ using Next.js, TypeScript, and Bun.
