# Workflow Development Guide

## Overview

This template demonstrates how to build a reusable jshook MCP workflow.

## Key Features

- **TypeScript-first**: Full type safety with modern TypeScript
- **Declarative workflow definition**: Clear, composable workflow contracts
- **Built-in tool chain integration**: Leverage jshook's extensive tool ecosystem
- **Promise.all parallel reads**: Efficient batch operations for read-only tasks
- **Minimal permissions**: Security-first approach with least-privilege access

## Quick Start

```bash
# Install dependencies
pnpm install

# Type check
pnpm run check

# Build
pnpm run build
```

## Project Structure

```
.
├── workflow.ts          # Workflow entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── meta.yaml            # Extension metadata for registry
└── docs/
    └── SKILL.md         # This file - development guide
```

## Best Practices

### 1. Parallelize Reads, Not Writes

Good candidates for parallel execution:
- `extensions_list`
- `page_get_local_storage`
- `page_get_cookies`
- `network_get_requests`

Avoid parallelizing actions that mutate shared page state.

### 2. Let Main Agent Control Browser Session

Your workflow should not take control of the browser away from the main agent. Use sidecar analysis instead.

### 3. Use Subagents for Analysis

Recommended split:
- **Main agent**: Browser control, navigation, data collection
- **Subagent**: Endpoint classification, auth signal analysis, report drafting

## Example Workflow Patterns

### Pattern 1: Run Workflow, Then Delegate Analysis

```typescript
// Main agent
const result = await ctx.runExtensionWorkflow({
  workflowId: 'my-workflow',
  config: { target: 'https://example.com' }
});

// Subagent for analysis
const analysis = await subagent.analyze(result);
```

### Pattern 2: Main Agent Navigates, Subagent Reviews

```typescript
// Main agent
await ctx.pageNavigate('https://example.com');
await ctx.pageClick('#submit');
const requests = await ctx.networkGetRequests();

// Subagent
const report = await subagent.generateReport(requests);
```

## Registration

To register your workflow in the jshook MCP extension registry:

1. Ensure your repository has:
   - `meta.yaml` with name, description, author, tags
   - Public accessibility
   - Working `pnpm run check` and `pnpm run build`

2. Create an issue at [vmoranv/jshookmcpextension](https://github.com/vmoranv/jshookmcpextension/issues/new?template=register-extension.yml)

3. The sync workflow will automatically add your workflow to the registry on issue close

## Example Usage

```typescript
import { defineWorkflow } from '@jshook/sdk';

export default defineWorkflow({
  id: 'my-workflow.v1',
  name: 'My Workflow',
  description: 'A sample workflow',
  
  async execute(ctx) {
    // Your workflow logic here
    await ctx.pageNavigate('https://example.com');
    // ...
  },
});
```

## Resources

- [jshook Documentation](https://github.com/vmoranv/jshookmcp)
- [MCP Extension Registry](https://github.com/vmoranv/jshookmcpextension)
- [Example Workflows](https://github.com/vmoranv?tab=repositories&q=jshook_workflow_)
