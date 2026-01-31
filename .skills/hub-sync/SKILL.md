---
name: hub-sync
description: Sync project updates to FiL Hub portfolio. Use when user says "update the hub", "sync to hub", "update fil hub", or wants to push project changes (status, links, access codes, descriptions) to their portfolio site. Triggers from any project conversation to update the central projects.config.ts.
---

# Hub Sync

Sync project information from the current working project to FiL Hub portfolio.

## Config Location

The projects config is at: `/sessions/youthful-clever-noether/mnt/FiL-Hub/src/config/projects.config.ts`

If the FiL-Hub folder is not mounted, ask the user to select it.

## Workflow

1. **Identify the current project** - Determine which project is being worked on from context
2. **Match to hub config** - Find the project by `id` in `projectsConfig` array
3. **Determine what changed** - Ask user or infer from conversation what needs updating
4. **Update the config** - Edit only the changed fields
5. **Confirm changes** - Show what was updated

## Updatable Fields

| Field | Type | Example |
|-------|------|---------|
| `status` | `'active' \| 'beta' \| 'in-development' \| 'paused' \| 'unreleased'` | `status: 'active'` |
| `accessCode` | `string` | `accessCode: 'DEMO123'` |
| `links.live` | `string` | `live: 'https://app.vercel.app'` |
| `links.github` | `string` | `github: 'https://github.com/user/repo'` |
| `description` | `string` | Short tagline |
| `longDescription` | `string` | Detailed description |
| `technologies` | `string[]` | `['React', 'TypeScript']` |
| `featured` | `boolean` | Show on homepage |
| `visible` | `boolean` | Show anywhere |
| `order` | `number` | Sort order (1 = first) |

## Project IDs Reference

Quick lookup for matching projects:

- `rf-scout` - RF Scout
- `setflow` - SetFlow
- `filmore-advance-portal` - Filmore Advance Portal
- `tour-advance-portal` - Tour Advance Portal
- `filmore-gear` - Filmore Gear Inventory
- `filmore-1sheet` - Filmore 1-Sheet
- `tour-flow-app` - Tour Flow App
- `filmore-bio` - Filmore Bio
- `yeehaw` - YEEHAW

## Example Usage

User working on SetFlow says: "update the hub - status is now active"

1. Read projects.config.ts
2. Find `id: 'setflow'`
3. Change `status: 'beta'` to `status: 'active'`
4. Confirm: "Updated SetFlow status to 'active' in FiL Hub"

## After Updates

Offer to provide a git summary for the changes.
