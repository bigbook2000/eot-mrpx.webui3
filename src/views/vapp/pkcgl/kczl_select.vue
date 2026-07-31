<template>
    <!-- 库存整理 - 已选择列表 -->
    <vdialog ref="v_dialog"
        title="已选择库存"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="ap_list">
            <div v-if="x_list.length === 0" class="empty">
                暂无选择
            </div>
            <div v-for="item in x_list" :key="item.f_kcmx_id"
                class="item">
                <div class="body">
                    <div class="row">
                        <span class="label">批次</span>
                        <span class="value title">{{ item.f_kcbh }}</span>
                        <span v-if="item.f_jyzt != 0" class="div_tag">{{ item.f_jyzt_s }}</span>
                    </div>
                    <div class="row">
                        <span class="label">名称</span>
                        <span class="value">{{ item.f_cpmc }}</span>
                    </div>
                    <div class="row">
                        <span class="label">单价</span>
                        <span class="value">{{ item.f_kcdj_s }}</span>
                        <span class="label">数量</span>
                        <span class="value">{{ item.f_kcsl }}</span>
                    </div>
                    <div class="row">
                        <span class="label">规格</span>
                        <span class="value">{{ item.f_cpgg || '-' }}</span>
                    </div>
                    <div class="row">
                        <span class="label">尺寸</span>
                        <span class="value">{{ item.f_cpcc || '-' }}</span>
                        <span class="label">重量</span>
                        <span class="value">{{ item.f_cpzl || '-' }}</span>
                    </div>
                </div>
            </div>
        </div>
        <template #button>
            <div class="button" v-if="x_list.length > 0">
                <el-button class="ap_button" type="default" 
                    @click="onButtonClick_Upd_kchb">合并</el-button>
            </div>
            <div class="button" v-if="x_list.length > 0">
                <el-button class="ap_button" type="default" 
                    @click="onButtonClick_Upd_kcjy">调拨</el-button>
            </div>
        </template>
    </vdialog>
    <kcmx_d ref="v_kcmx_d" @close="onDialogClose_kcmx_d" />
    <kcjy_xx ref="v_kcjy_xx" @close="onDialogClose_kcjy_xx" />
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import vdialog from "@/components/app/vdialog.vue"

    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    import kcmx_d from "./kcmx_d.vue"
    import kcjy_xx from "./kcjy_xx.vue"

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    type t_kcmx_d = InstanceType<typeof kcmx_d>;
    const v_kcmx_d = ref<t_kcmx_d>();

    type t_kcjy_xx = InstanceType<typeof kcjy_xx>;
    const v_kcjy_xx = ref<t_kcjy_xx>();

    const x_list = ref<any[]>([]);

    const showDialog = (list: any[]) => {
        x_list.value = list;
        v_dialog.value?.show_dialog(undefined);
    }

    const onDialogOpen = (data: any) => {
        // 对话框打开时的操作
    }

    const onDialogClose = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        emits("close", cancel, x_list.value, (result: boolean) => {
            cb(result);
        });
    }

    /**
     * 库存合并
     */
    const onButtonClick_Upd_kchb = async () => {
        if (x_list.value.length <= 1) {
            eocore.show_info("请选择至少两个库存进行合并");
            return;
        }

        const data0 = x_list.value[0];
        const ret = await eocore.show_confirm(
            "确信要将 " + x_list.value.length + " 件 " + data0["f_cpmc"] + " 合并吗？"
        );
        if (!ret) return;

        const kgyId = TGlobal.userData["f_user_id"];
        const dataAdd = await TLogic.netLoad_kcmx_hb(kgyId, x_list.value);
        if (dataAdd == undefined) return;

        v_kcmx_d.value?.showDialog(dataAdd, true);
    }

    const onButtonClick_Upd_kcjy = () => {
        v_kcjy_xx.value?.showDialog(x_list.value, undefined);
    }

    /**
     * kcmx_d 对话框关闭
     */
    const onDialogClose_kcmx_d = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        cb(true);

        v_dialog.value?.hide_dialog();
    }

    /**
     * kcjy_xx 调拨对话框关闭
     */
    const onDialogClose_kcjy_xx = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        emits("close", cancel, x_list.value, (result: boolean) => {
            cb(result);
        });
    }

    defineExpose({ showDialog });
</script>

<style lang="scss" scoped>
    .div_tag {
        flex: 0 0 auto;
        font-size: 0.9rem;
        color: #fff;
        background: var(--eo_color_main);
        padding: 0.1rem 0.4rem;
        border-radius: 0.3rem;
        margin-left: 0.5rem;
    }
</style>
