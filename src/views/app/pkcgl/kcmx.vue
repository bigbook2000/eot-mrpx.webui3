<template>
    <!-- 库存明细 - 移动端 -->
    <div class="eo_page">
        <div class="eo_col">
            <topbar title="库存明细" />
            <div class="eo_col_f eo_scroll_v">
                <el-tabs v-model="x_active_tab" type="card" class="ap_tabs_sticky">
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

    import topbar from '@/views/app/comm/topbar.vue'
    import kcmx_xx from "./kcmx_xx.vue"
    import kcjy_list from "./kcjy_list.vue"

    const v_kcmx_xx = ref<InstanceType<typeof kcmx_xx>>();
    const v_kcjy_list = ref<InstanceType<typeof kcjy_list>>();

    const x_active_tab = ref("cpxx");

    onMounted(() => {
        // 从路由 state 中获取传递的数据
        const data = history.state?.kcmxData;
        if (data) {
            v_kcmx_xx.value?.loadData(data);
            v_kcjy_list.value?.loadData(data);
        }
    });

</script>

<style lang="scss" scoped>
    .div_tab_body {
        padding: 0.6rem 0.8rem;
    }
</style>
