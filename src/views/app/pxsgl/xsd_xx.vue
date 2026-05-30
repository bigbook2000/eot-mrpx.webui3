<template>
    <!-- 销售订单详情 - 路由页面 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="订单详情" />
            <div class="eo_col_f">
                <el-tabs v-model="x_active_tab" type="card" class="ap_tabs">
                    <el-tab-pane label="订单详情" name="info">
                        <xsd_xxxq ref="v_xsd_xxxq" :data="x_xsd_data" :xsd-id="x_xsd_id" 
                            @save="onSave" @cancel="onCancel" />
                    </el-tab-pane>
                    <el-tab-pane label="产品清单" name="cp">
                        <xsd_xxqd :xsd-id="x_xsd_id" :xsdh="x_xsd_data['f_xsdh']"
                            :edit-mode="x_edit_mode" :field-array="x_field_array" />
                    </el-tab-pane>
                    <el-tab-pane label="出库明细" name="ck">
                        <xsd_xxck :xsd-id="x_xsd_id" />
                    </el-tab-pane>
                    <el-tab-pane label="流程节点" name="flow">
                        <vflow ref="v_flow" type="销售出库" :app="true" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_xsgl_xsd_xx" }
</script>

<script lang="ts" setup>
    import { ref, reactive, onMounted, computed, nextTick } from "vue"

    import eocore from "@/inc/eocore"
    import eoflow from "@/inc/eoflow"

    import router from "@/router/index"
    import topbar from '@/views/app/comm/topbar.vue'

    import xsd_xxxq from "./xsd_xxxq.vue"
    import xsd_xxqd from "./xsd_xxqd.vue"
    import xsd_xxck from "./xsd_xxck.vue"
    import vflow from "@/components/app/vflow.vue"

    import TLogic from "@/logic/TLogic"
    import TGlobal from "@/logic/TGlobal"

    const v_flow = ref<InstanceType<typeof vflow>>();
    const v_xsd_xxxq = ref<InstanceType<typeof xsd_xxxq>>();

    const x_active_tab = ref("info");
    const x_show_loading = ref(false);
    const x_xsd_id = ref(0);
    let x_xsd_data: any = reactive({});

    // 编辑模式，根据流程节点确定：0只读，1新增/修改，2变更
    const x_edit_mode = computed(() => {
        if (x_xsd_id.value <= 0) return 1;
        const flowType = eoflow.get_type_by_name("销售出库");
        if (!flowType) return 0;
        const pointId = x_xsd_data["f_flow_point_id"];
        const firstPoint = flowType.points[0];
        if (!firstPoint) return 0;
        if (pointId == firstPoint.flow_point_id) return 1;
        // 查找当前节点名称
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
    if (state?.xsdData) {
        Object.assign(x_xsd_data, state.xsdData);
        x_xsd_id.value = eocore.to_int(x_xsd_data["f_xsd_id"]);
    }

    onMounted(async () => {
        // 加载流程数据（必须 await 确保流程历史就绪后再初始化流程按钮）
        if (x_xsd_id.value > 0) {
            await v_flow.value?.load_List(x_xsd_id.value);
        }
        // 将 vflow 实例交付给 xsd_xxxq 的流程按钮
        nextTick(() => {
            v_xsd_xxxq.value?.initFlow(v_flow.value);
        });
    });

    const onSave = async (data: any) => {

        if (!eocore.check_id(data, "f_khgl_id")) {
            eocore.show_info("请选择客户");
            return;
        }

        const isAdd = !eocore.check_id(data, "f_xsd_id");

        if (isAdd) {
            // 新增：生成销售订单号
            const xsdh = await TLogic.netLoad_RecordString("销售出库单号", "XS", "yyMMdd", 6);
            if (eocore.check_empty(xsdh)) {
                eocore.show_info("生成订单号失败");
                return;
            }
            data["f_xsdh"] = xsdh;
        } else {
            // 编辑：检查流程状态
            const flowType = eoflow.get_type_by_name("销售出库");
            if (flowType) {
                const firstPoint = flowType.points[0];
                if (firstPoint && data["f_flow_point_id"] != firstPoint.flow_point_id) {
                    eocore.show_info("订单已提交，无法修改");
                    return;
                }
            }
        }

        x_show_loading.value = true;
        const ret = await eocore.proc("p_xsd_upd", {
            "v_xsd_id": data["f_xsd_id"] ?? 0,
            "v_xsy_id": data["f_xsy_id"] ?? 0,
            "v_xsdh": data["f_xsdh"] ?? "",
            "v_khgl_id": data["f_khgl_id"] ?? 0,
            "v_xsjh_id": data["f_xsjh_id"] ?? 0,
            "v_lxr": data["f_lxr"] ?? "",
            "v_lxdh": data["f_lxdh"] ?? "",
            "v_lxdz": data["f_lxdz"] ?? "",
            "v_fklb": data["f_fklb"] ?? 1,
            "v_xsje": data["f_xsje"] ?? 0,
            "v_ssje": data["f_ssje"] ?? 0,
            "v_fhy_id": data["f_fhy_id"] ?? 0,
            "v_fhsj": data["f_fhsj"] ?? "",
            "v_yxbz": data["f_yxbz"] ?? 1,
            "v_beizhu": data["f_beizhu"] ?? ""
        });
        const dataNew = eocore.check_net_object(ret);
        x_show_loading.value = false;
        if (dataNew == undefined) return;

        if (isAdd) {
            // 新增：创建流程节点
            v_flow.value?.clear_list(dataNew["f_xsd_id"]);
            const processData = await v_flow.value?.process_add_data(dataNew["f_xsd_id"], "-");
            if (processData != undefined) {
                dataNew["f_flow_point_id"] = processData["f_flow_point_id"];
                dataNew["f_flow_process_id"] = processData["f_flow_process_id"];
            }
            // 更新 xsd_id 以便产品清单/出库明细/流程节点 tab 可加载
            x_xsd_id.value = eocore.to_int(dataNew["f_xsd_id"]);
        }

        Object.assign(x_xsd_data, dataNew);
        if (!isAdd) {
            v_xsd_xxxq.value?.updateFlowStatus();
        }
        eocore.show_success("保存成功");
    }

    const onCancel = () => {
        router.back();
    }
</script>
