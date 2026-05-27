<template>
    <!-- 产品部件清单 - App端 -->
    <div class="ap_list_wrap div_bj_scroll">
        <!-- 加载中 -->
        <div v-if="x_loading" class="empty">
            加载中...
        </div>

        <!-- 部件卡片列表 -->
        <div v-for="(item, index) in x_list" :key="index" class="item">
            <div class="body">
                <div class="row">
                    <span class="value title">{{ item.f_cpmc }}</span>
                    <span class="value">{{ item.f_cpbm }}</span>
                </div>
                <!-- 第2行：大类 / 小类 -->
                <div class="row">
                    <span class="label">类别</span>
                    <span class="value">{{ item.f_dlmc }} / {{ item.f_xlmc }}</span>
                    <span class="label">部件数量</span>
                    <span class="value">{{ item.f_bjsl }}</span>                    
                </div>
                <div class="row">
                    <span class="label">库存</span>
                    <span class="value">{{ item.f_cpsl }}</span>
                    <span class="label">成本</span>
                    <span class="value">{{ item.f_kcdj_s }}</span>
                </div>
                <div class="row">
                    <span class="label">规格</span>
                    <span class="value">{{ item.f_cpgg || '-' }}</span>
                    <span class="label">单位</span>
                    <span class="value">{{ item.f_cpdw || '-' }}</span>
                </div>
                <div class="row">
                    <span class="label">尺寸</span>
                    <span class="value">{{ item.f_cpcc || '-' }}</span>
                    <span class="label">重量</span>
                    <span class="value">{{ item.f_cpzl || '-' }}</span>
                </div>
            </div>
        </div>

        <!-- 空数据 -->
        <div v-if="!x_loading && x_list.length == 0" class="empty">
            无部件数据
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch } from "vue"
    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    const props = defineProps<{ cpdyId: number }>();

    const x_loading = ref(false);
    const x_list = ref<any[]>([]);

    /**
     * 加载部件清单
     */
    const loadData = async (cpdyId: number) => {
        if (cpdyId <= 0) {
            x_list.value = [];
            return;
        }

        x_loading.value = true;
        try {
            let ret = await eocore.proc("p_cpbj_list", {
                "v_cpdy_pid": cpdyId
            });
            let data = eocore.check_net_array(ret);
            if (data != undefined) {
                // 格式化
                for (let d of data) {
                    formatItem(d);
                }
                x_list.value = data;
            } else {
                x_list.value = [];
            }
        } catch {
            x_list.value = [];
        } finally {
            x_loading.value = false;
        }
    }

    // 监听 cpdyId 变化，自动加载
    watch(() => props.cpdyId, (newId: number) => {
        loadData(newId);
    }, { immediate: true });

    /**
     * 格式化部件产品信息字段
     */
    const formatItem = (data: any) => {
        data["f_cpjg_s"] = eolib.fixed_num(data["f_cpjg"], 3);
                
        let cpsl = eocore.to_float(data["f_cpsl"]);
        let cpzj = eocore.to_float(data["f_cpzj"]);
        if (cpsl > 0.0) cpzj = cpzj / cpsl;
        data["f_kcdj_s"] = eolib.fixed_num(cpzj, 3);
    };
</script>

<style lang="scss" scoped>
.div_bj_scroll {
    overflow-y: auto;
    height: 100%;
    box-sizing: border-box;
}
</style>

