<template>
    <!-- 流程节点信息 -->
    <vdialog ref="v_dialog"
        width="500px" title="流程节点"        
        @close="onDialogClose">
        <div class="eo_form eo_w100">
            <div class="cell eo_w100">
                <div class="label_n">名称</div>
                <div class="input">
                    <el-input v-model="x_point_data['f_name']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">标题</div>
                <div class="input">
                    <el-input v-model="x_point_data['f_title']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">角色</div>
                <div class="input">
                    <role_input ref="v_role_input" v-model="x_point_data['f_role']" />
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">用户</div>
                <div class="input">
                    <el-input v-model="x_point_data['f_user']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_point_data['f_text']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
        </div>
    </vdialog>
</template>

<script setup lang="ts">

    import { ref, reactive, onMounted } from "vue"

    import eocore from "@/inc/eocore";

    import type {cfunc_boolean} from "@/inc/eotypes";

    import vdialog from "@/logic/common/vdialog.vue"
    import role_input from "@/views/platform/role_input.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_point_data: any = reactive({});

    onMounted(() => {
    });

    const show_dialog = (data: any) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        // 创建一个副本
        let dataNew = Object.assign({}, data);        
        x_point_data = reactive(dataNew);
    }

    const onDialogOpened = () => {
    }

    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        emits("close", cancel, x_point_data, (result: boolean) => {
            cb(result);
        });
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>