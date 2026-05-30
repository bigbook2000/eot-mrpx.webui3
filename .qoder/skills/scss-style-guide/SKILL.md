---
name: scss-style-guide
description: SCSS样式编写规范，定义样式复用优先级、类名前缀规则、Element组件覆盖方式及scoped使用要求。在编写或修改任何Vue组件的样式时必须应用此规范。
---

# SCSS 样式编写规范

## 样式复用优先级

编写样式时按以下优先级复用已有样式：

1. **框架样式** — 优先从 [assets/eoui.scss](src/assets/eoui.scss) 中查找可复用的类（以 `eo_` 为前缀的通用布局/工具类）
2. **项目公共样式** — 其次从对应端的复用样式文件中查找

## 公共样式文件与类名前缀

### PC 端（桌面端 ≥1200px）
- 文件：[assets/prj.scss](src/assets/prj.scss)
- 顶层大类名以 **`sv_`** 开头
- 示例：`.sv_dialog_head`、`.sv_file`、`.sv_tab`

### App 端（移动端 <1200px）
- 文件：[assets/app.scss](src/assets/app.scss)
- 顶层大类名以 **`ap_`** 开头
- 示例：`.ap_topbar`、`.ap_button`

## App 端表单布局规范

App 界面中的表单**必须**遵循以下布局约定：

1. 表单容器使用框架类 **`eo_form`**
2. 每个表单项 `cell` 宽度为 **`eo_w100`**（移动端全宽，每行一个字段）
3. 按钮独占一行，使用框架类 `<div class="button">` 包裹
4. 按钮样式使用 App 公共类 **`ap_button`**（定义在 [app.scss](src/assets/app.scss)）

```vue
<!-- ✅ 正确：App 端表单布局 -->
<div class="eo_form">
    <div class="cell eo_w100">
        <div class="label_n">批次</div>
        <div class="input">
            <el-input v-model="data['f_kcbh']" style="width:100%" readonly />
        </div>
    </div>
    <div class="cell eo_w100">
        <div class="label_n">单件数量</div>
        <div class="input">
            <el-input-number v-model="data['f_kcsl']" style="width:100%" />
        </div>
    </div>
    <div class="button">
        <el-button class="ap_button" type="primary" @click="onSave">保存</el-button>
    </div>
    <div class="button">
        <el-button class="ap_button" type="danger" @click="onRemove">移除</el-button>
    </div>
</div>

<!-- ❌ 错误：App 端不应使用 eo_w2（双列） -->
<div class="cell eo_w2">  <!-- App 端应使用 eo_w100 -->
```

## App 端 Dialog 按钮布局规范

App 界面中的 `el-dialog` **禁止**使用 `<template #footer>` 插槽放置操作按钮。

**所有操作按钮必须放置在 `eo_form` 容器内部**，使用 `<div class="button">` 包裹，样式为 `ap_button`。

```vue
<!-- ✅ 正确：按钮在 eo_form 内部 -->
<el-dialog v-model="visible" title="编辑" fullscreen>
    <div class="eo_form">
        <div class="cell eo_w100">
            <div class="label_n">名称</div>
            <div class="input">
                <el-input v-model="data['f_cpmc']" style="width:100%" />
            </div>
        </div>
        <div class="button">
            <el-button class="ap_button" type="primary" @click="onConfirm">确定</el-button>
        </div>
        <div class="button">
            <el-button class="ap_button" @click="onCancel">取消</el-button>
        </div>
    </div>
</el-dialog>

<!-- ❌ 错误：不应使用 #footer 插槽 -->
<el-dialog v-model="visible" title="编辑" fullscreen>
    <div class="eo_form">
        ...
    </div>
    <template #footer>  <!-- App 端禁止此写法 -->
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
    </template>
</el-dialog>
```

## Element Plus 组件属性规范

**禁止**在 Element Plus 组件上使用 `small`、`mini` 等尺寸缩写属性。桌面端移动端共用一套组件，尺寸应由框架统一控制。

```vue
<!-- ✅ 正确 -->
<el-pagination background
    ...
    layout="prev, pager, next" />

<el-button type="primary" @click="onClick">确定</el-button>

<!-- ❌ 错误：不应使用 small 属性 -->
<el-pagination background small
    ... />

<el-button size="small" type="primary">确定</el-button>
```

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

## App 端卡片列表规范

App 界面中的卡片式列表**必须**使用 [app.scss](src/assets/app.scss) 中定义的通用 `ap_` 类，**禁止**在组件 scoped 样式中重复编写卡片布局。

所有卡片子类采用**短命名**并在 `.ap_list` 下嵌套定义，编写模板时无需加 `ap_` 前缀。

### 通用类清单

