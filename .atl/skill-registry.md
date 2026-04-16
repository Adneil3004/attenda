# 🦾 Attenda Skill Registry

This registry maps file extensions and code contexts to specific project standards and skills.

## Compact Rules

### Backend Standards (backend/**/*.cs)
- Follow **Clean Architecture** and **CQRS** patterns with MediatR.
- Use `Result` pattern for Application Commands to handle success/failure explicitly.
- **Domain Integrity**: Use Value Objects for validated properties; ensure entities are always in a valid state.
- **Event Sourcing**: Use `Domain.Aggregates.EventAggregate` for the primary event source logic.
- Documentation: [ARCHITECTURE.md](file:///Volumes/DHstorage/source/attenda/docs/ARCHITECTURE.md), [DOMAIN_MODELS.md](file:///Volumes/DHstorage/source/attenda/docs/DOMAIN_MODELS.md).

### UI Standards (frontend/**/*.jsx, frontend/**/*.css)
- **Concierge UI**: Vibrant colors, premium dark mode (high contrast), and fluid animations.
- **Micro-interactions**: Use `framer-motion` for all transitions and hover effects.
- **Data Ops**: Use the internal `apiClient` for all data operations; direct Supabase calls are ONLY for auth.
- Documentation: [AESTHETICS.md](file:///Volumes/DHstorage/source/attenda/docs/AESTHETICS.md), [FRONTEND_GUIDE.md](file:///Volumes/DHstorage/source/attenda/docs/FRONTEND_GUIDE.md).

## SDD Skills (Spec-Driven Development)

| Trigger | Skill | Purpose |
|:--------|:------|:--------|
| `sdd-init` | **sdd-init** | Initialize SDD context in project |
| `sdd-explore` | **sdd-explore** | Investigate codebase before committing to change |
| `sdd-propose` | **sdd-propose** | Create change proposals with intent and scope |
| `sdd-spec` | **sdd-spec** | Write detailed specifications with scenarios |
| `sdd-design` | **sdd-design** | Create technical design documents |
| `sdd-tasks` | **sdd-tasks** | Break down specs into implementation tasks |
| `sdd-apply` | **sdd-apply** | Implement tasks from SDD phase |
| `sdd-verify` | **sdd-verify** | Validate implementation against specs |
| `sdd-archive` | **sdd-archive** | Archive completed changes |

## User Skills

| Skill | Matcher | Purpose |
|:------|:--------|:--------|
| **dotnet-backend** | **code**: `backend/src/**/*.cs` | Clean Architecture & .NET Core services. |
| **react-patterns** | **code**: `frontend/src/**/*.jsx` | Modern React patterns and best practices. |
| **ui-concierge** | **task**: `ui-design` | Premium design and interactive refinement. |

## Project Rulesets

| File | Type | Purpose |
|:-----|:-----|:--------|
| **docs/ARCHITECTURE.md** | **context** | Global architectural blueprints. |
| **openspec/config.yaml** | **config** | SDD configuration and testing capabilities. |

## Testing Stack

| Layer | Tool | Command |
|:------|:-----|:--------|
| Unit (Backend) | xUnit + NSubstitute | `dotnet test` |
| Coverage | Coverlet | `dotnet test /p:CollectCoverage=true` |
| Frontend Lint | ESLint | `npm run lint` |
| Type Check | TypeScript | `npx tsc --noEmit` |
| Format | .NET Format | `dotnet format` |
