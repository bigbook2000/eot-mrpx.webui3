<template>
    <!-- 库存整理 - 编辑工具栏 -->
    <div class="div_tool_bar div_tool_actions">
        <div class="div_btn_group">
            <vbuttonk type="primary" permit="" @click="emit('add')">新增</vbuttonk>
            <vbuttonk type="primary" permit="" @click="emit('upd')">修改</vbuttonk>
            <vbuttonk type="danger" permit="" @click="emit('del')">移除</vbuttonk>
        </div>
        <div class="div_btn_group">
            <vbuttonk type="default" permit="" @click="emit('jy')">调拨</vbuttonk>
            <vbuttonk type="default" permit="" @click="emit('cf')">拆库</vbuttonk>
            <vbuttonk type="default" permit="" @click="emit('hb')">并库</vbuttonk>
            <vbuttonk type="primary" permit="" @click="emit('get')">详情</vbuttonk>
        </div>
    </div>
</template>

<script lang="ts" setup>
import vbuttonk from "@/components/web/vbuttonk.vue";

const emit = defineEmits<{
    (e: 'add'): void;
    (e: 'upd'): void;
    (e: 'del'): void;
    (e: 'jy'): void;
    (e: 'cf'): void;
    (e: 'hb'): void;
    (e: 'get'): void;
}>();
</script>

<style lang="scss" scoped>
    .div_tool_bar {
        padding: 0.6rem 0.8rem;
        background: #fff;
        border-bottom: 1px solid var(--eo_color_grey_light3);
    }

    .div_tool_actions {
        border-bottom: 1px solid var(--eo_color_grey_light3);
    }

    .div_btn_group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        padding: 0.3rem 0;
    }
</style>
