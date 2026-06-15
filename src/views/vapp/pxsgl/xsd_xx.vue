<template>
    <!-- 销售订单详情 - 路由页面 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="订单详情" />
            <div class="eo_col_f">
                <el-tabs v-model="x_active_tab" type="card" class="ap_tabs"
                    @tab-click="onTabClick">
                    <el-tab-pane label="订单详情" name="xq">
                        <xsd_xxxq ref="v_xsd_xxxq" @update="onUpdate_xsdxq" />
                    </el-tab-pane>
                    <el-tab-pane label="产品清单" name="qd">
                        <xsd_xxqd ref="v_xsd_xxqd" />
                    </el-tab-pane>
                    <el-tab-pane label="出库明细" name="ck">
                        <xsd_xxck ref="v_xsd_xxck" />
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
    import eolib from "@/inc/eolib"    
    import eoflow from "@/inc/eoflow"

    import router from "@/router/index"
    import topbar from '@/views/vapp/comm/topbar.vue'

    import xsd_xxxq from "./xsd_xxxq.vue"
    import xsd_xxqd from "./xsd_xxqd.vue"
    import xsd_xxck from "./xsd_xxck.vue"
    import vflow from "@/components/app/vflow.vue"

    import TLogic from "@/logic/TLogic"
    import TGlobal from "@/logic/TGlobal"

    const v_flow = ref<InstanceType<typeof vflow>>();
    const v_xsd_xxxq = ref<InstanceType<typeof xsd_xxxq>>();
    const v_xsd_xxqd = ref<InstanceType<typeof xsd_xxqd>>();
    const v_xsd_xxck = ref<InstanceType<typeof xsd_xxck>>();

    const x_active_tab = ref("xq");
    const x_show_loading = ref(false);
    
    let m_xsd_data: any = {
        f_xsd_id: 0
    };

    onMounted(async () => {

        const xsdId = eocore.to_int(router.currentRoute.value.query.id);

        if (xsdId > 0) {
            await netLoad_xsd_get(xsdId);
        } else {
            m_xsd_data = TLogic.getEmptyData_xsd();
        }

        // 将 vflow 实例交付给 xsd_xxxq 的流程按钮
        nextTick(() => {

            // 先加载流程
            v_flow.value?.load_List(m_xsd_data["f_xsd_id"]);
            v_xsd_xxxq.value?.loadData(v_flow.value, m_xsd_data);
        });
    });


    const netLoad_xsd_get = async (xsdId: number) => {

        x_show_loading.value = true;
        const ret = await eocore.proc("p_xsd_get", { "v_xsd_id": xsdId });
        x_show_loading.value = false;
        const data = eocore.check_net_object(ret);
        if (data == undefined) return;

        data["f_xsje_s"] = eolib.fixed_num(data["f_xsje"], 2);
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);
        TLogic.updateDicUserData(data, ["f_xsy_id"]);

        m_xsd_data = data;
    }    

    const onUpdate_xsdxq = async (data: any) => {
        Object.assign(m_xsd_data, data);

        v_flow.value?.load_List(m_xsd_data["f_xsd_id"]);
    }

    const onTabClick = (tab: any) => {
        // console.log(tab.paneName);

        switch (tab.paneName) {
            case "qd":
                v_xsd_xxqd.value?.loadList(v_flow.value, m_xsd_data);
                break;
            case "ck":
                v_xsd_xxck.value?.loadList(v_flow.value, m_xsd_data);
                break;
        }
    }
</script>
