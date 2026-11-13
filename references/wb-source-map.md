# 原 WB 项目的维护定位

仅在用户要维护原 Wisdom Bread 办公室时读取。工作区查找 `work/wb-ai-office`，从实际 `.openai/hosting.json` 获取并核实项目身份，不从 Skill 猜测 ID 或最新部署。

| 文件 | 职责 |
|---|---|
| `lib/team.mjs` | 六角色、提示词、经理指导 |
| `lib/commands.mjs`, `lib/office.ts` | 幂等、校验、原子领取、状态、审计、工具 schema |
| `lib/instant.mjs`, `lib/instant-runtime.ts` | 即时请求、轮询、解析、指导保存 |
| `app/api/commands`, `app/api/agent`, `app/mcp` | 浏览器、私有服务、连接工具 |
| `app/command-center.tsx`, `app/office.tsx` | 指令、折叠历史、回复置顶、短摘要、经理建议 |
| `app/office-3d.tsx` | 场景、工位、人物、路线和镜头 |
| `lib/floor-layout.mjs`, `lib/people.mjs`, `lib/staff-look.ts`, `lib/human-motion.ts` | 外观、配饰、座位、骨骼与动作 |
| `lib/life-scene.ts`, `lib/leisure.mjs`, `lib/life-runtime.ts`, `lib/routine.mjs` | 生活社区、模拟选择、持久状态、工作优先 |
| `lib/pipeline.mjs`, `lib/replies.mjs` | 发信限制、停止状态、回复与提醒 |
| `lib/workflow.ts` | 运行指导；另核实实际日程提示与持久设置 |
| `tests/` | 指令、发送、回复、角色、生活、座位、长结果验证 |

原六角色 ID 为 WBMarketing、WBadmin、WBSales、WBPA、WBEngineer、WBManager。维护时保留以免任务失去关联；历史文档可能写 WBPa，当前源码是 WBPA。

新公司不自动继承这些业务岗位、授权或政策。包内没有原业务规则模块或邮件模板，因为它们包含公司专属身份、价格、联系人及边界；维护原站要读当前源码，新建要按新公司的授权重建。

健身与宠物：`lib/amenities-scene.ts`、`lib/office-amenities.mjs`；楼层验收：`tests/floors.test.mjs`、`tests/amenities.test.mjs`。现有 WB 首页将场景放在任务与报告前，默认二楼办公；自动与手动运行需实际读取共享执行规则，不能仅修改外壳。
