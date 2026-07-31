<template>
    <!-- 生产计划对话框 -->
    <vdialog ref="v_dialog" title="生产计划" okLabel="保存"
        @open="onDialogOpen" @close="onDialogClose">
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="eo_form">
                    <!-- 产品名称 -->
                    <div class="cell eo_w100">
                        <div class="label_n">产品名称<span style="color:red;">*</span></div>
                        <div class="input">
                            <el-input v-model="x_data_scd['f_cpmc']" style="width:100%"
                                placeholder="请选择产品" :readonly="true">
                                <template #append>
                                    <el-button :icon="More" @click="onInputOpen_cpdy" />
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <!-- 产品编码 -->
                    <div class="cell eo_w100">
                        <div class="label_n">产品编码</div>
                        <div class="input">
                            <el-input v-model="x_data_scd['f_cpbm']" style="width:100%"
                                maxlength="50" :disabled="true" />
                        </div>
                    </div>
                    <!-- 计划数量 -->
                    <div class="cell eo_w100">
                        <div class="label_n">计划数量</div>
                        <div class="input">
                            <el-input-number v-model="x_data_scd['f_jhsl']" style="width:100%"
                                :min="1" :max="99" :precision="0" :step="1" />
                        </div>
                    </div>
                    <!-- 计划日期 -->
                    <div class="cell eo_w100">
                        <div class="label_n">计划日期</div>
                        <div class="input">
                            <el-date-picker style="width:100%"
                                v-model="x_data_scd['f_jhsj']"
                                type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <!-- 备注 -->
                    <div class="cell eo_w100">
                        <div class="label_n">备注</div>
                        <div class="input">
                            <el-input v-model="x_data_scd['f_beizhu']" style="width:100%"
                                maxlength="100" placeholder="请输入备注" type="textarea" :rows="3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </vdialog>
    <!-- 产品选择弹窗 -->
    <cpdy_list ref="v_cpdy_list" @close="onListSelect_cpdy" />
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import vdialog from "@/components/app/vdialog.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import cpdy_list from "@/views/vapp/pkcgl/cpdy_list.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();
    const v_cpdy_list = ref<InstanceType<typeof cpdy_list>>();

    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    let x_data_scd: any = reactive({});

    /**
     * 显示对话框
     */
    const show_dialog = async (data: any) => {
        v_dialog.value!.show_dialog(undefined);

        if (eocore.check_id(data, "f_sccp_id")) {
            // 编辑模式：加载已有数据
            v_dialog.value!.show_loading(true);
            const ret = await eocore.proc("p_sccp_get", { "v_sccp_id": data["f_sccp_id"] });
            v_dialog.value!.show_loading(false);
            const fullData = eocore.check_net_object(ret);
            if (fullData != undefined) {
                Object.assign(x_data_scd, fullData);
                return;
            }
        }

        // 新建模式：初始化默认数据
        let dt = new Date();
        dt.setDate(dt.getDate() + 3);

        Object.assign(x_data_scd, {
            f_sccp_id: 0,
            f_cpdy_id: 0,
            f_cpbm: "",
            f_cpmc: "",
            f_scy_id: TGlobal.userData["f_user_id"],
            f_jhsj: eolib.datetime_2_string(dt),
            f_jhsl: 1,
            f_dqsl: 0,
            f_wcsj: "2099-01-01 00:00:00",
            f_yxdj: 3,
            f_yxbz: 0,
            f_beizhu: ""
        });
    }

    const onDialogOpen = (data: any) => {
    }

    /**
     * 对话框关闭（保存/取消）
     */
    const onDialogClose = async (cancel: boolean, tag: any, cb: cfunc_boolean) => {
        if (cancel) {
            emit('close', true, {}, cb);
            return;
        }

        const data = x_data_scd;

        // 校验
        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_info("请选择产品");
            cb(false); return;
        }

        const jhsl = data["f_jhsl"];
        if (jhsl <= 0 || jhsl > 100) {
            eocore.show_info("请输入生产数量[1-99]");
            cb(false); return;
        }

        let dataList = [];
        for (let i = 0; i < jhsl; i++) {
            v_dialog.value!.show_loading(true);
            let ret = await eocore.proc(
                "p_sccp_upd", {
                    "v_sccp_id": data["f_sccp_id"],
                    "v_scy_id": data["f_scy_id"],
                    "v_kcmx_id": 0,
                    "v_cpdy_id": data["f_cpdy_id"],
                    "v_jhsj": data["f_jhsj"],
                    "v_jhsl": data["f_jhsl"],
                    "v_dqsl": data["f_dqsl"],
                    "v_wcsj": data["f_wcsj"],
                    "v_yxdj": data["f_yxdj"],
                    "v_yxbz": data["f_yxbz"],
                    "v_beizhu": data["f_beizhu"]
                });
            let dataNew = eocore.check_net_object(ret);
            v_dialog.value!.show_loading(false);

            if (dataNew == undefined) {
                cb(false); return;
            }
            dataList.push(dataNew);
        }

        eocore.show_info("保存成功");
        emit('close', false, dataList, cb);
    }

    const onInputOpen_cpdy = () => {
        v_cpdy_list.value?.show_dialog({});
    }

    const onListSelect_cpdy = (cancel: boolean, data: any, cb: any) => {
        if (cancel) {
            cb(true);
            return;
        }

        x_data_scd['f_cpdy_id'] = data['f_cpdy_id'];
        x_data_scd['f_cpmc'] = data['f_cpmc'];
        x_data_scd['f_cpbm'] = data['f_cpbm'];

        cb(true);
    }

    defineExpose({
        show_dialog
    });
</script>
