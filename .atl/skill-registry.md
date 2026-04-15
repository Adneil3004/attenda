# Attenda Skill Registry

**Project**: attenda  
**Generated**: 2026-04-13

## User-Level Skills (from ~/.config/opencode/skills/)

Found in `~/.config/opencode/skills/` (user-level):

| ID | Name | Trigger |
|----|------|--------|
| sdd-init | Spec-Driven Development init | "sdd init", "iniciar sdd" |
| sdd-explore | Explore and investigate | /sdd-explore |
| sdd-propose | Create change proposal | /sdd-new |
| sdd-spec | Write specifications | /sdd-spec |
| sdd-design | Technical design | /sdd-design |
| sdd-tasks | Task breakdown | /sdd-tasks |
| sdd-apply | Implement tasks | /sdd-apply |
| sdd-verify | Verify implementation | /sdd-verify |
| sdd-archive | Archive change | /sdd-archive |
| sdd-onboard | SDD walkthrough | /sdd-onboard |
| go-testing | Go testing patterns | Go tests, Bubbletea |
| judgment-day | Adversarial review | "judgment day", "review adversarial" |
| branch-pr | PR creation | PR creation |
| issue-creation | Issue creation | Bug report, feature request |
| skill-registry | Registry update | "update skills" |
| skill-creator | Create new skill | "create skill" |

## Project Conventions

Found in project root:

- `.agent/AGENTS.md` — Agent orchestration hub (Engram pattern)
- `.agent/rules.md` — Agent rules and standards
- `.agent/skills_index.md` — Skills index
- `.agent/roles/` — Role-based tasks

## Project Standards

### Trigger-Based Skills (from .agent/AGENTS.md)

| Trigger | Skill | Purpose |
|---------|-------|---------|
| Session start | agent_bootstrap.md | Prepare Managin role |
| Backend modification | backend-architecture.md | Clean Architecture |
| UI design | ui-concierge.md | Concierge aesthetics |
| Task completion | agent_logs.md | Report to Director |

### Compact Rules

**Frontend (React)**:
- All visible text: **ENGLISH**
- Use internal API for data (not Supabase directly)
- Premium aesthetics: glassmorphism, smooth animations

**Backend (.NET)**:
- Clean Architecture + MediatR (CQRS)
- Entity Framework Core + PostgreSQL

**Testing**:
- Backend: xUnit + NSubstitute
- No TDD in frontend (no test runner)

---

*This registry is mode-independent infrastructure. Re-generate with `skill-registry` skill when skills change.*