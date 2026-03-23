@AGENTS.md

# Claude Code Instructions

## Task Management - CRITICAL

**ALWAYS use GWD Cody MCP tools for task tracking. NEVER use Claude Code's built-in task tools (TaskCreate, TaskUpdate, etc.).**

See `~/Documents/GitHub/CLAUDE.md` for detailed examples and best practices.

## GWD Project Identity

| Field | Value |
|-------|-------|
| **Project ID** | `6` |
| **Client Filter** | `gwd` |
| **Project Name** | Bugsy |

## Team Standards

**At session start, pull latest standards:**
```bash
git submodule update --remote .claude-standards
```

## Git Commit Rules

- **Do NOT include "Co-Authored-By" lines in commit messages**
- Write clear, concise commit messages describing the change

## Project Overview

**Bugsy** is a standalone, chat-based bug and feature request resolution system. End users report issues through an embeddable widget, AI triages conversationally, and AI-assisted developers resolve requests via MCP tools.

**Tech Stack:**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **Auth:** NextAuth (dashboard), API tokens (developers/MCP)
- **MCP:** @modelcontextprotocol/sdk

## Architecture

### Single-tenant, per-project deployment
Each Bugsy instance serves one project. No multi-tenant complexity.

### Key Components
1. **Widget** (`src/widget/`) - Embeddable chat widget (built as standalone IIFE)
2. **Dashboard** (`src/app/`) - Admin panel for managing requests, users, approvals
3. **API** (`src/app/api/`) - REST endpoints for widget, dashboard, and MCP
4. **MCP Server** (`mcp/`) - Tools for AI developers to pull/resolve requests

### User Roles
- **End Users** - Interact via embedded widget (no account needed)
- **Admins** - Manage requests, users, approval settings via dashboard
- **Developers** - Get API tokens, connect via MCP to resolve requests

### Approval System
- **Auto-approve users** - Changes go through immediately
- **Standard users** - Admin or developer must approve before changes are applied

## Development Commands

```bash
npm install
npm run dev
npx prisma migrate dev
npx prisma generate
node mcp/index.js
```
