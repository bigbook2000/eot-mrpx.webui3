<template>
    <el-dialog v-model="x_show_dialog" 
        class="ap_dialog"
        :fullscreen="true"
        :show-close="false" 
        :align-center="true"
        :close-on-click-modal="false"
        :append-to-body="true"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="ap_dialog_head">
                <div class="title">
                    <span>{{ title }}</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div v-loading="x_show_loading">
            <!-- 默认插槽 -->
            <slot></slot>
            <div class="ap_dialog_foot">
                <div class="button">
                    <el-button type="primary" class="eo_w100" @click="onButtonClick_Ok">{{ okLabel }}</el-button>
                </div>
                <slot name="button"></slot>
                <div class="button">
                    <el-button type="default" class="eo_w100" @click="onButtonClick_Cancel">取消</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">

    import { ref, reactive, nextTick } from "vue"
    import type {cfunc_boolean} from "@/inc/eotypes";

    withDefaults(defineProps<{
        okLabel?: string,
        title?: string,
        width?: string
    }>(), {
        okLabel: "确定",
        title: "提示",
        width: "500px"
    })

    const emits = defineEmits<{
        (e: "open", tag: any): void
        (e: "close", cancel: boolean, tag: any, cb: cfunc_boolean): void
    }>()

    const x_show_dialog = ref(false);
    const x_show_loading = ref(false);

    /** 外挂数据  */
    let m_dialog_tag: any = undefined;

    const show_dialog = (tag: any) => {
        x_show_dialog.value = true;        
        m_dialog_tag = tag;
    }

    const onDialogOpened = () => {
        emits("open", m_dialog_tag);
    }
    const onDialogClose = () => {
    }
    const onButtonClick_Cancel = () => {
        emits("close", true, m_dialog_tag, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }
    const onButtonClick_Ok = () => {
        emits("close", false, m_dialog_tag, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }

    const show_loading = (show: boolean) => {
        x_show_loading.value = show;
    }

    defineExpose({
        show_dialog,
        show_loading
    })

</script>

<style lang="scss">
</style>