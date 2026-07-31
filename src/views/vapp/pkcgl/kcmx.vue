<template>
    <!-- 库存明细 - 移动端 -->
    <div class="eo_page">
        <div class="eo_col">
            <topbar title="库存明细" />
            <div class="eo_col_f eo_scroll_v">
                <el-tabs v-model="x_active_tab" type="card" class="ap_tabs">
                    <el-tab-pane label="库存信息" name="cpxx">
                        <div class="div_tab_body">
                            <kcmx_xx ref="v_kcmx_xx" />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="调拨历史" name="jygl">
                        <div class="div_tab_body">
                            <kcjy_list ref="v_kcjy_list" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_kcgl_kcmx" }
</script>

<script lang="ts" setup>

    import { ref, onMounted } from "vue"
    import { useRoute } from "vue-router"

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    import topbar from '@/views/vapp/comm/topbar.vue'
    import kcmx_xx from "./kcmx_xx.vue"
    import kcjy_list from "./kcjy_list.vue"

    const route = useRoute();

    const v_kcmx_xx = ref<InstanceType<typeof kcmx_xx>>();
    const v_kcjy_list = ref<InstanceType<typeof kcjy_list>>();

    const x_active_tab = ref("cpxx");

    onMounted(async () => {

        const kcmxId = eocore.to_int(route.query.id);

        let kcmxData: any = undefined;
        if (kcmxId <= 0) {
            // 新增：使用空的 kcmx 数据
            kcmxData = {
                "f_kcmx_id": 0,
                "f_cpdy_id": 0,
                "f_kcbh": "",
                "f_rklb": "整理入库",
                "f_rkid": 0,
                "f_rksj": "1970-01-01 00:00:00",
                "f_rksj_s": "",
                "f_cklb": "",
                "f_ckid": 0,
                "f_cksj": "1970-01-01 00:00:00",
                "f_cksj_s": "",
                "f_cpmc": "",
                "f_cpbm": "",
                "f_jyzt": 0,
                "f_jyyg_id": 0,
                "f_hwck": 0,
                "f_kcsl": 1.0,
                "f_kcsl_s": "1.0",
                "f_kcdj": 0.0,
                "f_kcdj_s": "0.00",
                "f_pksj": "1970-01-01 00:00:00",
                "f_pksj_s": "",
                "f_kgy_id": TGlobal.userData["f_user_id"],
                "f_kgy_id_s": TGlobal.userData["f_name"],
                "f_beizhu": "",
                "f_kcbz": TLogic.kcbzCodes["正常"],
                "rksl": 1,
            };

        } else {

            // 编辑：通过接口获取 kcmx 详细信息
            const ret = await eocore.proc("p_kcmx_get", { "v_kcmx_id": kcmxId });
            kcmxData = eocore.check_net_object(ret);
            if (kcmxData == undefined) return;
        }

        v_kcmx_xx.value?.loadData(kcmxData);
        v_kcjy_list.value?.loadData(kcmxData);
    });

</script>

<style lang="scss" scoped>
    .div_tab_body {
        padding: 0.6rem 0.8rem;
    }
</style>
