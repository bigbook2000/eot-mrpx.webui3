<template>
    <el-dialog v-model="x_show_dialog" 
        :width="500"
        :show-close="false" 
        :align-center="true"
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>文件信息</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div v-loading="x_show_loading">
            <div class="eo_form">
                <div class="cell eo_w100">
                    <div class="label_n">文件</div>
                    <div class="input">
                        <vfile ref="v_file" :type="fileType" :key-id="x_key_id" :index="0"
                            v-model="x_file_data['f_file_id']"
                            :onLoading="onLoading"
                            :onFileName="onFileName"></vfile>
                    </div>
                </div>
                <div class="cell eo_w100">
                    <div class="label_n">描述</div>
                    <div class="input">
                        <el-input v-model="x_file_data['f_note']" 
                            placeholder="请输入描述信息..." maxlength="5">
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

    const v_file = ref<InstanceType<typeof vfile>>();
    const x_key_id = ref(0);

    /** 外挂数据  */
    let x_file_data: any = reactive({ 
        f_file_id: 0,
        f_note: "",
    });

    const show_dialog = (keyId: number) => {

        // 新建
        x_file_data['f_file_id'] = 0;
        x_file_data['f_note'] = "";

        v_file.value?.clear_file();
        v_file.value?.update_key_id(keyId);

        x_show_dialog.value = true;
    }

    const onDialogOpened = () => {
    }
    const onDialogClose = () => {
    }

    const onButtonClick_Cancel = () => {
        emits("close", true, x_file_data, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }
    const onButtonClick_Ok = async () => {

        const fileId = x_file_data['f_file_id'];
        if (fileId == 0) {
            eocore.show_error('请先选择文件');
            return;
        }

        console.log("x_file_data: ", x_file_data);

        x_show_loading.value = true;
        const ret = await eocore.post("/framework/hdata/file/text", [
            x_file_data
        ]);
        const data = eocore.check_net_object(ret);
        if (data == undefined) {
            x_show_loading.value = false;
            return;
        }

        emits("close", false, x_file_data, (result: boolean) => {
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
        show_dialog
    })

</script>

<style lang="scss">
</style>