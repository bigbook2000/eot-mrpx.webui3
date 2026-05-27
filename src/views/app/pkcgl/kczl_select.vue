<template>
    <!-- 库存整理 - 已选择列表 -->
    <el-dialog v-model="x_visible" title="已选择库存" fullscreen :z-index="2000">
        <div class="ap_list_wrap">
            <div v-if="list.length === 0" class="empty">
                暂无选择
            </div>
            <div v-for="item in list" :key="item.f_kcmx_id"
                class="item">
                <div class="body">
                    <div class="row">
                        <span class="label">批次</span>
                        <span class="value title">{{ item.f_kcbh }}</span>
                        <span v-if="item.f_jyzt != 0" class="div_tag">{{ item.f_jyzt_s }}</span>
                    </div>
                    <div class="row">
                        <span class="label">名称</span>
                        <span class="value">{{ item.f_cpmc }}</span>
                    </div>
                    <div class="row">
                        <span class="label">单价</span>
                        <span class="value">{{ item.f_kcdj_s }}</span>
                        <span class="label">数量</span>
                        <span class="value">{{ item.f_kcsl }}</span>
                    </div>
                    <div class="row">
                        <span class="label">规格</span>
                        <span class="value">{{ item.f_cpgg || '-' }}</span>
                    </div>
                    <div class="row">
                        <span class="label">尺寸</span>
                        <span class="value">{{ item.f_cpcc || '-' }}</span>
                        <span class="label">重量</span>
                        <span class="value">{{ item.f_cpzl || '-' }}</span>
                    </div>
                </div>
                <div class="detail">
                    <el-button class="detail_btn" size="small" type="primary" plain
                        @click="$emit('detail', item)">详情</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
    modelValue: boolean;
    list: any[];
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
    (e: 'detail', item: any): void;
}>();

const x_visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
</script>

<style lang="scss" scoped>

    /* 标签（主色调） */
    .div_tag {
        flex: 0 0 auto;
        font-size: 0.9rem;
        color: #fff;
        background: var(--eo_color_main);
        padding: 0.1rem 0.4rem;
        border-radius: 0.3rem;
        margin-left: 0.5rem;
    }
</style>
