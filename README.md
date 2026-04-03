# jshook Workflow Template

TypeScript-first template for building reusable jshook MCP workflows.

## What This Template Provides

- **Declarative Workflow Definition**: Clear, composable workflow contracts
- **Built-in Tool Chain Integration**: Leverage jshook's extensive tool ecosystem
- **Parallel Read Pattern**: Safe `Promise.all` pattern for read-only operations
- **Minimal Permissions**: Security-first with least-privilege defaults
- **Complete Development Chain**: From scaffolding to registry publication

## Quick Start

### 1. Scaffold Your Workflow

```bash
# Clone this template
git clone https://github.com/vmoranv/jshook_workflow_template.git my-workflow
cd my-workflow

# Install dependencies
pnpm install

# Type check
pnpm run check

# Build
pnpm run build
```

### 2. Customize Your Workflow

1. **Update identity** in `workflow.ts`:
   - Replace `workflowId`, `displayName`, `description`
   - Update config prefix

2. **Implement your workflow logic**:
   - Remove sample steps
   - Add your own tool calls and logic

3. **Keep state mutations serialized**:
   - Parallel reads are safe (`Promise.all`)
   - Serialize actions that mutate page state

4. **Add configuration validation**

### 3. Add Documentation

Create `docs/SKILL.md` with:
- Usage examples
- Configuration options
- SDK feature documentation
- Debugging tips

### 4. Create meta.yaml

```yaml
name: my-workflow
description: A brief description of what your workflow does
author: your-github-username
tags:
  - category1
  - category2
```

### 5. Test Locally

```bash
# Set workflow root
export MCP_WORKFLOW_ROOTS=$(pwd)

# In jshook session:
# 1. extensions_reload
# 2. list_extension_workflows
# 3. run_extension_workflow --workflow-id <your-workflow-id>
```

### 6. Debug Your Workflow

Useful debugging commands in jshook:

```
# List available workflows
list_extension_workflows

# Run a workflow
run_extension_workflow --workflow-id my-workflow.v1

# Check workflow execution status
extensions_list

# View captured artifacts (if any)
network_get_requests
console_get_logs
```

### 7. Publish to Registry

1. **Push to GitHub**: Make your repository public

2. **Ensure requirements**:
   - [ ] `meta.yaml` in root directory
   - [ ] `pnpm run check` passes
   - [ ] `pnpm run build` succeeds
   - [ ] `docs/SKILL.md` with usage docs (recommended)

3. **Create registration issue** at [vmoranv/jshookmcpextension](https://github.com/vmoranv/jshookmcpextension/issues/new?template=register-extension.yml):
   ```
   Kind: workflow
   Repository URL: https://github.com/your-username/my-workflow
   ```

4. **Sync happens automatically**:
   - On issue close
   - Daily scheduled workflow
   - Or manual workflow trigger

## Project Structure

```
.
├── workflow.ts          # Workflow entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── meta.yaml            # Extension metadata for registry
├── .env.example         # Local configuration sample
├── .gitignore           # Git ignore rules
└── docs/
    └── SKILL.md         # Usage documentation and SDK reference
```

## Built-in Example Pattern

The template demonstrates this workflow shape:

1. `network_enable` - Enable network monitoring
2. `page_navigate` - Navigate to target URL
3. Parallel surface collection:
   - `page_get_local_storage`
   - `page_get_cookies`
   - `network_get_requests`
   - `page_get_all_links`
4. `network_extract_auth` - Extract auth credentials
5. Output summary

**Replace these** with your own workflow logic.

## SDK Features

This template uses the official jshook extension SDK:

```json
{
  "@jshookmcp/extension-sdk": "^0.1.3"
}
```

Key SDK features:
- `defineWorkflow()`: Simplified workflow definition
- Tool invocation API
- Configuration management
- Lifecycle hooks

For full SDK documentation, see the [jshookmcp documentation](https://github.com/vmoranv/jshookmcp).

## Git Hygiene

This repo focuses on source and docs. Do NOT commit:

- `dist/` - Build output
- `node_modules/` - Dependencies
- `.env` - Environment files
- Runtime artifacts
- Screenshots
- Local sessions

## Load Behavior

jshook discovers both `workflow.ts` and `dist/workflow.js`, but prefers the generated JavaScript when both exist.

Recommended workflow:
1. Edit `workflow.ts`
2. Run `pnpm run build`
3. jshook loads `dist/workflow.js`

## Configuration Prefix

The template uses:

```text
workflows.templateCapture.*
```

Rename this prefix early when adapting for real use to avoid conflicts.

## Best Practices

### Parallelize Reads, Not Writes

Safe for parallel execution:
- `page_get_local_storage`
- `page_get_cookies`
- `network_get_requests`
- `page_get_all_links`
- `console_get_logs`

Serialize these operations:
- `page_click`
- `page_type`
- Any action that mutates page state

### Let Main Agent Control Browser

Your workflow should not take control of the browser away from the main agent. Use sidecar analysis instead.

### Use Subagents for Analysis

Recommended split:
- **Main agent**: Browser control, navigation, data collection
- **Subagent**: Endpoint classification, auth signal analysis, report drafting

## Resources

- [jshook Main Repo](https://github.com/vmoranv/jshookmcp)
- [Extension Registry](https://github.com/vmoranv/jshookmcpextension)
- [Example Plugins](https://github.com/vmoranv?tab=repositories&q=jshook_plugin_)
- [Example Workflows](https://github.com/vmoranv?tab=repositories&q=jshook_workflow_)
