<template>
    <el-dialog v-model="x_show_dialog" 
        width="700px"
        :show-close="false" 
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>选择用户</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div v-loading="x_show_loading">
            <div style="height:300px;">
                <vtable ref="v_table_user" 
                    name="用户"
                    id-field="f_user_id" 
                    check="single" 
                    :on-item="onTableItem_user"
                    @loading="onTableLoading">
                    <el-table-column prop="f_name" label="姓名" width="120" />
                    <el-table-column prop="f_dept_id_s" label="部门" width="160" />
                    <el-table-column prop="f_phone" label="电话" width="180" />
                    <el-table-column />
                </vtable>
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

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    import type {ctree_node, cfunc_boolean} from "@/inc/eotypes";    

    import vtable from "@/components/web/vtable.vue"
    type t_table = InstanceType<typeof vtable>
    
    const x_show_loading = ref(false);

    const v_table_user = ref<t_table>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_show_dialog = ref(false);

    const show_dialog = async (data: any) => {
        v_table_user.value?.load_list([]);
        x_show_dialog.value = true;
    }

    const onDialogOpened = async () => {
        await v_table_user.value?.load_list_net("/framework/user/query", {
            "login_id": "",
            "name": "",
            "phone": "",
        });
    }
    const onDialogClose = () => {
    }
    const onButtonClick_Cancel = () => {
        emits("close", true, {}, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }
    const onButtonClick_Ok = () => {

        let list = v_table_user?.value?.get_check_list() || [];
        if (list.length <= 0) {
            eocore.show_info("请选择用户");
            return;
        }

        emits("close", false, list[0], (result: boolean) => {
            x_show_dialog.value = !result;
        });        
    }

    const onTableItem_user = (data: any) => {
    }

    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show;
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>