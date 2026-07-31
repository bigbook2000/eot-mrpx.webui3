<template>
    <!-- 入库明细 -->
    <div class="eo_col" v-loading="x_show_loading">
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="ap_list">
                    <div v-if="x_data_list.length == 0" class="empty">
                        暂无入库记录
                    </div>
                    <div v-for="item in x_data_list" :key="item.f_kcmx_id" class="item">
                        <div class="body">
                            <div class="row">
                                <span class="value title">{{ item.f_cpmc }}</span>
                                <span class="div_tag" v-if="item.f_kcbz != 0">已入库</span>
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
                            <div class="row" v-if="item.f_rksj_s">
                                <span class="label">入库时间</span>
                                <span class="value">{{ item.f_rksj_s }}</span>
                            </div>
                            <div class="row" v-if="item.f_kgy_id_s">
                                <span class="label">库管员</span>
                                <span class="value">{{ item.f_kgy_id_s }}</span>
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
    import { ref } from "vue"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"
    import eodic from "@/inc/eodic"

    import TLogic from "@/logic/TLogic"

    const x_data_list = ref<any[]>([]);
    const x_show_loading = ref(false);

    let m_data_cgd: any = {
        f_cgd_id: 0,
    };

    const loadList = async (flow: any, cgdData: any) => {

        Object.assign(m_data_cgd, {}, cgdData);

        await netLoad_cgdrk_list();
    }

    const netLoad_cgdrk_list = async () => {

        const cgdId = eocore.to_int(m_data_cgd["f_cgd_id"]);
        if (cgdId <= 0) {
            x_data_list.value = [];
            return;
        }

        x_show_loading.value = true;
        let ret = await eocore.proc("p_cgdrk_list", {
            "v_cgd_id": cgdId,
            "v_cgdcp_id": 0
        });
        let list = eocore.check_net_array(ret) || [];
        x_show_loading.value = false;

        for (let d of list) {
            if (d["f_rksj"]) {
                d["f_rksj_s"] = eolib.datetime_2_short(d["f_rksj"], true);
            }
            d["f_kcdj_s"] = eolib.fixed_num(d["f_kcdj"], 3);
            d["f_hwck_s"] = eodic.get_dic_label("产品仓库", d["f_hwck"]);
            TLogic.updateDicUserData(d, ["f_kgy_id"]);
        }
        x_data_list.value = list;
    }

    defineExpose({ loadList });
</script>

<style lang="scss" scoped>
    .div_tag {
        flex: 0 0 auto;
        font-size: 0.7rem;
        color: #fff;
        background: #27ae60;
        padding: 0.05rem 0.35rem;
        border-radius: 0.25rem;
        margin-left: 0.4rem;
    }
</style>
