# Vercel Deployment Architecture

This document describes the deployment architecture for Senda CMS on Vercel, including the automatic deployment workflows, GitHub integration, and preview environments.

## Deployment Architecture Overview

Senda CMS uses Vercel as its hosting platform, leveraging its seamless integration with GitHub for continuous deployment. The architecture follows a **Git-based deployment model** where code changes automatically trigger deployments.

```mermaid
flowchart TB
    subgraph GitHub["GitHub Repository"]
        main["main branch"]
        feature["feature/* branches"]
        pr["Pull Requests"]
    end

    subgraph Vercel["Vercel Platform"]
        build["Build System<br/>(Next.js 15 + Turbopack)"]
        prod["Production<br/>Environment"]
        preview["Preview<br/>Environments"]
    end

    subgraph CloudRun["Google Cloud Run"]
        api_prod["Senda API<br/>Production"]
        api_staging["Senda API<br/>Staging"]
    end

    subgraph Storage["AWS"]
        s3["S3<br/>(Media Storage)"]
    end

    main -->|"Push to main"| build
    feature -->|"Create PR"| pr
    pr -->|"Triggers"| build

    build -->|"Deploy"| prod
    build -->|"Deploy"| preview

    prod <-->|"API Calls"| api_prod
    preview <-->|"API Calls"| api_staging
    prod -->|"Fetch Audios & Images"| s3
    preview -->|"Fetch Audios & Images"| s3

    style prod fill:#10b981,color:#fff
    style preview fill:#6366f1,color:#fff
    style build fill:#f59e0b,color:#fff
    style api_prod fill:#10b981,color:#fff
    style api_staging fill:#6366f1,color:#fff
```

### Key Components

| Component                  | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| **GitHub Repository**      | Source of truth for all code. Triggers deployments on push/PR events.      |
| **Vercel Build System**    | Automatically detects Next.js, runs `next build`, and deploys the output.  |
| **Production Environment** | Live application deployed from `main` branch. Connected to Production API. |
| **Preview Environments**   | Temporary deployments for each Pull Request. Connected to Staging API.     |
| **Senda API (Production)** | Production backend API hosted on Google Cloud Run.                         |
| **Senda API (Staging)**    | Staging backend API for testing preview deployments.                       |
| **AWS S3**                 | Media storage for course images and audio files.                           |

## Automatic Deployment Flow

### Production Deployment

When code is merged to the `main` branch, Vercel automatically builds and deploys to the production environment.

```mermaid
sequenceDiagram
    autonumber
    participant Dev as Developer
    participant GH as GitHub
    participant V as Vercel
    participant Prod as Production

    Dev->>GH: Merge PR to main
    GH->>V: Webhook: push event
    V->>V: Clone repository
    V->>V: Install dependencies (bun install)
    V->>V: Build application (next build)
    V->>V: Run checks (typecheck, lint)

    alt Build Successful
        V->>Prod: Deploy to production URL
        V->>GH: Update commit status ✅
        Prod-->>Dev: Live at production URL
    else Build Failed
        V->>GH: Update commit status ❌
        V-->>Dev: Build failure notification
    end
```

### Production Deployment Details

| Step           | Action         | Details                                             |
| -------------- | -------------- | --------------------------------------------------- |
| **1. Trigger** | Push to `main` | Any merge or direct push triggers deployment        |
| **2. Clone**   | Fetch code     | Vercel clones the repository at the specific commit |
| **3. Install** | Dependencies   | Runs `bun install` (auto-detected from lockfile)    |
| **4. Build**   | Next.js build  | Executes `next build --turbopack`                   |
| **5. Deploy**  | Publish        | Deploys to production domain                        |
| **6. Status**  | GitHub check   | Updates commit status with deployment URL           |

## Preview Deployments

Preview deployments are the cornerstone of Vercel's collaborative workflow. Every Pull Request automatically receives its own deployment with a unique URL.

### Preview Deployment Flow

```mermaid
sequenceDiagram
    autonumber
    participant Dev as Developer
    participant GH as GitHub
    participant V as Vercel
    participant Preview as Preview Environment
    participant Reviewer as Code Reviewer

    Dev->>GH: Create Pull Request
    GH->>V: Webhook: pull_request event
    V->>V: Build preview deployment

    alt Build Successful
        V->>Preview: Deploy to unique preview URL
        V->>GH: Post comment with preview link
        V->>GH: Add deployment status check

        Reviewer->>GH: View PR
        GH-->>Reviewer: See preview link in comment
        Reviewer->>Preview: Click to test changes
        Preview-->>Reviewer: Live preview of PR changes

        Dev->>GH: Push additional commits
        GH->>V: Webhook: synchronize event
        V->>Preview: Update preview deployment
        V->>GH: Update comment with new deployment
    else Build Failed
        V->>GH: Post failure comment
        V->>GH: Block PR merge (optional)
    end
```

### Preview URL Structure

Preview deployments receive automatically generated URLs following this pattern:

```
https://<project>-<unique-hash>-<team>.vercel.app
```

**Example:**

```
https://senda-cms-abc123def-fariassdev.vercel.app
```

### GitHub Integration

Vercel automatically adds deployment information to Pull Requests:

