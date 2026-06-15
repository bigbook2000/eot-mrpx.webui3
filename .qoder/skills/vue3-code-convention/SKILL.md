---
name: vue3-code-convention
description: Vue 3组件编码规范，禁止使用computed计算属性和watch响应式监听，优先使用ref声明状态并通过显式方法调用更新。在编写或修改任何Vue 3组件的script逻辑时必须应用此规范。
---

# Vue 3 编码规范

本规范适用于项目中所有 Vue 3 组件（`<script setup lang="ts">`）的逻辑编写。

## 核心规则

### 1. 禁止使用 `computed`

不允许使用 `computed` 计算属性。所有需要派生的值，应通过显式函数计算后赋给 `ref`。

```ts
// ❌ 禁止
import { computed } from "vue"
const fullName = computed(() => firstName.value + " " + lastName.value);

// ✅ 正确
import { ref } from "vue"
const fullName = ref("");

const updateFullName = () => {
    fullName.value = firstName.value + " " + lastName.value;
};
// 在数据变化时显式调用
updateFullName();
```

### 2. 禁止使用 `watch`

不允许使用 `watch` 或 `watchEffect` 监听响应式数据。需要响应数据变化时，应在触发变化的操作完成后显式调用处理方法。

```ts
// ❌ 禁止
import { watch } from "vue"
watch(() => props.itemId, (newVal) => {
    loadData(newVal);
});

// ✅ 正确
// 由父组件或调用方在适当时机显式调用
const loadData = async (itemId: number) => {
    // ...
};

defineExpose({ loadData });
```

### 3. 优先使用 `ref` 声明状态

所有响应式状态使用 `ref` 声明，通过显式赋值 `.value` 更新状态，保持数据流向清晰可控。

```ts
// ✅ 正确
const x_data_list = ref<any[]>([]);
const x_show_loading = ref(false);

const refreshList = async () => {
    x_show_loading.value = true;
    const list = await fetchList();
    x_data_list.value = list;
    x_show_loading.value = false;
};
```

## 适用场景

- 编写新的 Vue 组件 `<script setup>` 逻辑时
- 修改已有组件的业务逻辑时
- 代码审查时检查是否存在 `computed` 或 `watch` 用法

## 例外情况

以下场景可酌情使用，需在注释中说明理由：

- 第三方库要求必须传入 `computed` 或 `ref` 包装的响应式数据
- 框架内部机制依赖（如路由守卫等）

## Vue 响应式变量命名规范

Vue 组件中 `ref()` / `reactive()` 声明的响应式变量**必须**以 **`x_`** 为前缀，全部小写，单词间用下划线连接。

```ts
// ✅ 正确
const x_visible = ref(false);
const x_query_cpmc = ref("");
const x_data_list = ref<any[]>([]);
const x_cpdy_data: any = reactive({});
const x_selected_id = ref(0);

// ❌ 错误：缺少 x_ 前缀
const visible = ref(false);
const queryKeyword = ref("");  // 不应使用驼峰
```

> **`m_` 前缀**保留给非响应式的模块级变量（如 `m_cplb_list`、`m_dialog_tag`）。
