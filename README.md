# jshook_workflow_template

Template repository for building a reusable `jshook` workflow with a minimal MVP.

This template focuses on one thing:

- codify an existing built-in tool chain into a reusable workflow contract

## Included in the template

- `workflow.js`: workflow entrypoint
- `docs/agent-recipes.md`: recipes for orchestration, parallel reads, and subagent-assisted analysis

## What the MVP workflow demonstrates

The sample workflow runs this shape:

1. `network_enable`
2. `page_navigate`
3. parallel surface collection
   - `page_get_local_storage`
   - `page_get_cookies`
   - `network_get_requests`
   - `page_get_all_links`
   - optional `console_get_logs`
4. `network_extract_auth`
5. `console_execute` summary output

It demonstrates:

- `sequenceNode`
- `parallelNode`
- safe parallel collection for read-only steps
- a good baseline for reverse / API reconnaissance flows

## Dependency model

This template now uses the published npm package:

```json
{
  "@jshookmcp/extension-sdk": "^0.1.2"
}
```

That means the template can be cloned independently and installed directly with `pnpm install`.

## Install

```bash
pnpm install
pnpm run check
```

## Load the workflow into jshook

Set:

```bash
MCP_WORKFLOW_ROOTS=<path-to-cloned-jshook_workflow_template>
```

Then run inside `jshook`:

1. `extensions_reload`
2. `extensions_list`
3. `list_extension_workflows`
4. `run_extension_workflow`

## Configuration prefix

The template uses:

```text
workflows.templateCapture.*
```

Rename that prefix early when adapting the template for real use.

## Git hygiene

Keep this repo focused on source and docs.
Do not commit:

- `node_modules/`
- `.env`
- runtime artifacts
- screenshots
- local sessions
- host-specific temp output

## What to change first

1. replace `workflowId` and `displayName`
2. rename the config prefix
3. keep state-mutating steps serialized
4. keep read-only collection steps parallel where safe
5. validate the workflow through `extensions_reload` and `list_extension_workflows`
