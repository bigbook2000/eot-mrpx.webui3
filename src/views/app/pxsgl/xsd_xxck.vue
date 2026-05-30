<template>
    <!-- 出库明细 -->
    <div class="eo_col" v-loading="x_show_loading">
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="ap_list">
                    <div v-if="x_data_list.length == 0" class="empty">
                        暂无出库记录
                    </div>
                    <div v-for="item in x_data_list" :key="item.f_xsdck_id" class="item">
                        <div class="body">
                            <div class="row">
                                <span class="value title">{{ item.f_cpmc }}</span>
                                <span class="div_tag" v-if="item.f_ckbz == 2">退货</span>
                            </div>
                            <div class="row">
                                <span class="label">批次</span>
                                <span class="value">{{ item.f_kcbh }}</span>
                                <span class="label">仓库</span>
                                <span class="value">{{ item.f_hwck_s }}</span>
                            </div>
                            <div class="row">
                                <span class="label">单价</span>
                                <span class="value">{{ item.f_kcdj_s }}</span>
                                <span class="label">数量</span>
                                <span class="value">{{ item.f_kcsl }}</span>
                            </div>
                            <div class="row" v-if="item.f_wlgs_id_s">
                                <span class="label">物流</span>
                                <span class="value">{{ item.f_wlgs_id_s }}</span>
                            </div>
                            <div class="row" v-if="item.f_wldh">
                                <span class="label">单号</span>
                                <span class="value">{{ item.f_wldh }}</span>
                            </div>
                            <div class="row" v-if="item.f_cksj_s">
                                <span class="label">出库时间</span>
                                <span class="value">{{ item.f_cksj_s }}</span>
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
</template>

<script lang="ts" setup>
    import { ref, watch } from "vue"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"
    import eodic from "@/inc/eodic"

    import TLogic from "@/logic/TLogic"

    const props = defineProps<{
        xsdId: number
    }>();

    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);

    const loadList = async () => {
        if (props.xsdId <= 0) {
            x_data_list.value = [];
            return;
        }
        x_show_loading.value = true;
        let ret = await eocore.proc("p_xsdck_list", {
            "v_xsd_id": props.xsdId,
            "v_xsdcp_id": -1
        });
        let list = eocore.check_net_array(ret) || [];
        x_show_loading.value = false;

        for (let d of list) {
            if (d["f_cksj"]) {
                d["f_cksj_s"] = eolib.datetime_2_short(d["f_cksj"], true);
            }
            d["f_kcdj_s"] = eolib.fixed_num(d["f_kcdj"], 3);
            d["f_hwck_s"] = eodic.get_dic_label("产品仓库", d["f_hwck"]);
            d["f_wlgs_id_s"] = TLogic.getLabel_wlgs(d["f_wlgs_id"]);
            TLogic.updateDicUserData(d, ["f_kgy_id"]);
        }
        x_data_list.value = list;
    }

    watch(() => props.xsdId, () => {
        loadList();
    }, { immediate: true });

    defineExpose({ loadList });
</script>
