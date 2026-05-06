<template>
    <!-- 文档资料 -->
    <el-dialog v-model="x_show_dialog" 
        :width="600"
        :show-close="false" 
        :align-center="true"
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <div v-loading="x_show_loading">
            <div class="eo_form">
                <div class="cell eo_w100">
                    <div class="label_n">描述</div>
                    <div class="input">
                        <el-input v-model="x_data_wdzl['f_wdms']" 
                            placeholder="请输入描述信息..."
                            maxlength="500">
                        </el-input>
                    </div>
                </div>
                <div class="cell eo_w100">
                    <div class="label_n">文件</div>
                    <div class="input">
                        <vfile ref="v_file_wdzl" :type="fileType" :index="0"
                            v-model="x_data_wdzl['f_file_id']"
                            :onLoading="onLoading"
                            :onFileName="onFileName">
                        </vfile>
                    </div>
                </div>

                <div class="cell eo_w2">
                    <div class="label_n">用户</div>
                    <div class="input">
                        <el-input v-model="x_data_wdzl['f_user_id_s']" disabled>
                        </el-input>
                    </div>
                </div>
                <div class="cell eo_w2">
                    <div class="label_n">时间</div>
                    <div class="input">
                        <el-input v-model="x_data_wdzl['f_xgsj_s']" disabled>
                        </el-input>
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

    import vfile from "@/logic/common/vfile.vue";
    import TLogic from "@/logic/TLogic";

    const props = defineProps<{
        fileType: string
    }>()

    const emits = defineEmits<{
        (e: "open", tag: any): void
        (e: "close", cancel: boolean, tag: any, cb: cfunc_boolean): void
    }>()

    const x_show_dialog = ref(false);
    const x_show_loading = ref(false);

    const v_file_wdzl = ref<InstanceType<typeof vfile>>();

    let x_data_wdzl: any = reactive({ 
        "f_type": "",
        "f_keyid": 0,
        "f_wdlx": "",
        "f_wdly": "",
        "f_wdms": "",
        "f_yxbz": 0,
        "f_user_id": 0,
        "f_user_id_s": "",
        "f_xgsj_s": "",
        "f_xgsj": "",
        "f_file_id": 0,
        "f_wdzl_id": 0,
    });


    const showDialog = (data: any) => {

        console.log("showDialog: ", data);

        v_file_wdzl.value?.clear_file();
        v_file_wdzl.value?.set_file(data["f_file_id"], data["f_name"]);
        
        x_show_dialog.value = true;
        x_data_wdzl = reactive({...data});
    }

    const onDialogOpened = () => {
    }
    const onDialogClose = () => {
    }

    const onButtonClick_Cancel = () => {
        emits("close", true, x_data_wdzl, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }
    const onButtonClick_Ok = async () => {

        if (!eocore.check_id(x_data_wdzl, "f_file_id")) {
            eocore.show_error('请先选择文件');
            return;
        }

        if (!eocore.check_len(x_data_wdzl["f_wdms"])) {
            eocore.show_error('请先输入描述');
            return;
        }

        x_show_loading.value = true;
        // 先添加流程实例
        let ret = await eocore.proc("p_wdzl_upd", {
            "v_wdzl_id": x_data_wdzl["f_wdzl_id"],
            "v_type": x_data_wdzl["f_type"],
            "v_keyid": x_data_wdzl["f_keyid"],
            "v_wdlx": x_data_wdzl["f_wdlx"],
            "v_wdms": x_data_wdzl["f_wdms"],
            "v_wdly": x_data_wdzl["f_wdly"],
            "v_yxbz": x_data_wdzl["f_yxbz"],
            "v_user_id": x_data_wdzl["f_user_id"],
        });
        let dataNew = eocore.check_net_object(ret);
        x_show_loading.value = false;

        if (dataNew == undefined) return;

        // 关联附件
        x_show_loading.value = true;
        const dataFile = await v_file_wdzl.value?.update_key_id(dataNew["f_wdzl_id"]);

        dataNew["f_file_id"] = dataFile["f_file_id"];
        dataNew["f_name"] = dataFile["f_name"];
        dataNew["f_type"] = dataFile["f_type"];
        dataNew["f_keyid"] = dataFile["f_keyid"];
        dataNew["f_index"] = dataFile["f_index"];
        dataNew["f_url_s"] = dataFile["f_url_s"];

        emits("close", false, dataNew, (result: boolean) => {
            x_show_loading.value = false;
            x_show_dialog.value = !result;
        });
    }
    const onLoading = (bshow: boolean) => {
        x_show_loading.value = bshow;
    }
    const onFileName = (fileName: string): string => {
        console.log("fileName: " + fileName);
        return fileName;
    }
    defineExpose({
        showDialog
    })

</script>

<style lang="scss">
</style>