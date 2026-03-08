import { parallelNode, sequenceNode, toolNode } from '@jshookmcp/extension-sdk/workflow';

/** @typedef {import('@jshookmcp/extension-sdk/workflow').WorkflowContract} WorkflowContract */
/** @typedef {import('@jshookmcp/extension-sdk/workflow').WorkflowNode} WorkflowNode */

const workflowId = 'workflow.template-capture.v1';

/** @type {WorkflowContract} */
const templateCaptureWorkflow = {
  kind: 'workflow-contract',
  version: 1,
  id: workflowId,
  displayName: 'Template Capture Workflow',
  description:
    'Minimal MVP workflow that enables network capture, navigates to a page, collects surface data in parallel, extracts auth, and emits a summary.',
  tags: ['workflow', 'template', 'parallel', 'capture'],
  timeoutMs: 10 * 60_000,
  defaultMaxConcurrency: 4,

  build(ctx) {
    const prefix = 'workflows.templateCapture';
    const url = String(ctx.getConfig(`${prefix}.url`, 'https://example.com'));
    const waitUntil = String(ctx.getConfig(`${prefix}.waitUntil`, 'domcontentloaded'));
    const requestTail = Number(ctx.getConfig(`${prefix}.requestTail`, 20));
    const maxConcurrency = Number(ctx.getConfig(`${prefix}.parallel.maxConcurrency`, 4));
    const collectConsoleLogs = Boolean(ctx.getConfig(`${prefix}.collectConsoleLogs`, true));
    const logLimit = Number(ctx.getConfig(`${prefix}.consoleLogLimit`, 50));

    /** @type {WorkflowNode[]} */
    const collectSteps = [
      toolNode('collect-local-storage', 'page_get_local_storage'),
      toolNode('collect-cookies', 'page_get_cookies'),
      toolNode('collect-requests', 'network_get_requests', {
        input: { tail: requestTail },
      }),
      toolNode('collect-links', 'page_get_all_links'),
    ];

    if (collectConsoleLogs) {
      collectSteps.push(
        toolNode('collect-console-logs', 'console_get_logs', {
          input: { limit: logLimit },
        }),
      );
    }

    const summary = {
      status: 'template_capture_complete',
      workflowId,
      url,
      waitUntil,
      requestTail,
      maxConcurrency,
      collectConsoleLogs,
    };

    return sequenceNode('template-capture-root', [
      toolNode('enable-network', 'network_enable', {
        input: { enableExceptions: true },
      }),
      toolNode('navigate', 'page_navigate', {
        input: { url, waitUntil },
      }),
      parallelNode('collect-surface', collectSteps, maxConcurrency, false),
      toolNode('extract-auth', 'network_extract_auth', {
        input: { minConfidence: 0.4 },
      }),
      toolNode('emit-summary', 'console_execute', {
        input: {
          expression: `(${JSON.stringify(summary)})`,
        },
      }),
    ]);
  },

  onStart(ctx) {
    ctx.emitMetric('workflow_runs_total', 1, 'counter', {
      workflowId,
      stage: 'start',
    });
  },

  onFinish(ctx) {
    ctx.emitMetric('workflow_runs_total', 1, 'counter', {
      workflowId,
      stage: 'finish',
    });
  },

  onError(ctx, error) {
    ctx.emitMetric('workflow_errors_total', 1, 'counter', {
      workflowId,
      stage: 'error',
      error: error.name,
    });
  },
};

export default templateCaptureWorkflow;

