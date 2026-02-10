<template>
    <el-dialog v-model="x_show_dialog" 
        :width="600"
        :show-close="false" 
        :align-center="true"
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>{{ x_flow_process_data['f_title'] }}</span>
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
                <div class="sv_dialog_foot">
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

    import { ref, reactive, nextTick } from "vue"
    import type {cfunc_boolean} from "@/inc/eotypes";
    
    import eocore from "@/inc/eocore"
    import eoflow from "@/inc/eoflow"

    import vfiles from "@/logic/common/vfiles.vue";
    import TLogic from "@/logic/TLogic";

    const emits = defineEmits<{
        (e: "open", tag: any): void
        (e: "close", cancel: boolean, tag: any, cb: cfunc_boolean): void
    }>()

    const x_show_dialog = ref(false);
    const x_show_loading = ref(false);

    const v_files_flow = ref<InstanceType<typeof vfiles>>();
    const x_file_type = ref(TLogic.fileTypes["系统_流程文件"]);

    /** 外挂数据  */
    let x_flow_process_data: any = reactive({ 
        f_flow_process_id: 0,
        f_flow_type_id: 0,
        f_flow_point_pid: 0,
        f_flow_point_id: 0,
        f_user_id: 0,
        f_user_id_s: "",
        f_title: "",
        f_text: "",
        f_data_id: 0,
        f_op_time: "1970-01-01 00:00:00",
        f_op_flag: eoflow.OP_FLAG_NORMAL,
        v_table: "",
        v_id_field: "",
        v_id_value: 0,
    });

    const onLoading_file = (bshow: boolean) => {
        x_show_loading.value = bshow;
    }

    const show_dialog = (data: any) => {

        v_files_flow.value?.clear_files();
        
        x_show_dialog.value = true;
        x_flow_process_data = reactive({...data});
    }

    const onDialogOpened = () => {
    }
    const onDialogClose = () => {
    }

    const onButtonClick_Cancel = () => {
        emits("close", true, x_flow_process_data, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }
    const onButtonClick_Ok = async () => {

        x_show_loading.value = true;
        // 先添加流程实例
        let ret = await eocore.post("/framework/flow/process/upd", [x_flow_process_data]);
        let data = eocore.check_net_object(ret);
        x_flow_process_data = reactive({...data});

        // 关联附件
        await v_files_flow.value?.update_key_id(x_flow_process_data["f_flow_process_id"]);

        emits("close", false, x_flow_process_data, (result: boolean) => {
            x_show_loading.value = false;
            x_show_dialog.value = !result;
        });
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>