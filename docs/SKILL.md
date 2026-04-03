# jshook Workflow Template - Agent Skill Documentation

## For Agents Using This Template

This template provides a reusable workflow scaffold for jshook MCP.

## Workflow ID

```
workflow.template.v1
```

## Available Configuration

```yaml
workflows.template.*
```

## Input Parameters

```typescript
{
  targetUrl?: string,      // Target URL to analyze (default: current page)
  collectAuth?: boolean,   // Extract auth credentials (default: true)
  collectLinks?: boolean,  // Collect page links (default: true)
}
```

## Output Structure

```typescript
{
  url: string,             // Analyzed URL
  timestamp: string,       // Analysis timestamp
  auth: {                  // Extracted auth (if collectAuth=true)
    tokens: array,
    cookies: array,
    headers: array
  },
  links: array,            // Page links (if collectLinks=true)
  localStorage: object,    // LocalStorage contents
  requests: array          // Network requests captured
}
```

## SDK Functions Used

```typescript
import { defineWorkflow } from '@jshookmcp/extension-sdk';

export default defineWorkflow({
  id: 'workflow.template.v1',
  name: 'Template Workflow',
  description: 'A sample workflow',
  
  async execute(ctx, config) {
    // Step 1: Enable network monitoring
    await ctx.network_enable();
    
    // Step 2: Navigate
    await ctx.page_navigate(config.targetUrl);
    
    // Step 3: Parallel collection
    const [storage, cookies, requests] = await Promise.all([
      ctx.page_get_local_storage(),
      ctx.page_get_cookies(),
      ctx.network_get_requests()
    ]);
    
    // Step 4: Extract auth
    const auth = await ctx.network_extract_auth();
    
    return { storage, cookies, requests, auth };
  },
});
```

## Parallel Read Pattern

Safe to parallelize (Promise.all):
- `page_get_local_storage`
- `page_get_cookies`
- `network_get_requests`
- `page_get_all_links`

Do NOT parallelize:
- `page_click` + `page_type` (state mutations)
- Multiple `page_navigate` calls

## Build & Verify

```bash
pnpm install
pnpm run build   # Outputs dist/workflow.js
pnpm run check   # TypeScript type check
```

## Load Into jshook

1. Set env: `MCP_WORKFLOW_ROOTS=/path/to/template`
2. In jshook: `extensions_reload`
3. Verify: `list_extension_workflows` shows the workflow
4. Run: `run_extension_workflow --workflow-id workflow.template.v1`

## Example Invocation

```
run_extension_workflow 
  --workflow-id workflow.template.v1 
  --config '{"targetUrl":"https://example.com","collectAuth":true}'
```
