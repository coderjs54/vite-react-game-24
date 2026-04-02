# 24 点小游戏（vite-react-game-24）

基于 Vite 与 React 的网页版「24 点」小游戏：系统随机给出四个 1–10 的整数，玩家用加减乘除与括号将四个数字各用一次，使表达式结果为 24。支持中英文界面，并可作为 PWA 安装或离线访问。

---

## 技术栈概览

| 类别 | 技术 | 说明 |
|------|------|------|
| 运行时 | **React 19** | 函数组件 + Hooks（`useState` / `useEffect` / `useCallback`）构建 UI 与游戏逻辑 |
| 渲染 | **react-dom** | `createRoot` 挂载根节点，`StrictMode` 包裹应用 |
| 语言 | **TypeScript 5.9** | 严格模式、`moduleResolution: bundler`、与 Vite 协同的 `noEmit` 构建 |
| 构建工具 | **Vite 8** | 开发与生产打包、ESM、HMR |
| React 集成 | **@vitejs/plugin-react** | 官方 React 插件，配合 Oxc 进行快速转换 |
| 编译优化 | **React Compiler** | 通过 `@rolldown/plugin-babel` + `babel-plugin-react-compiler`（`reactCompilerPreset`）在构建链路中启用，减少手写 memo 负担（对 dev/build 性能有一定影响） |
| 样式 | **Sass（sass-embedded）** | 组件级 `App.scss`；全局基础样式为 `index.css` |
| 国际化 | **i18next** + **react-i18next** | 资源为 `src/i18n/zh.json`、`en.json`，默认中文；语言偏好持久化到 `localStorage` |
| PWA | **vite-plugin-pwa** + **@vite-pwa/assets-generator** | `registerType: 'autoUpdate'`、Workbox 缓存静态资源；开发环境可开启 SW 便于调试；`manifest` 配置应用名称与主题色等 |
| 代码质量 | **ESLint 9（flat config）** | `@eslint/js`、`typescript-eslint` 推荐规则、`eslint-plugin-react-hooks`、`eslint-plugin-react-refresh`（Vite 场景） |

---

## 架构与实现要点

- **入口**：`index.html` → `src/main.tsx` 引入 `./i18n` 初始化多语言后渲染 `App`。
- **核心逻辑**（`App.tsx`）：维护随机四数、每数可用次数、表达式数组；校验「四数用尽」后通过表达式字符串求值，判断是否为 24；非法表达式捕获为错误态。
- **部署路径**：`vite.config.ts` 中 `base: '/vite-react-game-24/'`，用于 GitHub Pages 等子路径部署；若改为主域根路径需同步修改 `base`。

---

## 开发与构建

```bash
npm install
npm run dev      # 开发服务器（默认端口 5174，--host 对外可访问）
npm run build    # tsc -b 类型检查 + vite build
npm run preview  # 预览生产构建
npm run lint     # ESLint
```

---

## `.github` 目录（CI / 自动化）

仓库通过 [GitHub Actions](https://docs.github.com/en/actions) 在推送 `main` 时自动构建并发布到 **GitHub Pages**。

| 文件 | 作用 |
|------|------|
| `workflows/deploy.yaml` | 工作流 **「Deploy App to GitHub Pages」**：检出代码 → 使用 Node.js **20**（`actions/setup-node@v4`，并缓存 npm）→ `npm ci --legacy-peer-deps` → `npm run build` → 将 **`dist`** 作为站点产物上传并部署（`configure-pages` / `upload-pages-artifact` / `deploy-pages`）。 |

**触发条件**

- 向 **`main`** 分支 **push** 时自动运行。
- 支持在 Actions 页 **手动运行**（`workflow_dispatch`）。

**其他说明**

- **`concurrency`**：同一 `pages` 并发组内只保留最新一次部署，进行中会取消旧任务，避免排队冲突。
- **`permissions`**：`contents: read`，`pages: write`，`id-token: write`（OIDC 部署 Pages 所需）。
- **`env.FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`**：将 JavaScript 类 Action 固定到 Node 24 运行时（工作流全局环境变量）。
- 首次使用需在仓库 **Settings → Pages** 中将 **Source** 设为通过 **GitHub Actions** 部署；站点子路径需与 `vite.config.ts` 里的 **`base: '/vite-react-game-24/'`** 及仓库名一致（或按需同时修改二者）。

---

## 项目结构（简要）

```
.github/
  workflows/deploy.yaml   # GitHub Pages 自动部署
src/
  App.tsx / App.scss   # 游戏主界面与样式
  main.tsx             # 应用入口
  index.css            # 全局样式
  i18n/                # 多语言配置与 JSON 文案
```

---

## 相关文档

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [React Compiler](https://react.dev/learn/react-compiler)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [i18next](https://www.i18next.com/)
