# jshook Workflow Template

A minimal template for building jshook MCP workflows.

## What's Included

- `workflow.ts` - Workflow definition
- `meta.yaml` - Extension metadata for registry
- `.gitignore` - Standard ignores for jshook projects

## Quick Start

```bash
pnpm install
pnpm run build
pnpm run check
```

## Files Explained

| File | Purpose |
|------|---------|
| `workflow.ts` | Workflow implementation |
| `package.json` | Dependencies (uses @jshookmcp/extension-sdk) |
| `tsconfig.json` | TypeScript configuration |
| `meta.yaml` | Registry metadata (name, description, author, tags) |

## Local Testing

```bash
export MCP_WORKFLOW_ROOTS=$(pwd)
# In jshook: extensions_reload, then list_extension_workflows
```

## Publishing

1. Push to GitHub (public repo)
2. Ensure `meta.yaml` exists with valid metadata
3. Create issue at vmoranv/jshookmcpextension (see docs/SKILL.md for agent usage)

## See Also

- [docs/SKILL.md](docs/SKILL.md) - Agent usage documentation
- [jshookmcp](https://github.com/vmoranv/jshookmcp) - Main repository
- [Extension Registry](https://github.com/vmoranv/jshookmcpextension) - Registry issues
