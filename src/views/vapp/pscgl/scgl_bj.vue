<template>
    <!-- 生产任务 - 部件清单对话框 -->
    <vdialog ref="v_dialog" title="生产任务" okLabel="关闭"
        @open="onDialogOpen" @close="onDialogClose">
        <div class="eo_col">
            <!-- 任务信息 -->
            <div class="div_info">
                <div class="row">
                    <span class="label">产品:</span>
                    <span class="value">{{ x_sccp_data.f_cpmc }}</span>
                    <span class="tag" v-if="x_sccp_data.f_yxbz == 0"
                        style="background:#409eff">进行中</span>
                    <span class="tag" v-else style="background:#67c23a">已完成</span>
                </div>
            </div>

            <!-- 部件清单卡片列表 -->
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                    <div class="ap_list">
                        <div v-if="x_data_list.length == 0 && !x_show_loading" class="empty">
                            暂无部件
                        </div>
                        <div v-for="item in x_data_list" :key="item.f_cpbj_id"
                            class="item">
                            <div class="body">
                                <div class="row">
                                    <span class="value title">{{ item.f_cpmc }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">部件数量</span>
                                    <span class="value">{{ item.f_bjsl }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">批次</span>
                                    <span class="value">{{ item.f_kcbh || '未指定' }}</span>
                                    <span class="label">库存数量</span>
                                    <span class="value">{{ item.f_kcsl }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">规格</span>
                                    <span class="value">{{ item.f_cpgg || '-' }}</span>
                                    <span class="label">尺寸</span>
                                    <span class="value">{{ item.f_cpcc || '-' }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">重量</span>
                                    <span class="value">{{ item.f_cpzl || '-' }}</span>
                                    <span class="label">单位</span>
                                    <span class="value">{{ item.f_cpdw || '-' }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">编码</span>
                                    <span class="value">{{ item.f_cpbm || '-' }}</span>
                                </div>
                                <div class="row">
                                    <span class="label">备注</span>
                                    <span class="value">{{ item.f_beizhu || '-' }}</span>
                                </div>
                            </div>
                            <div v-if="x_sccp_data.f_yxbz == 0" class="action" 
                                @click.stop="onButtonClick_Upd_scwl(item)">
                                <el-button type="primary" plain size="small">添加物料</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #button>
            <div class="button" v-if="x_sccp_data.f_yxbz == 0">
                <el-button type="primary" class="eo_w100" @click="onButtonClick_New_scwl">进行生产</el-button>
            </div>
        </template>
    </vdialog>

    <!-- 生产物料选择对话框 -->
    <scwl_list ref="v_scwl_list" @close="onDialogClose_scwl" />

    <!-- 生产结果对话框 -->
    <scdcp_xx ref="v_scdcp_xx" @close="onDialogClose_scdcp_xx" />
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import vdialog from "@/components/app/vdialog.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import scwl_list from "@/views/vapp/pscgl/scwl_list.vue"
    import scdcp_xx from "@/views/vweb/ext/tscgl/scdcp_xx.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    const v_scwl_list = ref<InstanceType<typeof scwl_list>>();
    const v_scdcp_xx = ref<InstanceType<typeof scdcp_xx>>();

    const emit = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 生产任务数据
    const x_sccp_data = ref<any>({});

    // 部件清单
    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);

    /**
     * 显示对话框
     */
    const show_dialog = (sccpData: any) => {
        
        Object.assign(x_sccp_data.value, {}, sccpData);
        v_dialog.value!.show_dialog(undefined);
    }

    const onDialogOpen = async (data: any) => {
        await netLoad_scbj_list();
    }

    /**
     * 对话框关闭
     */
    const onDialogClose = (cancel: boolean, tag: any, cb: cfunc_boolean) => {
        emit('close', cancel, x_sccp_data.value, cb);
    }

    /**
     * 加载部件清单
     */
    const netLoad_scbj_list = async (): Promise<any[] | undefined> => {
        x_show_loading.value = true;

        const data = x_sccp_data.value;

        // 生产工艺
        let ret = await eocore.proc("p_cpbj_list", {
            "v_cpdy_pid": data["f_cpdy_id"]
        });
        let list1 = eocore.check_net_array(ret);
        if (list1 == undefined) {
            x_show_loading.value = false;
            return undefined;
        }

        // 生产部件
        ret = await eocore.proc("p_scbj_list", {
            "v_sccp_id": data["f_sccp_id"]
        });
        let list2 = eocore.check_net_array(ret);
        if (list2 == undefined) {
            x_show_loading.value = false;
            return undefined;
        }

        // 通过f_cpbj_id关联生产
        eolib.list_merge(list1, list2, "f_cpbj_id", "f_cpbj_id", {
            "f_sccp_id": data["f_sccp_id"],
            "f_scbj_id": 0,
            "f_kcmx_id": 0
        });

        // 库存批次
        const ids = list2.filter(x => x["f_kcmx_id"] > 0).map(x => x["f_kcmx_id"]).join(",");
        if (ids.length > 0) {
            ret = await eocore.proc("p_kcmx_ids", {
                "v_kcmx_ids": ids
            });
            let list3 = eocore.check_net_array(ret);
            if (list3 != undefined) {
                eolib.list_merge(list1, list3, "f_kcmx_id", "f_kcmx_id", {
                    "f_kcbh": "",
                    "f_kcsl": 0,
                    "f_kcdj": 0.0,
                    "f_hwck": 0,
                    "f_beizhu": ""
                });
            }
        }

        x_show_loading.value = false;
        x_data_list.value = list1;
        return list1;
    }

    /**
     * 添加物料
     */
    const onButtonClick_Upd_scwl = (item: any) => {
        v_scwl_list.value?.show_dialog(item);
    }

    /**
     * 物料选择完成
     */
    const onDialogClose_scwl = async (cancel: boolean, data: any, cb: (result: boolean) => void) => {
        if (cancel) {
            cb(true); return;
        }

        const cpbjData = x_data_list.value.find(d => d["f_cpdy_id"] == data["f_cpdy_id"]);
        console.log(cpbjData, x_data_list.value, data);
        if (!cpbjData) {
            cb(true); return;
        }

        x_show_loading.value = true;
        let ret = await eocore.proc("p_scbj_upd", {
            "v_scbj_id": cpbjData["f_scbj_id"],
            "v_sccp_id": cpbjData["f_sccp_id"],
            "v_cpbj_id": cpbjData["f_cpbj_id"],
            "v_kcmx_id": data["f_kcmx_id"],
            "v_scbz": 0,
            "v_beizhu": "",
        });
        let dataNew = eocore.check_net_object(ret);
        x_show_loading.value = false;
        if (dataNew == undefined) {
            cb(false); return;
        }

        Object.assign(cpbjData, cpbjData, dataNew);

        // 重新加载部件清单以刷新库存信息
        await netLoad_scbj_list();
        cb(true);
    }

    /**
     * 进行生产
     */
    const onButtonClick_New_scwl = async () => {

        const data = x_sccp_data.value;
        if (data["f_kcmx_id"] > 0) {
            eocore.show_info("当前批次的生产已经完成，请勿重复生产");
            return;
        }

        let det = await eocore.show_confirm("确定要进行生产 " + data["f_cpmc"] + " 吗？");
        if (!det) return;

        x_show_loading.value = true;
        const ret = await netLoad_scjg();
        x_show_loading.value = false;
        if (ret == undefined) return;

        // 弹出显示生产结果
        v_scdcp_xx.value?.showDialog(data);
    }

    /**
     * 生产加工
     */
    const netLoad_scjg = async (): Promise<any> => {

        const data = x_sccp_data.value;

        // 重新加载部件清单
        const scwlList = await netLoad_scbj_list();
        if (scwlList == undefined) return undefined;

        let cpzj = 0;
        for (let d of scwlList) {
            if (!eocore.check_id(d, "f_kcmx_id")) {
                eocore.show_info("未指定生产物料");
                return undefined;
            }

            const bjsl = d["f_bjsl"];
            const kcsl = d["f_kcsl"];
            if (kcsl < bjsl) {
                eocore.show_info("数量不足");
                return undefined;
            }

            const cpdj = eocore.to_float(d["f_kcdj"]);
            cpzj += bjsl * cpdj;
        }

        let scyId = TGlobal.userData["f_user_id"];

        let bzsl = data["f_bzsl"];
        if (bzsl <= 0) bzsl = 1;

        // 创建一个新的批号的货物
        let kcbh = await TLogic.netLoad_RecordString_kcbh(
            data["f_cpdy_id"], data["f_cpbm"]);
        let dataNew = await TLogic.netLoad_kcmx_upd(
            0,
            0,
            data["f_cpdy_id"],
            kcbh,
            "生产入库",
            data["f_sccp_id"],
            0,
            cpzj / bzsl,
            bzsl,
            scyId,
            data["f_beizhu"],
            TLogic.kcbzCodes["临时"]
        );
        if (dataNew == undefined) return undefined;

        Object.assign(data, data, dataNew);

        let dt = new Date();

        // 修改生产任务批次
        let ret = await eocore.proc(
            "p_sccp_upd", {
                "v_sccp_id": data["f_sccp_id"],
                "v_scy_id": scyId,
                "v_kcmx_id": dataNew["f_kcmx_id"],
                "v_cpdy_id": data["f_cpdy_id"],
                "v_jhsj": data["f_jhsj"],
                "v_jhsl": data["f_jhsl"],
                "v_dqsl": bzsl,
                "v_wcsj": eolib.datetime_2_string(dt),
                "v_yxdj": data["f_yxdj"],
                "v_yxbz": 1,
                "v_beizhu": data["f_beizhu"]
            });
        dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) return undefined;

        let data2: any;
        // 移除使用的部件物料
        for (let d of scwlList) {
            const bjsl = d["f_bjsl"];
            const kcsl = d["f_kcsl"];
            const sysl = kcsl - bjsl;

            if (sysl > 0) {
                const retData = await TLogic.netLoad_kcmx_cf(scyId, d, bjsl);
                if (retData == undefined) return undefined;

                const data1 = retData.dataNew1;

                ret = await eocore.proc(
                    "p_kcjy_upd", {
                        "v_kcjy_id": 0,
                        "v_kcmx_id": data1["f_kcmx_id"],
                        "v_cpdy_id": data1["f_cpdy_id"],
                        "v_jyyg_id": scyId,
                        "v_jyzt": 1,
                        "v_kgy_id": scyId,
                        "v_beizhu": ""
                    });
                eocore.check_net_object(ret);

                data2 = retData.dataNew2;
            } else {
                data2 = d;
            }

            let dataNew2 = await TLogic.netLoad_kcmx_upd(
                data2["f_kcmx_id"],
                0,
                data2["f_cpdy_id"],
                data2["f_kcbh"],
                "生产出库",
                data["f_sccp_id"],
                data2["f_hwck"],
                data2["f_kcdj"],
                data2["f_kcsl"],
                scyId,
                data2["f_beizhu"],
                TLogic.kcbzCodes["历史"]
            );
            if (dataNew2 == undefined) return undefined;

            ret = await eocore.proc("p_scbj_upd", {
                "v_scbj_id": d["f_scbj_id"],
                "v_sccp_id": d["f_sccp_id"],
                "v_cpbj_id": d["f_cpbj_id"],
                "v_kcmx_id": data2["f_kcmx_id"],
                "v_scbz": 1,
                "v_beizhu": "",
            });
            dataNew2 = eocore.check_net_object(ret);
            if (dataNew2 == undefined) return undefined;
        }

        return data;
    }

    /**
     * 生产结果对话框关闭
     */
    const onDialogClose_scdcp_xx = async (cancel: boolean, data: any, cb: (result: boolean) => void) => {
        if (cancel) {
            cb(true); return;
        }

        // 生产成功，标识改为正常
        x_show_loading.value = true;
        const ret = await eocore.proc("p_kcmx_kcbz", {
            "v_kcmx_ids": "" + data["f_kcmx_id"],
            "v_cpdy_ids": "" + data["f_cpdy_id"],
            "v_kcbz": TLogic.kcbzCodes["正常"]
        });
        eocore.check_net_object(ret);
        x_show_loading.value = false;

        // 关闭对话框并通知父组件
        cb(true);
        v_dialog.value?.hide_dialog();
    }

    defineExpose({
        show_dialog
    });
</script>

<style lang="scss" scoped>
    .div_info {
        padding: 0.5rem 0.8rem;
        background: #fff;
        border-bottom: 1px solid var(--eo_color_grey_light3);

        .row {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.9rem;

            .label {
                color: var(--eo_color_grey);
                flex-shrink: 0;
            }

            .value {
                font-weight: bold;
            }

            .tag {
                font-size: 0.65rem;
                color: #fff;
                padding: 0.05rem 0.4rem;
                border-radius: 0.25rem;
                margin-left: 0.5rem;
                flex-shrink: 0;
            }
        }
    }

    .div_search_bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.8rem;
        background: #fff;
        border-bottom: 1px solid var(--eo_color_grey_light3);
    }

    .action {
        display: flex;
        justify-content: flex-end;
        padding: 0.3rem 0 0 0;
    }
</style>
