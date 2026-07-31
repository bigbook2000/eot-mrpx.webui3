<template>
    <!-- 物流公司选择列表 -->
    <vdialog ref="v_dialog"
        title="选择物流公司"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_col">
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0" class="empty">
                            暂无数据
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_wlgs_id"
                            class="item"
                            :class="{ 'ap_sel': x_selected_id == item.f_wlgs_id }"
                            @click="x_selected_id = item.f_wlgs_id">
                            <div class="body">
                                <div class="row">
                                    <span class="value title">{{ item.f_gsmc }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">合作等级</span>
                                    <span class="value">{{ item.f_hzdj_s }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">联系人</span>
                                    <span class="value">{{ item.f_lxr || '-' }}</span>
                                    <span class="label">联系电话</span>
                                    <span class="value">{{ item.f_lxdh || '-' }}</span>
                                </div>
                                <div class="row" v-if="item.f_gsdz">
                                    <span class="label">地址</span>
                                    <span class="value">{{ item.f_gsdz }}</span>
                                </div>
                                <div class="row" v-if="item.f_beizhu">
                                    <span class="label">备注</span>
                                    <span class="value">{{ item.f_beizhu }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import vdialog from "@/components/app/vdialog.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    const x_data_list = ref<any[]>([]);

    // 当前选中项ID
    const x_selected_id = ref(0);

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const show_dialog = async (data: any) => {
        x_selected_id.value = 0;
        x_data_list.value = [];

        v_dialog.value?.show_dialog(undefined);
    }

    const onDialogOpen = async () => {
        netLoad_wlgs_list();
    }

    /**
     * 格式化单条数据
     */
    const formatItem = (data: any) => {
        data["f_hzdj_s"] = eodic.get_dic_label("合作等级", data["f_hzdj"]);
    }

    /**
     * 加载物流公司列表
     */
    const netLoad_wlgs_list = async () => {
        v_dialog.value?.show_loading(true);
        let ret = await eocore.proc("p_wlgs_list", {
            "v_wlgs_ids": ""
        });
        let list = eocore.check_net_array(ret);
        v_dialog.value?.show_loading(false);
        if (list == undefined) list = [];

        // 格式化每条数据
        for (let d of list) {
            formatItem(d);
        }
        x_data_list.value = list;
    }

    /**
     * 对话框关闭事件
     */
    const onDialogClose = (cancel: boolean, tag: any, cb: cfunc_boolean) => {
        if (cancel) {
            emit('close', true, {}, cb);
            return;
        }

        // 获取选中的物流公司
        if (x_selected_id.value <= 0) {
            eocore.show_info("请选择物流公司");
            cb(false);
            return;
        }

        let selectedData = x_data_list.value.find(d => d.f_wlgs_id == x_selected_id.value);
        if (!selectedData) {
            eocore.show_info("未找到所选物流公司");
            cb(false);
            return;
        }

        emit('close', false, selectedData, cb);
    }

    // 暴露方法给父组件使用
    defineExpose({
        show_dialog
    });
</script>

<style lang="scss" scoped>
</style>
