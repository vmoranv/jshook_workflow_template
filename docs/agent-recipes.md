# Agent Recipes for `jshook_workflow_template`

## 总原则

- **并行适合读，不适合改状态**。
- **subagent 适合作为侧车分析**。
- 主 agent 保持对浏览器、登录态、验证码与顺序动作的控制权。

## Recipe 1：主 agent 跑 workflow，subagent 写报告

适合场景：你已经通过 `run_extension_workflow` 跑完模板工作流，拿到了请求列表、认证线索、控制台日志。

推荐分工：

- 主 agent：
  - `run_extension_workflow`
  - 必要时补充 `network_get_response_body`
- subagent：
  - 整理 endpoint 清单
  - 生成报告草稿
  - 对请求分类（auth / data / admin / upload）

## Recipe 2：主 agent 导航，subagent 做 bundle / 请求侧车分析

适合场景：页面状态复杂，不想把浏览器交给旁路 agent。

推荐分工：

- 主 agent：
  - `page_navigate`
  - `page_click`
  - `network_get_requests`
- subagent：
  - 把请求整理成表格
  - 标出疑似 auth header / jwt / signature 参数
  - 撰写下一轮探测建议

## Recipe 3：什么时候用 `multi_tool_use.parallel`

推荐并行：

- `extensions_list`
- `search_tools`
- `page_get_local_storage`
- `page_get_cookies`
- `console_get_logs`

不推荐并行：

- `page_click` + `page_type`
- 登录操作 + 二次验证
- 会触发跳转的多个动作

原因：这些动作依赖同一页面状态，互相抢占时序，容易让工作流变得不稳定。