```mermaid
flowchart LR
    subgraph PR["Pull Request View"]
        title["PR #42: Add lesson reordering"]
        checks["Status Checks"]
        comment["Vercel Bot Comment"]
        deploy["Deployment Status"]
    end

    subgraph Checks["Status Checks Detail"]
        build_check["✅ Vercel – Build Succeeded"]
        preview_check["✅ Vercel – Preview Ready"]
    end

    subgraph Comment["Bot Comment Content"]
        link["🔗 Preview: https://...vercel.app"]
        inspect["🔍 Inspect: Build logs link"]
        compare["📊 Compare: Bundle size changes"]
    end

    checks --> Checks
    comment --> Comment

    style build_check fill:#10b981,color:#fff
    style preview_check fill:#10b981,color:#fff
```

**What appears in the PR:**

1. **Status Checks**: Shows build status (success/failure)
2. **Deployment Comment**: Bot comment with:
   - Preview URL (clickable link to test the changes)
   - Inspect link (access to build logs)
   - Performance metrics (optional)
3. **Deployment Indicator**: GitHub's native deployment UI

## Environment Configuration

### Environment Variables by Deployment Type

Vercel allows configuring different environment variables for each deployment type:

```mermaid
flowchart TB
    subgraph Config["Environment Configuration"]
        vars["Environment Variables"]
    end

    subgraph Prod["Production"]
        prod_api["NEXT_PUBLIC_API_BASE_URL<br/>https://api.senda.com"]
        prod_build["NEXT_PUBLIC_BUILD<br/>production"]
        prod_jwt["JWT_SECRET<br/>***"]
    end

    subgraph Preview["Preview"]
        prev_api["NEXT_PUBLIC_API_BASE_URL<br/>https://staging-api.senda.com"]
        prev_build["NEXT_PUBLIC_BUILD<br/>preview"]
        prev_jwt["JWT_SECRET<br/>***"]
    end

    vars -->|"Production scope"| Prod
    vars -->|"Preview scope"| Preview

    style Prod fill:#10b981,color:#fff
    style Preview fill:#6366f1,color:#fff
```

### Variable Reference

| Variable                   | Production         | Preview                | Description            |
| -------------------------- | ------------------ | ---------------------- | ---------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Production API URL | Staging API URL        | Backend API endpoint   |
| `NEXT_PUBLIC_BUILD`        | `production`       | `preview`              | Environment identifier |
| `JWT_SECRET`               | Production secret  | Same or staging secret | JWT validation secret  |

## Branch Protection and Deployment Rules

### Recommended Branch Strategy

```mermaid
gitgraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Feature work"
    branch "feature/lesson-audio"
    checkout "feature/lesson-audio"
    commit id: "Add audio"
    commit id: "Fix controls"
    checkout develop
    merge "feature/lesson-audio" tag: "Preview"
    checkout main
    merge develop tag: "v0.2.0"
    checkout develop
    branch "feature/export"
    commit id: "Export"
    checkout develop
    merge "feature/export" tag: "Preview"
```

### Deployment Rules

| Branch Pattern | Deployment Type | Environment | Auto-Deploy     |
| -------------- | --------------- | ----------- | --------------- |
| `main`         | Production      | Production  | ✅ Yes          |
| `develop`      | Preview         | Preview     | ✅ Yes          |
| `feature/*`    | Preview         | Preview     | ✅ Yes (via PR) |
| `hotfix/*`     | Preview         | Preview     | ✅ Yes (via PR) |

## Monitoring and Observability

### Deployment Status Flow

```mermaid
stateDiagram-v2
    [*] --> Queued: Push/PR created
    Queued --> Building: Build starts
    Building --> Deploying: Build success
    Building --> Failed: Build error
    Deploying --> Ready: Deployment complete
    Deploying --> Failed: Deploy error
    Ready --> [*]: Live
    Failed --> [*]: Requires fix

    note right of Building
        - Install dependencies
        - Run next build
        - Type checking
        - Linting
    end note

    note right of Ready
        - Preview URL active
        - GitHub status updated
        - Comment posted
    end note
```

### Accessing Deployment Information

| Information               | Where to Find                                       |
| ------------------------- | --------------------------------------------------- |
| **Build Logs**            | Vercel Dashboard → Deployments → Select deployment  |
| **Preview URL**           | GitHub PR comment or Vercel Dashboard               |
| **Production URL**        | Vercel Dashboard → Domains                          |
| **Environment Variables** | Vercel Dashboard → Settings → Environment Variables |
| **Deployment History**    | Vercel Dashboard → Deployments                      |

## Quick Reference

### Common Scenarios

| Scenario                | Action                               | Result                               |
| ----------------------- | ------------------------------------ | ------------------------------------ |
| New feature development | Create PR from feature branch        | Preview deployment created           |
| Code review             | Click preview link in PR             | Test changes in isolated environment |
| Bug fix                 | Push commit to PR                    | Preview auto-updates                 |
| Release to production   | Merge PR to main                     | Production deployment                |
| Rollback                | Vercel Dashboard → Redeploy previous | Instant rollback                     |

### Useful Commands

```bash
# Test production build locally
bun run build
bun start

# Type check before pushing
bun typecheck

# Lint code
bun lint
```

---

**Last Updated:** 2025-12-20
**Author:** Technical Documentation
