<template>
    <!-- 调拨历史 - App端 -->
    <div class="ap_list">
        <div v-if="x_list.length === 0" class="empty">
            暂无调拨记录
        </div>
        <div v-for="item in x_list" :key="item.f_kcmx_id"
            class="item">
            <div class="body">
                <div class="row">
                    <span class="label">状态</span>
                    <span class="value">
                        <span class="div_tag" :class="item.f_jyzt == 1 ? 'jy_tag_out' : 'jy_tag_back'">
                            {{ item.f_jyzt_s }}
                        </span>
                    </span>
                    <span class="label">时间</span>
                    <span class="value">{{ item.f_jysj_s }}</span>
                </div>
                <div class="row">
                    <span class="label">员工</span>
                    <span class="value">{{ item.f_jyyg_id_s || '-' }}</span>
                    <span class="label">库管</span>
                    <span class="value">{{ item.f_kgy_id_s || '-' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import eocore from "@/inc/eocore";
import eolib from "@/inc/eolib";
import eodic from "@/inc/eodic";
import TLogic from "@/logic/TLogic";

const x_list = ref<any[]>([]);
const x_data_kcmx: any = reactive({});

/**
 * 加载数据
 */
const loadData = async (kcmxData: any) => {
    Object.assign(x_data_kcmx, kcmxData);

    const ret = await eocore.proc("p_kcjym_list", {
        "v_kcmx_id": x_data_kcmx["f_kcmx_id"]
    });
    let list = eocore.check_net_array(ret);
    if (list == undefined) list = [];

    for (const d of list) {
        d["f_jyzt_s"] = eodic.get_dic_label("调拨状态", d["f_jyzt"]);
        d["f_jysj_s"] = eolib.datetime_2_short(d["f_jysj"]);
        TLogic.updateDicUserData(d, ["f_jyyg_id", "f_kgy_id"]);
    }
    x_list.value = list;
};

defineExpose({ loadData });
</script>

<style lang="scss" scoped>
    .jy_tag_out {
        color: #e74c3c;
        background: #fde8e8;
    }

    .jy_tag_back {
        color: #27ae60;
        background: #e8f8ef;
    }

    /* 标签（主色调） */
    .div_tag {
        flex: 0 0 auto;
        font-size: 0.9rem;
        color: #fff;
        background: var(--eo_color_main);
        padding: 0.1rem 0.4rem;
        border-radius: 0.3rem;
        margin-left: 0.5rem;
    }    
</style>
