# EOT-MRPX WebUI3

企业资源管理系统（EOT-MRPX）的前端Web应用，基于Vue 3 + TypeScript技术栈构建。

## 功能模块

### 采购管理 (tcggl)
- **采购订单管理** - 采购订单的新增、编辑、查看、流程审批
- **采购退货管理** - 退货申请、审核、入库、退款处理
- **供应商管理** - 供应商信息维护、查询
- **采购查询** - 采购入库数据查询

### 库存管理 (tkcgl)
- **产品管理** - 产品信息、版本、规格管理
- **库存明细** - 库存批次、数量、金额管理
- **出入库记录** - 入库、出库操作记录查询
- **库存预警** - 库存数量预警提示
- **库存盘点** - 库存盘点、差异处理

### 销售管理 (txsgl)
- **销售订单管理** - 销售订单的新增、编辑、查看
- **客户管理** - 客户信息维护、查询
- **销售查询** - 销售出库数据查询
- **退货管理** - 销售退货处理流程

### 生产管理 (tscgl)
- **生产订单管理** - 生产任务单的创建、跟踪
- **生产工艺** - 工艺路线、工序管理
- **生产记录** - 生产进度、完成记录

### 物流管理 (tcwgl)
- **物流公司管理** - 物流服务商信息维护
- **物流跟踪** - 发货、运输、收货跟踪

## 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **UI组件**: Element Plus
- **构建工具**: Vite
- **路由**: Vue Router
- **状态管理**: Vue Composition API (ref/reactive)
- **样式**: SCSS

## 项目结构

```
src/
├── assets/          # 静态资源（图标、样式）
├── components/      # 通用组件
├── inc/             # 核心工具库
│   ├── eocore.ts    # 核心API封装
│   ├── eoflow.ts    # 流程管理
│   ├── eolib.ts     # 工具函数
│   └── eotypes.ts   # 类型定义
├── logic/           # 业务逻辑层
│   ├── TLogic.ts    # 业务逻辑类
│   ├── TGlobal.ts   # 全局状态
│   └── common/      # 通用组件
├── router/          # 路由配置
└── views/           # 页面视图
    ├── frame/       # 框架页面
    └── comm/        # 公共组件
```

## 核心组件说明

### 流程管理组件
- **vflow** - 流程引擎组件，处理流程节点、状态流转
- **tflow_button** - 统一流程按钮组件，支持新建、编辑、提交、审核等操作

### 通用组件
- **vtable** - 数据表格组件，支持分页、排序、自定义列
- **vdialog** - 对话框组件
- **vform** - 表单组件
- **vdic** - 字典选择组件

## 安装与运行

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 开发规范

### 代码风格
- 使用TypeScript，严格模式
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
- 变量命名采用 camelCase

### 组件开发规范
- 使用 Composition API (script setup)
- 组件必须有清晰的类型定义
- 事件命名采用 onEventName 格式
- 组件属性命名采用 camelCase

### 流程管理规范
- 使用统一的 `tflow_button` 组件处理流程操作
- 流程状态通过 `v_flow_button.update_flow_status()` 更新
- 流程事件通过统一的 `onButtonClick_Flow` 处理

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。