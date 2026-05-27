# 🤖 Qoder Project Rules (EOT-MRPX)

## 📌 核心上下文
- **项目**: EOT-MRPX智能企业管理平台 (ERP进销存)
- **技术栈**: Vue 3 + TS + Vue Router + Element Plus (前端) / Spring Boot (后端)
- **运行环境**: PC (`index.html`) / App (`app.html`)

## 🗂️ 目录与路径铁律
- **数据接口层**: 所有后台数据接口统一通过 `@/inc/eocore.ts` 暴露调用。🚫 禁止在业务代码中直接使用 `axios/fetch`。
- **专用接口**: 非 `eocore` 的标准业务接口，必须使用 `POST` 方法调用，并在注释标明 `// POST: /api/xxx`。
- **样式架构**:
  - 全局变量/基础样式 → `assets/eoui.scss`
  - PC 端全局样式 → `assets/prj.scss`
  - App 端全局样式 → `assets/app.scss`
  - Element Plus 覆盖 → 仅允许修改 `assets/element/` 下的原始文件，🚫 绝对禁止使用 `:deep()` 或内联 `style` 覆盖。
  - 组件样式 → 必须使用 `<style scoped>`，大类名 **强制以 `div_` 开头**，🚫 绝对禁止自行以`eo_`开头。请严格按 div_ 前缀规范输出样式，生成后自检类名是否符合 ^\.div_。尺寸单位优先使用 `rem`。
- **模块职责映射**:
  - `inc/` → 基础核心（网络层 `eocore.ts`、底层工具）
  - `logic/` → 业务逻辑（`TGlobal.ts` 静态配置，`TLogic.ts` 全局应用逻辑）
  - `logic/common/` → 可复用基础组件
  - `views/` → 路由页面（严格按 `app/`, `frame/`, `login/`, `platform/` 分包）

## 📐 代码规范（AI 强制执行）
1. **Vue 3 组件**: 必须使用 `<script setup lang="ts">`，🚫 禁用 Options API。
2. **类型安全**: 🚫 严格禁止使用 `any`。所有 Props、API 响应、Pinia/React 状态必须定义 `interface`。
3. **引入规范**: 统一使用 `@/` 别名（如 `import { ... } from '@/inc/eocore'`），🚫 禁止 `../../../` 等深层相对路径。
4. **接口调用**: 业务逻辑（proc）/组件必须直接调用 `eocore.ts` 封装的方法，保持数据流单一。
5. **错误处理**: 所有异步调用必须包含 `try/catch` 或交由 `eocore` 全局拦截器处理，🚫 禁止忽略 Promise rejection。
6. **注释规范**: 复杂逻辑需附 JSDoc；临时调试代码必须用 `// TODO:` 或 `// DEBUG:` 标记，交付前清除。

## 🚫 明确禁止项（Hard Constraints）
- ❌ 禁止直接修改 `node_modules` 或使用 `:deep()` 覆盖 Element Plus
- ❌ 禁止在 `inc/eocore.ts` 之外编写 HTTP 请求逻辑
- ❌ 禁止使用 `any`、`console.log`（生产代码）、`eval()`、`new Function()`
- ❌ 禁止在 `views/` 中存放可复用组件（应移至 `logic/common/`）
- ❌ 禁止硬编码路由、Token 或后端地址（统一从 `TGlobal.ts` 读取）

## 🤖 AI 行为准则
- 生成代码前，先校验文件应落位的目录，不符合约定直接拒绝并提示正确路径。
- 输出必须包含完整 `import`、`interface` 定义及 `<script setup>` 模板。
- 遇到不确定的 `eocore` 方法或 `TLogic` 全局变量，按规范假设其存在并调用，不自行编造底层实现。
- 每次输出后，附带简短的「变更说明」与「验证步骤」。