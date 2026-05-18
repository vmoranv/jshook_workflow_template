import {
  defineWorkflow,
  sequenceStep,
  type WorkflowExecutionContext,
} from '@jshookmcp/extension-sdk/workflow';

const workflowId = 'workflow.template-capture.v1';

export default defineWorkflow(workflowId, 'Template Capture Workflow', (workflow) =>
  workflow
    .description(
      'Enable network capture, navigate to a target page, collect browser state in parallel, extract auth material, and emit a summary object.',
    )
    .tags(['workflow', 'template', 'parallel', 'capture'])
    .timeoutMs(10 * 60_000)
    .defaultMaxConcurrency(4)
    .buildGraph((ctx: WorkflowExecutionContext) => {
      const prefix = 'workflows.templateCapture';
      const url = String(ctx.getConfig(`${prefix}.url`, 'https://example.com'));
      const waitUntil = String(ctx.getConfig(`${prefix}.waitUntil`, 'networkidle'));
      const requestTail = Number(ctx.getConfig(`${prefix}.requestTail`, 20));
      const maxConcurrency = Number(ctx.getConfig(`${prefix}.parallel.maxConcurrency`, 4));
      const collectConsoleLogs = Boolean(ctx.getConfig(`${prefix}.collectConsoleLogs`, true));
      const logLimit = Number(ctx.getConfig(`${prefix}.consoleLogLimit`, 50));

      return sequenceStep('template-capture-root', (root) => {
        root.tool('enable-network', 'network_enable', {
          input: { enableExceptions: true },
        });
        root.tool('navigate', 'page_navigate', {
          input: { url, waitUntil },
        });
        root.parallel('collect-surface', (parallel) => {
          parallel
            .maxConcurrency(maxConcurrency)
            .failFast(false)
            .tool('collect-local-storage', 'page_local_storage', {
              input: { action: 'get' },
            })
            .tool('collect-cookies', 'page_cookies', {
              input: { action: 'get' },
            })
            .tool('collect-requests', 'network_get_requests', {
              input: { tail: requestTail },
            })
            .tool('collect-links', 'page_get_all_links');

          if (collectConsoleLogs) {
            parallel.tool('collect-console-logs', 'console_get_logs', {
              input: { limit: logLimit },
            });
          }
        });
        root.tool('extract-auth', 'network_extract_auth');
        root.tool('emit-summary', 'console_execute', {
          input: {
            expression: `(${JSON.stringify({
              status: 'template_capture_complete',
              workflowId,
              url,
              waitUntil,
              requestTail,
              maxConcurrency,
              collectConsoleLogs,
            })})`,
          },
        });
      });
    })
    .onStart((ctx) => {
      ctx.emitMetric('workflow_runs_total', 1, 'counter', { workflowId, stage: 'start' });
    })
    .onFinish((ctx) => {
      ctx.emitMetric('workflow_runs_total', 1, 'counter', { workflowId, stage: 'finish' });
    })
    .onError((ctx, error) => {
      ctx.emitMetric('workflow_errors_total', 1, 'counter', {
        workflowId,
        stage: 'error',
        error: error.name,
      });
    }),
);
