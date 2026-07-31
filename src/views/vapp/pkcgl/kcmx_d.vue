<template>
    <!-- 库存明细 - 移动端 -->
    <vdialog ref="v_dialog"
        title="库存明细"
        @open="onDialogOpen"
        @close="onDialogClose">
        <el-tabs v-model="x_active_tab" type="card" class="ap_tabs">
            <el-tab-pane label="库存信息" name="cpxx">
                <div class="div_tab_body">
                    <kcmx_xx ref="v_kcmx_xx" :readonly="x_readonly" @update="onUpdate_kcmx_xx" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="调拨历史" name="jygl">
                <div class="div_tab_body">
                    <kcjy_list ref="v_kcjy_list" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </vdialog>
</template>

<script lang="ts" setup>

    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import vdialog from "@/components/app/vdialog.vue"
    import kcmx_xx from "./kcmx_xx.vue"
    import kcjy_list from "./kcjy_list.vue"

    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    const v_kcmx_xx = ref<InstanceType<typeof kcmx_xx>>();
    const v_kcjy_list = ref<InstanceType<typeof kcjy_list>>();

    const x_active_tab = ref("cpxx");
    const x_readonly = ref(true);

    let m_data: any = undefined;

    const showDialog = (data: any, readonly: boolean) => {
        m_data = data;
        x_readonly.value = readonly;
        v_dialog.value?.show_dialog(undefined);
    }

    const onDialogOpen = (data: any) => {
        if (m_data) {
            v_kcmx_xx.value?.loadData(m_data);
            v_kcjy_list.value?.loadData(m_data);
        }
    }

    const onDialogClose = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        emits("close", cancel, m_data, (result: boolean) => {
            cb(result);
        });
    }

    const onUpdate_kcmx_xx = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        v_dialog.value?.hide_dialog();
    }

    defineExpose({ showDialog });

</script>

<style lang="scss" scoped>
    .div_tab_body {
        padding: 0.6rem 0.8rem;
    }
</style>
