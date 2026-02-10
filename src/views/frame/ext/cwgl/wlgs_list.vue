<template>
    <el-dialog v-model="x_show_dialog" 
        width="900px"
        :show-close="false" 
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>选择物流公司</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div v-loading="x_show_loading">
            
            <!-- 物流公司表格 -->
            <div style="height:350px;">
                <vtable ref="v_table_wlgs" 
                    name="物流公司"
                    id-field="f_wlgs_id" 
                    check="single" 
                    :on-item="onTableItem_wlgs"
                    @loading="onTableLoading">
                    <el-table-column prop="f_gsmc" label="公司名称" width="200" show-overflow-tooltip />
                    <el-table-column prop="f_hzdj_s" label="合作等级" width="100" />
                    <el-table-column prop="f_lxr" label="联系人" width="120" show-overflow-tooltip />
                    <el-table-column prop="f_lxdh" label="联系电话" width="140" show-overflow-tooltip />
                    <el-table-column prop="f_gsdz" label="公司地址" width="200" show-overflow-tooltip />
                    <el-table-column prop="f_beizhu" label="备注" width="150" show-overflow-tooltip />
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
    import eodic from "@/inc/eodic";

    import type {ctree_node, cfunc_boolean} from "@/inc/eotypes";    

    import vtable from "@/logic/common/vtable.vue"
    type t_table = InstanceType<typeof vtable>
    
    const x_show_loading = ref(false);

    const v_table_wlgs = ref<t_table>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_show_dialog = ref(false);

    const show_dialog = async (data: any) => {

        v_table_wlgs.value?.load_list([]);
        x_show_dialog.value = true;
    }

    const onDialogOpened = async () => {
        // 加载物流公司数据
        v_table_wlgs.value?.load_list_proc("p_wlgs_list", {
            "v_wlgs_ids": ""
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
        let list = v_table_wlgs?.value?.get_check_list() || [];
        if (list.length <= 0) {
            eocore.show_info("请选择物流公司");
            return;
        }

        emits("close", false, list[0], (result: boolean) => {
            x_show_dialog.value = !result;
        });        
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_wlgs = (data: any) => {
        // 合作等级显示 - 使用get_dic_label方法
        data["f_hzdj_s"] = eodic.get_dic_label("合作等级", data["f_hzdj"]);
        
        // 日期格式化
        if (data["f_cjsj"]) {
            data["f_cjsj_s"] = eolib.datetime_2_string(data["f_cjsj"]);
        }
    }

    /**
     * 加载状态处理
     * @param show 是否显示加载状态
     */
    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show;
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>