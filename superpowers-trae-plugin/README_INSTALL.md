# Superpowers Trae IDE 插件安装说明

## 快速安装（3步完成）

### 步骤 1：下载插件

下载 `superpowers-trae-X.X.X.vsix` 文件（X.X.X 为版本号）

### 步骤 2：安装到 Trae IDE

**方法 A：双击安装**
- 双击 `.vsix` 文件，Trae IDE 会自动打开并安装

**方法 B：手动安装**
1. 打开 Trae IDE
2. 按 `Ctrl+Shift+X` 打开扩展面板
3. 点击右上角的 `...` 菜单
4. 选择 "Install from VSIX..."
5. 选择下载的 `.vsix` 文件

### 步骤 3：重启 Trae IDE

安装完成后，重启 Trae IDE 即可使用。

---

## 如何使用

安装完成后，**无需任何配置**，Superpowers 的 14 个专业 AI 开发技能会自动在你的 Trae IDE 中生效！

### 自动触发技能

在 Trae AI 对话中：

| 你说 | AI 自动触发 |
|------|------------|
| "帮我实现一个功能" | `brainstorming` |
| "这个 bug 怎么修" | `systematic-debugging` |
| "帮我写一个计划" | `writing-plans` |
| "实现这个功能" | `test-driven-development` |
| "检查我的代码" | `requesting-code-review` |

### 手动调用技能

你也可以明确指定使用某个技能：

```
用 systematic-debugging 帮我调试这个问题...
用 writing-plans 帮我写一个实现计划...
```

---

## 包含的技能

| 技能 | 用途 |
|------|------|
| **brainstorming** | 头脑风暴，规划功能前必用 |
| **systematic-debugging** | 系统化调试，四阶段修复 bug |
| **test-driven-development** | 测试驱动开发，红-绿-重构 |
| **writing-plans** | 编写详细实现计划 |
| **executing-plans** | 执行写好的实现计划 |
| **subagent-driven-development** | 子代理驱动开发 |
| **verification-before-completion** | 完成前必须验证 |
| **requesting-code-review** | 请求代码审查 |
| **receiving-code-review** | 接收代码审查反馈 |
| **dispatching-parallel-agents** | 分发并行代理 |
| **using-git-worktrees** | 使用 Git 工作树 |
| **finishing-a-development-branch** | 完成开发分支 |
| **writing-skills** | 编写新技能 |
| **using-superpowers** | 使用 Superpowers 引导 |

---

## 如何自行构建

如果你想自己构建这个插件：

### 前提条件

1. 安装 [Node.js](https://nodejs.org/)
2. 安装 `@vscode/vsce`：
   ```bash
   npm install -g @vscode/vsce
   ```

### 构建步骤

**Windows:**
```cmd
cd superpowers-trae-plugin
build.cmd
```

**Mac/Linux:**
```bash
cd superpowers-trae-plugin
./build.sh
```

构建完成后会在当前目录生成 `superpowers-trae-X.X.X.vsix` 文件。

---

## 常见问题

### Q: 安装后技能没有生效？

A: 检查以下几点：
1. 确认 Trae IDE 已重启
2. 打开项目后检查 `.trae/skills/` 目录是否已创建
3. 检查 `AGENTS.md` 是否在项目根目录
4. 在扩展面板确认 Superpowers 插件已启用

### Q: 如何在多个项目中使用？

A: 安装一次后，**所有项目**都会自动安装技能文件，无需重复安装。

### Q: 如何卸载？

A: 
1. 打开 Trae IDE 扩展面板（`Ctrl+Shift+X`）
2. 找到 "Superpowers" 插件
3. 点击 "卸载"

---

## 项目信息

- **仓库**: https://github.com/obra/superpowers
- **许可证**: MIT
- **版本**: 5.1.0
- **作者**: Jesse Vincent

---

## 反馈与贡献

如果你遇到问题或有改进建议：
1. 访问上游仓库提交 issue
2. 查看 Trae IDE 文档了解更多
