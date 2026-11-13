# AI Office Builder · 可视化 AI 办公室 Skill

可复用的中文 3D AI 办公室搭建 skill，包含六位职员、二楼办公／一楼娱乐、健身房、猫狗、人物跟随，以及真实任务状态的接入规范。

## 安装与使用

将本仓库的完整内容放在 `~/.codex/skills/ai-office-builder/`，确认 `SKILL.md` 位于该目录根部。重新加载支持 skills 的客户端后，可以说：

> 使用 $ai-office-builder，帮我搭建或扩展一个中文 AI 办公室。

## 仓库内容

- `SKILL.md`：入口与工作规则。
- `references/`：任务执行契约、场景、邮件提醒、部署及手机访问说明。
- `assets/visual-modules/`：React/TypeScript/Three.js 场景、动作与行为测试。
- `scripts/seed_visual_modules.py`：复制外壳到新的空目录，拒绝覆盖已有文件。
- `scripts/check_bundle.py`：检查资源边界、引用、行为和安全复制规则。

## 验证

需要 Python 3 和 Node.js：

```sh
python scripts/check_bundle.py
```

生成视觉外壳：

```sh
python scripts/seed_visual_modules.py --dest /path/to/new-empty-office
```

宿主需配置 React、React DOM、TypeScript、Three.js 及相关类型依赖；参考 `references/scene.md`。

## 能力边界

外壳不是已经运行的业务后台。真实执行需要另外接入登录授权、数据库、任务队列、调度器、AI API、邮件连接及结果证据。人物动作不能证明研究或邮件已完成。

不包含 API 密钥、邮箱授权、客户数据、数据库、原办公室部署配置或第三方人物模型；默认使用程序化人物。可选人物资源需另行取得并核实许可。
