<template>
    <!-- App端 流程对话框 -->
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
                    <span>{{ x_flow_title }}</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div v-loading="x_show_loading">
            <div class="eo_form">
                <div class="cell eo_w100">
                    <div class="input">
                        <el-input v-model="x_flow_process_data['f_text']" 
                            type="textarea" :rows="4"
                            placeholder="请输入描述信息..."
                            maxlength="500" show-word-limit
                            resize="none">
                        </el-input>
                    </div>
                </div>
                <div class="cell eo_w100">
                    <div class="label_n">附件</div>
                </div>
                <div class="cell eo_w100">
                    <div class="input">
                        <vfiles ref="v_files_flow"
                            :onLoading="onLoading_file"
                            :count="4" 
                            :type="x_file_type" 
                            :key-id="x_flow_process_data['f_flow_process_id']">
                        </vfiles>
                    </div>
                </div>
            </div>
            <div>
                <div class="ap_dialog_foot">
                    <div class="button">
                        <el-button type="default" class="eo_w100" @click="onButtonClick_Cancel">取消</el-button>
                    </div>
                    <div class="button">
                        <el-button type="primary" class="eo_w100" @click="onButtonClick_Ok">确定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">

    import type { cfunc_boolean } from "@/inc/eotypes";
    import { useVflowd } from "@/components/vflowd"

    import vfiles from "@/components/vfiles.vue"

    const emits = defineEmits<{
        (e: "open", tag: any): void
        (e: "close", cancel: boolean, tag: any, cb: cfunc_boolean): void
    }>()

    const {
        x_show_dialog,
        x_show_loading,
        x_flow_title,
        v_files_flow,
        x_file_type,
        x_flow_process_data,
        onLoading_file,
        show_dialog,
        onDialogOpened,
        onDialogClose,
        onButtonClick_Cancel,
        onButtonClick_Ok,
    } = useVflowd(emits)

    defineExpose({ show_dialog })

</script>

<style lang="scss">
</style>