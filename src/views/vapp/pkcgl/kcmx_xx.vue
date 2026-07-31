<template>
    <!-- 库存明细表单 - App端 -->
    <div class="div_form_wrap">
        <div class="eo_form">
            <div class="cell eo_w100">
                <div class="label_n">批次</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_kcbh']" style="width:100%" readonly />
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">产品名称</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_cpmc']" style="width:100%" 
                    placeholder="请选择产品" readonly>
                    <template #append v-if="!props.readonly">
                        <el-button @click="onSelectProduct">
                            <el-icon><Search /></el-icon>
                        </el-button>
                    </template>
                </el-input>
                </div>
            </div>

            <div class="cell eo_w100">
                <div class="label_n">单件数量</div>
                <div class="input">
                    <el-input-number v-model="x_data_kcmx['f_kcsl']" style="width:100%"
                        :min="0" :max="999999" :precision="3" :step="1" />
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">成本单价</div>
                <div class="input">
                    <el-input-number v-model="x_data_kcmx['f_kcdj']" style="width:100%"
                        :min="0" :max="999999" :precision="3" :step="1" />
                </div>
            </div>

            <div class="cell eo_w100">
                <div class="label_n">入库时间</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_rksj_s']" style="width:100%" disabled />
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">出库时间</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_cksj_s']" style="width:100%" disabled />
                </div>
            </div>

            <div class="cell eo_w100">
                <div class="label_n">盘库时间</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_pksj_s']" style="width:100%" disabled />
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">库管员</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_kgy_id_s']" style="width:100%" disabled />
                </div>
            </div>

            <div class="cell eo_w100">
                <div class="label_n">仓库</div>
                <div class="input">
                    <vdic style="width:100%" dic="产品仓库" :all="false" field="value"
                        v-model="x_data_kcmx['f_hwck']" />
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">调拨状态</div>
                <div class="input">
                    <vdic style="width:100%" dic="调拨状态" :all="false" field="value"
                        v-model="x_data_kcmx['f_jyzt']" :disabled="true" />
                </div>
            </div>

            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_kcmx['f_beizhu']" style="width:100%"
                        maxlength="200" placeholder="请输入备注" />
                </div>
            </div>

            <div class="button" v-if="!props.readonly">
                <el-button class="ap_button" type="primary" @click="onButtonClick_Upd">保存</el-button>
            </div>
            <div class="button" v-if="!(props.readonly || x_is_add)">
                <el-button class="ap_button" @click="onButtonClick_kcmx_cf">拆分</el-button>
            </div>
            <div class="button" v-if="!(props.readonly || x_is_add)">
                <el-button class="ap_button" type="danger" @click="onButtonClick_Del">移除</el-button>
            </div>
        </div>
    </div>

    <!-- 拆分对话框 -->
    <kcmx_cf ref="v_kcmx_cf" @close="onDialogClose_kcmx_cf" />
    <!-- 产品选择对话框 -->
    <cpdy_list ref="v_cpdy_list" @close="onDialogClose_cpdy_list" />
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { Search } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";
    import vdic from "@/components/vdic.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import kcmx_cf from "./kcmx_cf.vue"
    import cpdy_list from "./cpdy_list.vue"

    const props = defineProps<{
        readonly?: boolean
    }>();

    const emits = defineEmits<{
        update: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    const v_kcmx_cf = ref<InstanceType<typeof kcmx_cf>>();
    const v_cpdy_list = ref<InstanceType<typeof cpdy_list>>();

    // 表单数据
    const x_data_kcmx: any = reactive({});

    const x_is_add = ref(false);

    /**
     * 加载数据
     */
    const loadData = (data: any) => {

        // 格式化
        data["f_jyzt_s"] = eodic.get_dic_label("调拨状态", data["f_jyzt"]);
        data["f_rksj_s"] = eolib.datetime_2_short(data["f_rksj"], true);
        data["f_pksj_s"] = eolib.datetime_2_short(data["f_pksj"], true);
        data["f_cksj_s"] = eolib.datetime_2_short(data["f_cksj"]);
        data["f_kcdj_s"] = eolib.fixed_num(data["f_kcdj"], 3);
        data["f_hwck_s"] = eodic.get_dic_label("产品仓库", data["f_hwck"]);

        x_is_add.value = !eocore.check_id(data, "f_kcmx_id");

        Object.assign(x_data_kcmx, data);
    }

    const getData = () => {
        return x_data_kcmx;
    }


    const onButtonClick_Upd = async () => {

        const data = x_data_kcmx;

        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_info("缺少产品信息");
            return undefined;
        }

        const kcsl = eocore.to_int(data["f_kcsl"]);
        if (kcsl <= 0) {
            eocore.show_info("请输入单件数量");
            return undefined;
        }

        let dataNew: any;
        const dataListNew: any[] = [];
        const isAdd = !eocore.check_id(data, "f_kcmx_id");

        if (isAdd) {
            const kgyId = TGlobal.userData["f_user_id"];
            const rksl = eocore.to_int(data["rksl"] ?? 1);
            if (rksl <= 0) { data["rksl"] = 1; }

            for (let i = 0; i < rksl; i++) {
                data["f_kcbh"] = await TLogic.netLoad_RecordString_kcbh(
                    data["f_cpdy_id"], data["f_cpbm"]);
                dataNew = await TLogic.netLoad_kcmx_upd(
                    0, 0,
                    data["f_cpdy_id"],
                    data["f_kcbh"],
                    data["f_rklb"],
                    data["f_rkid"],
                    data["f_hwck"],
                    data["f_kcdj"],
                    data["f_kcsl"],
                    kgyId,
                    data["f_beizhu"],
                    data["f_kcbz"],
                );
                dataListNew.push(dataNew);
            }
        } else {
            dataNew = await TLogic.netLoad_kcmx_upd(
                data["f_kcmx_id"],
                data["f_kcmx_pid"],
                data["f_cpdy_id"],
                data["f_kcbh"],
                data["f_rklb"],
                data["f_rkid"],
                data["f_hwck"],
                data["f_kcdj"],
                data["f_kcsl"],
                data["f_kgy_id"],
                data["f_beizhu"],
                data["f_kcbz"],
            );
            if (dataNew == undefined) return undefined;
            dataListNew.push(dataNew);
        }

        // 回写新数据
        if (dataNew) Object.assign(x_data_kcmx, dataNew);

        emits("update", false, x_data_kcmx, (result: boolean) => {
        });

        eocore.show_success("保存成功");
    }

    // ==================== 拆分 ====================
    const onButtonClick_kcmx_cf = () => {
        const kcsl = eocore.to_int(x_data_kcmx["f_kcsl"]);
        if (kcsl <= 1) {
            eocore.show_info("单件数量不足，无法拆分");
            return;
        }
        x_data_kcmx["f_kcsl1"] = kcsl - 1;
        x_data_kcmx["f_kcsl2"] = 1;
        v_kcmx_cf.value?.showDialog(x_data_kcmx);
    }

    const onDialogClose_kcmx_cf = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) { cb(true); return; }

        const kcsl = eocore.to_int(data0["f_kcsl"]);
        const kcsl2 = eocore.to_int(data0["f_kcsl2"]);
        if (kcsl2 <= 0 || kcsl2 >= kcsl) {
            eocore.show_info("请输入正确的分出数量");
            cb(false); return;
        }

        const kgyId = TGlobal.userData["f_user_id"];
        const retData = await TLogic.netLoad_kcmx_cf(kgyId, data0, kcsl2);
        if (retData == undefined) { cb(false); return; }

        // 回写原记录（数量减少后）
        Object.assign(x_data_kcmx, retData.dataNew1);

        eocore.show_success("拆分成功，新批次：" + retData.dataNew2["f_kcbh"]);
        cb(true);
    }

    // ==================== 移除 ====================
    const onButtonClick_Del = async () => {
        const ret = await eocore.show_confirm(
            "是否移除库存货物 " + x_data_kcmx["f_kcbh"] + "？一旦操作将造成不可预知的错误");
        if (!ret) return;

        const dataNew = await TLogic.netLoad_kcmx_upd(
            x_data_kcmx["f_kcmx_id"],
            0,
            x_data_kcmx["f_cpdy_id"],
            x_data_kcmx["f_kcbh"],
            "整理出库",
            0,
            x_data_kcmx["f_hwck"],
            x_data_kcmx["f_kcdj"],
            x_data_kcmx["f_kcsl"],
            TGlobal.userData["f_user_id"],
            x_data_kcmx["f_beizhu"],
            TLogic.kcbzCodes["历史"]
        );
        if (dataNew == undefined) return;

        Object.assign(x_data_kcmx, dataNew);
        eocore.show_success("已移除");
    }

    // ==================== 产品选择 ====================
    const onSelectProduct = () => {
        v_cpdy_list.value?.show_dialog({});
    }

    const onDialogClose_cpdy_list = (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        // 先取实际成本价，如果无则取定价
        let kcdj = eocore.to_float(data0["f_kcdj_s"]);
        if (kcdj <= 0.0) {
            kcdj = data0["f_cpjg"];
        }

        // 散装的产品打包入库，每包固定数量
        let cpsl = eocore.to_float(data0["f_bzsl"]);
        if (cpsl <= 0.0) {
            cpsl = 1.0;
        }

        // 更新产品信息
        x_data_kcmx["f_cpdy_id"] = data0["f_cpdy_id"];
        x_data_kcmx["f_cpmc"] = data0["f_cpmc"];
        x_data_kcmx["f_cpbm"] = data0["f_cpbm"];
        x_data_kcmx["f_kcdj"] = kcdj;
        x_data_kcmx["f_kcsl"] = cpsl;

        cb(true);
    }

    defineExpose({
        loadData,
        getData,
    });
</script>

<style lang="scss" scoped>
</style>
