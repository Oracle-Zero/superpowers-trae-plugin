# Superpowers Trae IDE - 分享与使用指南

## 快速开始（3步安装）

### 方式一：一键安装脚本（最简单）

1. **下载 Superpowers**
   ```bash
   # 克隆仓库
   git clone https://github.com/YOUR_USERNAME/superpowers.git
   cd superpowers
   ```

2. **运行安装脚本**
   
   **Windows:**
   ```cmd
   scripts\install-superpowers-trae.cmd C:\你的\项目\路径
   ```
   或直接双击 `scripts\install-superpowers-trae.cmd`

   **Mac/Linux:**
   ```bash
   chmod +x scripts/install-superpowers-trae.sh
   ./scripts/install-superpowers-trae.sh /你的/项目/路径
   ```

3. **重启 Trae IDE**
   打开你的项目，开始使用！

---

### 方式二：手动安装

1. **复制技能文件**
   ```bash
   # 进入你的 Trae 项目
   cd your-project
   
   # 创建必要目录
   mkdir -p .trae/skills
   mkdir -p .trae-plugin
   ```

2. **复制文件**
   ```bash
   # 复制技能文件
   cp -r /path/to/superpowers/.trae/skills/* .trae/skills/
   
   # 复制插件配置
   cp /path/to/superpowers/.trae-plugin/plugin.json .trae-plugin/
   
   # 复制技能索引
   cp /path/to/superpowers/AGENTS.md .
   ```

---

## 如何使用

安装完成后，在 Trae IDE 中：

### 自动触发技能

直接描述你的需求，AI 会自动触发相应技能：

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

## 更新技能

当上游 Superpowers 发布新版本时：

### 使用更新脚本

**Windows:**
```cmd
cd superpowers
scripts\update-superpowers.cmd
```

**Mac/Linux:**
```bash
cd superpowers
./scripts/update-superpowers.sh
```

### 然后重新安装到项目

```cmd
# 重新运行安装脚本
scripts\install-superpowers-trae.cmd C:\你的\项目\路径
```

---

## 常见问题

### Q: 技能没有自动触发？

A: 检查以下几点：
1. AGENTS.md 是否在项目根目录
2. 技能文件是否在 `.trae/skills/` 目录下
3. 每个技能目录是否有 `SKILL.md` 文件
4. 重启 Trae IDE

### Q: 如何查看已安装的版本？

A: 查看 `.trae-plugin/plugin.json` 中的 `version` 字段

### Q: 可以在多个项目中使用吗？

A: 可以！每个项目都需要单独安装技能文件：
```cmd
scripts\install-superpowers-trae.cmd C:\项目A
scripts\install-superpowers-trae.cmd C:\项目B
```

---

## 项目信息

- **仓库**: https://github.com/obra/superpowers
- **许可证**: MIT
- **版本**: 5.1.0
- **作者**: Jesse Vincent

---

## 反馈与贡献

如果你遇到问题或有改进建议：
1. 查看 [docs/TRAEO_SETUP.md](docs/TRAEO_SETUP.md) 获取更多设置信息
2. 访问上游仓库提交 issue
