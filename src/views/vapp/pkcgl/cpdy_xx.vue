<template>
    <!-- 产品编辑对话框 - App端 -->
    <vdialog ref="v_dialog"
        title="产品定义"
        @open="onDialogOpen"
        @close="onDialogClose">
        <el-tabs v-model="x_active_tab" type="card" class="ap_tabs">
            <!-- 产品信息 Tab -->
            <el-tab-pane label="产品信息" name="info">
                <cpdy_xxxq
                    :cpdy-data="x_cpdy_data"
                    :cpdl-list="x_cpdl_list"
                    :cpxl-list="x_cpxl_list"
                    @select-cpdl="onSelectChange_cpdl" />
            </el-tab-pane>

            <!-- 部件清单 Tab -->
            <el-tab-pane label="部件清单" name="bom">
                <cpdy_xxbj :cpdy-id="x_cpdy_data['f_cpdy_id']" />
            </el-tab-pane>
        </el-tabs>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import vdialog from "@/components/app/vdialog.vue"
    import cpdy_xxbj from "./cpdy_xxbj.vue"
    import cpdy_xxxq from "./cpdy_xxxq.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    const x_active_tab = ref("info");

    const x_cpdy_data: any = reactive({});
    const x_cpdl_list = ref<any[]>([]);
    const x_cpxl_list = ref<any[]>([]);

    let m_cplb_list: any[] = [];

    /**
     * 显示对话框
     */
    const showDialog = (data: any, cplbList: any[]) => {
        // 创建数据副本
        Object.assign(x_cpdy_data, data);
        m_cplb_list = cplbList;

        // 大类列表
        x_cpdl_list.value = m_cplb_list;

        // 根据当前大类过滤小类
        let cpdlId = eocore.to_int(x_cpdy_data["f_cpdl_id"]);
        if (cpdlId > 0) {
            for (let d of m_cplb_list) {
                if (d["value"] == cpdlId) {
                    x_cpxl_list.value = d.children;
                    break;
                }
            }
        } else {
            x_cpxl_list.value = [];
        }

        x_active_tab.value = "info";
        v_dialog.value?.show_dialog(undefined);
    }

    const onDialogOpen = (data: any) => {
    }

    const onSelectChange_cpdl = (value: any) => {
        for (let d of m_cplb_list) {
            if (d["value"] == value) {
                x_cpxl_list.value = d.children;
                break;
            }
        }
        x_cpdy_data['f_cpxl_id'] = 0;
    }

    /**
     * 对话框关闭事件
     */
    const onDialogClose = (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) {
            emits("close", true, x_cpdy_data, (result: boolean) => {
                cb(result);
            });
            return;
        }

        // 验证
        if (!x_cpdy_data["f_cpmc"]) {
            eocore.show_info("请输入产品名称");
            cb(false); return;
        }
        if (!x_cpdy_data["f_cpdl_id"] || !x_cpdy_data["f_cpxl_id"]) {
            eocore.show_info("请选择产品大类和小类");
            cb(false); return;
        }

        emits("close", false, x_cpdy_data, (result: boolean) => {
            cb(result);
        });
    }

    defineExpose({ showDialog });
</script>
