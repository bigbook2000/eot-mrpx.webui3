<template>
    <!-- 产品编辑对话框 - App端 -->
    <el-dialog v-model="x_visible" title="产品定义" fullscreen class="ap_dialog">
        <div class="div_dialog">
            <el-tabs v-model="x_active_tab" class="ap_tabs_fill">
                <!-- 产品信息 Tab -->
                <el-tab-pane label="产品信息" name="info">
                    <cpdy_xxxq
                        :cpdy-data="x_cpdy_data"
                        :cpdl-list="x_cpdl_list"
                        :cpxl-list="x_cpxl_list"
                        @select-cpdl="onSelectChange_cpdl"
                        @confirm="onConfirm"
                        @cancel="onCancel" />
                </el-tab-pane>

                <!-- 部件清单 Tab -->
                <el-tab-pane label="部件清单" name="bom">
                    <cpdy_xxbj :cpdy-id="x_cpdy_data['f_cpdy_id']" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import cpdy_xxbj from "./cpdy_xxbj.vue"
    import cpdy_xxxq from "./cpdy_xxxq.vue"

    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    const x_visible = ref(false);
    const x_active_tab = ref("info");

    let x_cpdy_data: any = reactive({});
    let m_cplb_list: any[] = [];

    let x_cpdl_list = ref<any[]>([]);
    let x_cpxl_list = ref<any[]>([]);

    /**
     * 显示对话框
     */
    const show_dialog = (data: any, cplbList: any[]) => {
        // 创建数据副本
        x_cpdy_data = reactive(Object.assign({}, data));
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

        x_visible.value = true;
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

    const onCancel = () => {
        x_visible.value = false;
        emit('close', true, x_cpdy_data, (result: boolean) => {});
    }

    const onConfirm = () => {
        // 验证
        if (!x_cpdy_data["f_cpmc"]) {
            eocore.show_info("请输入产品名称");
            return;
        }
        if (!x_cpdy_data["f_cpdl_id"] || !x_cpdy_data["f_cpxl_id"]) {
            eocore.show_info("请选择产品大类和小类");
            return;
        }

        x_visible.value = false;
        emit('close', false, x_cpdy_data, (result: boolean) => {});
    }

    defineExpose({ show_dialog });
</script>

<style lang="scss" scoped>
.div_dialog {
    height: 100%;
    overflow: hidden;
}
</style>
