<template>
    <!-- 采购入库详情 - 路由页面 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="采购入库" />
            <div class="eo_col_f">
                <el-tabs v-model="x_active_tab" type="card" class="ap_tabs"
                    @tab-click="onTabClick">
                    <el-tab-pane label="采购详情" name="xq">
                        <cgd_xxxq ref="v_cgd_xxxq" @update="onUpdateCgdXxxq" />
                    </el-tab-pane>
                    <el-tab-pane label="产品清单" name="qd">
                        <cgd_xxqd ref="v_cgd_xxqd" />
                    </el-tab-pane>
                    <el-tab-pane label="入库明细" name="rk">
                        <cgd_xxrk ref="v_cgd_xxrk" />
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
    import { ref, onMounted, nextTick } from "vue"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"
    import eoflow from "@/inc/eoflow"

    import router from "@/router/index"
    import topbar from '@/views/vapp/comm/topbar.vue'

    import cgd_xxxq from "./cgd_xxxq.vue"
    import cgd_xxqd from "./cgd_xxqd.vue"
    import cgd_xxrk from "./cgd_xxrk.vue"
    import vflow from "@/components/app/vflow.vue"

    import TLogic from "@/logic/TLogic"
    import TGlobal from "@/logic/TGlobal"

    const v_flow = ref<InstanceType<typeof vflow>>();
    const v_cgd_xxxq = ref<InstanceType<typeof cgd_xxxq>>();
    const v_cgd_xxqd = ref<InstanceType<typeof cgd_xxqd>>();
    const v_cgd_xxrk = ref<InstanceType<typeof cgd_xxrk>>();

    const x_active_tab = ref("xq");
    const x_show_loading = ref(false);
    
    let m_cgd_data: any = {
        f_cgd_id: 0
    };

    onMounted(async () => {

        const cgdId = eocore.to_int(router.currentRoute.value.query.id);

        if (cgdId > 0) {
            await netLoad_cgd_get(cgdId);
        } else {
            m_cgd_data = {
                f_cgd_id: 0,
                f_cgdh: "",
                f_gys_id: 0,
                f_gys_id_s: "",
                f_cgy_id: TGlobal.userData["f_user_id"],
                f_cgy_id_s: TGlobal.userData["f_name"],
                f_cgjh_id: 0,
                f_cgjhdh: "",
                f_lxr: "",
                f_lxdh: "",
                f_wlgs_id: 0,
                f_wlgs_id_s: "",
                f_wldh: "",
                f_shr_id: 0,
                f_shr_id_s: "",
                f_fklb: 1,
                f_zje: 0,
                f_sfje: 0,
                f_shsj: "1970-01-01 00:00:00",
                f_yxbz: 1,
                f_beizhu: ""
            };
        }

        // 将 vflow 实例交付给 cgd_xxxq 的流程按钮
        nextTick(() => {

            // 先加载流程
            v_flow.value?.load_List(m_cgd_data["f_cgd_id"]);
            v_cgd_xxxq.value?.loadData(v_flow.value, m_cgd_data);
        });
    });


    const netLoad_cgd_get = async (cgdId: number) => {

        x_show_loading.value = true;
        const ret = await eocore.proc("p_cgd_get", { "v_cgd_id": cgdId });
        x_show_loading.value = false;
        const data = eocore.check_net_object(ret);
        if (data == undefined) return;

        data["f_zje_s"] = eolib.fixed_num(data["f_zje"], 2);
        data["f_sfje_s"] = eolib.fixed_num(data["f_sfje"], 2);
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);
        TLogic.updateDicUserData(data, ["f_cgy_id"]);

        m_cgd_data = data;
    }

    const onUpdateCgdXxxq = async (data: any) => {
        Object.assign(m_cgd_data, data);

        v_flow.value?.load_List(m_cgd_data["f_cgd_id"]);
    }

    const onTabClick = (tab: any) => {

        switch (tab.paneName) {
            case "qd":
                v_cgd_xxqd.value?.loadList(v_flow.value, m_cgd_data);
                break;
            case "rk":
                v_cgd_xxrk.value?.loadList(v_flow.value, m_cgd_data);
                break;
        }
    }
</script>