| 类名 | 嵌套层级 | 用途 |
|------|---------|------|
| `ap_list` | 顶层 | 列表外层容器 |
| `.empty` | `.ap_list >` | 空数据提示 |
| `.item` | `.ap_list >` | 单个卡片 |
| `.item.ap_sel` | `.ap_list >` | 选中态卡片 |
| `.check` | `.item >` | 右上角复选框（绝对定位） |
| `.detail` | `.item >` | 右下角详情按钮（绝对定位） |
| `.body` | `.item >` | 卡片主体内容区域 |
| `.row` | `.body >` | 内容行（flex 横向排列） |
| `.label` | `.row >` | 标签文字（灰色、固定宽） |
| `.value` | `.row >` | 值文字（弹性宽、自动截断） |
| `.title` | `.row > .value` | 主标识加粗（叠加在 `.value` 上） |

### 模板结构

```vue
<!-- ✅ 正确：使用 ap_list + 嵌套短命名 -->
<div class="ap_list">
    <div v-if="list.length === 0" class="empty">暂无数据</div>
    <div v-for="item in list" :key="item.id"
        class="item"
        :class="{ 'ap_sel': selectedId == item.id }">
        <!-- 可选：复选框 -->
        <div class="check" @click.stop="onCheck(item)">
            <el-checkbox :model-value="checked" />
        </div>
        <!-- 主体内容 -->
        <div class="body">
            <div class="row">
                <span class="label">名称</span>
                <span class="value title">{{ item.name }}</span>
            </div>
            <div class="row">
                <span class="label">单价</span>
                <span class="value">{{ item.price }}</span>
                <span class="label">数量</span>
                <span class="value">{{ item.count }}</span>
            </div>
        </div>
        <!-- 可选：详情按钮 -->
        <div class="detail">
            <el-button type="primary" plain @click="onDetail(item)">详情</el-button>
        </div>
    </div>
</div>

<!-- ❌ 错误：不要在 scoped 中重复编写卡片样式 -->
<style lang="scss" scoped>
.div_list_item {  // 应使用 ap_list > .item
    background: #fff;
    border-radius: 0.5rem;
    ...
}
</style>
```

## 功能界面类名规范

功能业务界面（Vue 组件内 `<style scoped>` 中）单独编写的样式：

- **顶层大类名**必须以 **`div_`** 开头
- **子类名**可以不用 `div_` 开头（但仍需遵守子类命名禁令）

```scss
/* ✅ 正确：顶层大类以 div_ 开头 */
.div_list_wrap {
    .header { ... }
    .body { ... }
    .footer { ... }
}

/* ❌ 错误：顶层大类缺少 div_ 前缀 */
.list_wrap {
    .header { ... }
}
```

## 子类命名禁令

子类名（嵌套在顶层大类下的类名）**绝对禁止**以下列特殊前缀开头：

- `eo_` — 框架样式前缀
- `el-` — Element Plus 组件前缀
- `sv_` — PC 端公共样式前缀
- `ap_` — App 端公共样式前缀

```scss
/* ✅ 正确：子类名不使用特殊前缀 */
.sv_dialog_head {
    .title { ... }
    .close { ... }
}

.ap_topbar {
    .back { ... }
    .title { ... }
}

/* ❌ 错误：子类名使用了禁止前缀 */
.sv_form {
    .sv_label { ... }     // 禁止 sv_ 前缀
    .el-input { ... }     // 禁止 el- 前缀
    .eo_icon { ... }      // 禁止 eo_ 前缀
}
```

## Element Plus 组件样式覆盖

修改 Element Plus 组件样式时，**绝对禁止**以下方式：

1. ❌ 使用 `:deep()` 穿透
2. ❌ 直接内联覆盖 `el-` 原有样式类

**唯一允许的方式：通过新增自定义 class 覆盖**

```scss
/* ❌ 禁止 */
:deep(.el-input__inner) {
    border-color: red;
}

/* ❌ 禁止 */
.el-button {
    background: blue;
}

/* ✅ 正确：在组件上添加自定义 class，然后用该 class 覆盖 */
.my-custom-input {
    width: 200px;
    border-radius: 6px;
}
```

## Scoped 样式要求

所有功能业务界面的 `<style>` 块**必须**使用 `scoped` 属性：

```vue
<!-- ✅ 正确 -->
<style lang="scss" scoped>
.div_container {
    ...
}
</style>

<!-- ❌ 错误：缺少 scoped -->
<style lang="scss">
.div_container {
    ...
}
</style>
```

## 完整示例

### 公共样式复用（PC 端，写入 prj.scss）

```scss
/* assets/prj.scss */
.sv_form_wrap {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
}
```

### 功能界面样式（Vue 组件内，顶层大类以 div_ 开头）

```vue
<template>
    <div class="div_search_box">
        <el-input class="search_input" v-model="keyword" />
        <el-button class="search_btn" type="primary">查询</el-button>
    </div>
</template>

<style lang="scss" scoped>
.div_search_box {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;

    .search_input {
        flex: 1 1 auto;
        width: 0;
    }

    .search_btn {
        flex: 0 0 auto;
        min-width: 6rem;
    }
}
</style>
```
