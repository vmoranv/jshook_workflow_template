# jshook Workflow Template - Agent Skill Documentation

## For Agents Using This Template

This template provides a reusable workflow scaffold for jshook MCP.

## Workflow ID

```
workflow.template-capture.v1
```

## Available Configuration

```yaml
workflows.templateCapture.*
```

## Input Parameters

```typescript
{
  url?: string,                 // Target URL to analyze
  waitUntil?: string,           // page_navigate waitUntil mode
  requestTail?: number,         // network_get_requests tail size
  collectConsoleLogs?: boolean, // Whether to capture console logs
}
```

## Output Structure

```typescript
{
  status: string,
  workflowId: string,
  url: string,
  waitUntil: string,
  requestTail: number,
  maxConcurrency: number,
  collectConsoleLogs: boolean
}
```

## SDK Functions Used

```typescript
import { defineWorkflow, sequenceStep } from '@jshookmcp/extension-sdk/workflow';

export default defineWorkflow('workflow.template-capture.v1', 'Template Capture Workflow', (workflow) =>
  workflow.buildGraph(() =>
    sequenceStep('capture-root', (root) => {
      root.tool('enable-network', 'network_enable');
      root.tool('navigate', 'page_navigate', {
        input: { url: 'https://example.com', waitUntil: 'networkidle' },
      });
    }),
  ),
);
```

## Parallel Read Pattern

Safe to parallelize (Promise.all):
- `page_local_storage`
- `page_cookies`
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
4. Run: `run_extension_workflow --workflow-id workflow.template-capture.v1`

## Example Invocation

```
run_extension_workflow 
  --workflow-id workflow.template-capture.v1 
  --config '{"workflows.templateCapture.url":"https://example.com","workflows.templateCapture.collectConsoleLogs":true}'
```
*** Add File: D:\coding\reverse\jshook_workflow_template\.github\workflows\ci.yml
name: CI

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]

permissions:
  contents: read

jobs:
  cross-platform:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [22]

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v5

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: ${{ matrix.node-version }}
          registry-url: https://registry.npmjs.org
          package-manager-cache: false

      - name: Enable Corepack pnpm
        run: |
          corepack enable
          corepack prepare pnpm@10.33.0 --activate

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> "$GITHUB_ENV"

      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Typecheck
        run: pnpm run check

      - name: Build
        run: pnpm run build
