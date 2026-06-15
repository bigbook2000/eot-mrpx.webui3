<template>
    <!-- 采购入库详情 - 路由页面 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="采购入库" />
            <div class="eo_col_f">
                <el-tabs v-model="x_active_tab" type="card" class="ap_tabs">
                    <el-tab-pane label="采购详情" name="info">
                        <cgd_xxxq ref="v_cgd_xxxq" :data="x_cgd_data" :cgd-id="x_cgd_id" 
                            @save="onSave" @cancel="onCancel" />
                    </el-tab-pane>
                    <el-tab-pane label="产品清单" name="cp">
                        <cgdcp :cgd-id="x_cgd_id" :cgdh="x_cgd_data['f_cgdh']"
                            :edit-mode="x_edit_mode" :field-array="x_field_array" />
                    </el-tab-pane>
                    <el-tab-pane label="入库明细" name="rk">
                        <cdgrk :cgd-id="x_cgd_id" />
                    </el-tab-pane>
                    <el-tab-pane label="流程节点" name="flow">
                        <vflow ref="v_flow" type="采购入库" :app="true" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_cggl_cgd_xx" }
</script>

<script lang="ts" setup>
    import { ref, reactive, onMounted, computed, nextTick } from "vue"

    import eocore from "@/inc/eocore"
    import eoflow from "@/inc/eoflow"

    import router from "@/router/index"
    import topbar from '@/views/vapp/comm/topbar.vue'

    import cgd_xxxq from "./cgd_xxxq.vue"
    import cgdcp from "./cgdcp.vue"
    import cdgrk from "./cdgrk.vue"
    import vflow from "@/components/app/vflow.vue"

    import TLogic from "@/logic/TLogic"
    import TGlobal from "@/logic/TGlobal"

    const v_flow = ref<InstanceType<typeof vflow>>();
    const v_cgd_xxxq = ref<InstanceType<typeof cgd_xxxq>>();

    const x_active_tab = ref("info");
    const x_show_loading = ref(false);
    const x_cgd_id = ref(0);
    let x_cgd_data: any = reactive({});

    // 编辑模式，根据流程节点确定：0只读，1新增/修改，2变更
    const x_edit_mode = computed(() => {
        if (x_cgd_id.value <= 0) return 1;
        const flowType = eoflow.get_type_by_name("采购入库");
        if (!flowType) return 0;
        const pointId = x_cgd_data["f_flow_point_id"];
        const firstPoint = flowType.points[0];
        if (!firstPoint) return 0;
        if (pointId == firstPoint.flow_point_id) return 1;
        const curPoint = flowType.points.find(p => p.flow_point_id == pointId);
        if (curPoint && (curPoint.name === "待审核" || curPoint.name === "已审核")) return 2;
        return 0;
    });
    const x_field_array = computed(() => {
        if (x_edit_mode.value == 0) return [] as string[];
        return ["*"] as string[];
    });

    // setup 阶段读取 history.state，确保数据在子组件挂载前就绪
    const state = history.state as any;
    if (state?.cgdData) {
        Object.assign(x_cgd_data, state.cgdData);
        x_cgd_id.value = eocore.to_int(x_cgd_data["f_cgd_id"]);
    }

    onMounted(async () => {
        if (x_cgd_id.value > 0) {
            await v_flow.value?.load_List(x_cgd_id.value);
        }
        nextTick(() => {
            v_cgd_xxxq.value?.initFlow(v_flow.value);
        });
    });

    const onSave = async (data: any) => {

        if (!eocore.check_id(data, "f_gys_id")) {
            eocore.show_info("请选择供应商");
            return;
        }

        const isAdd = !eocore.check_id(data, "f_cgd_id");

        if (isAdd) {
            const cgdh = await TLogic.netLoad_RecordString("采购入库单号", "CG", "yyMMdd", 6);
            if (eocore.check_empty(cgdh)) {
                eocore.show_info("生成入库单号失败");
                return;
            }
            data["f_cgdh"] = cgdh;
        } else {
            const flowType = eoflow.get_type_by_name("采购入库");
            if (flowType) {
                const firstPoint = flowType.points[0];
                if (firstPoint && data["f_flow_point_id"] != firstPoint.flow_point_id) {
                    eocore.show_info("入库单已提交，无法修改");
                    return;
                }
            }
        }

        x_show_loading.value = true;
        const ret = await eocore.proc("p_cgd_upd", {
            "v_cgd_id": data["f_cgd_id"] ?? 0,
            "v_cgdh": data["f_cgdh"] ?? "",
            "v_gys_id": data["f_gys_id"] ?? 0,
            "v_gys_id_s": data["f_gys_id_s"] ?? "",
            "v_cgy_id": data["f_cgy_id"] ?? 0,
            "v_cgy_id_s": data["f_cgy_id_s"] ?? "",
            "v_cgjh_id": data["f_cgjh_id"] ?? 0,
            "v_cgjhdh": data["f_cgjhdh"] ?? "",
            "v_lxr": data["f_lxr"] ?? "",
            "v_lxdh": data["f_lxdh"] ?? "",
            "v_wlgs_id": data["f_wlgs_id"] ?? 0,
            "v_wlgs_id_s": data["f_wlgs_id_s"] ?? "",
            "v_wldh": data["f_wldh"] ?? "",
            "v_shr_id": data["f_shr_id"] ?? 0,
            "v_shr_id_s": data["f_shr_id_s"] ?? "",
            "v_fklb": data["f_fklb"] ?? 1,
            "v_zje": data["f_zje"] ?? 0,
            "v_sfje": data["f_sfje"] ?? 0,
            "v_shsj": data["f_shsj"] ?? "",
            "v_yxbz": data["f_yxbz"] ?? 1,
            "v_beizhu": data["f_beizhu"] ?? ""
        });
        const dataNew = eocore.check_net_object(ret);
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        if (isAdd) {
            v_flow.value?.clear_list(dataNew["f_cgd_id"]);
            const processData = await v_flow.value?.process_add_data(dataNew["f_cgd_id"], "-");
            if (processData != undefined) {
                dataNew["f_flow_point_id"] = processData["f_flow_point_id"];
                dataNew["f_flow_process_id"] = processData["f_flow_process_id"];
            }
            x_cgd_id.value = eocore.to_int(dataNew["f_cgd_id"]);
        }

        Object.assign(x_cgd_data, dataNew);
        if (!isAdd) {
            v_cgd_xxxq.value?.updateFlowStatus();
        }
        eocore.show_success("保存成功");
    }

    const onCancel = () => {
        router.back();
    }
</script>
