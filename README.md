# jshook Workflow Template

A TypeScript-first template for building jshook MCP workflows with the current
workflow builder API.

This template consumes the published `@jshookmcp/extension-sdk` package. Do not
switch it to `workspace:`, `link:`, or `file:` dependencies.

## What's Included

- `workflow.ts` - Workflow definition
- `meta.yaml` - Extension metadata for registry
- `.gitignore` - Standard ignores for jshook projects

## Quick Start

```bash
pnpm install
pnpm build
pnpm check
```

## Files Explained

| File | Purpose |
|------|---------|
| `workflow.ts` | Workflow contract built with `defineWorkflow()` |
| `package.json` | Current SDK/runtime dependencies |
| `tsconfig.json` | TypeScript configuration |
| `meta.yaml` | Registry metadata (name, description, author, tags) |

## Local Testing

PowerShell:

```powershell
$env:MCP_WORKFLOW_ROOTS = (Get-Location).Path
# In jshook: extensions_reload, then list_extension_workflows
```

macOS / Linux:

```bash
export MCP_WORKFLOW_ROOTS=$(pwd)
# In jshook: extensions_reload, then list_extension_workflows
```

You can also point `MCP_WORKFLOW_ROOTS` at a parent directory containing
multiple workflow folders separated by commas.

## Publishing

1. Push to GitHub (public repo)
2. Keep `@jshookmcp/extension-sdk` on a published semver range
3. Ensure `meta.yaml` exists with valid metadata
4. Create issue at vmoranv/jshookmcpextension (see docs/SKILL.md for agent usage)

## Notes

- Keep `workflow.ts` as the authoritative source entrypoint.
- Build before `extensions_reload` so the core can prefer `dist/workflow.js`.
- Use `sequenceStep()` for state-changing nodes and `parallelStep()` only for
  read-only collection branches.

## See Also

- [docs/SKILL.md](docs/SKILL.md) - Agent usage documentation
- [jshookmcp](https://github.com/vmoranv/jshookmcp) - Main repository
- [Extension Registry](https://github.com/vmoranv/jshookmcpextension) - Registry issues
