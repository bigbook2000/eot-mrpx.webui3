<template>
    <!-- 库存整理 - 查询条件 -->
    <div class="eo_tool_bar">
        <div class="eo_form">
            <div class="cell eo_w100">
                <div class="label_n">批次</div>
                <div class="input">
                    <el-input v-model="x_query_kcbh" placeholder="批次" maxlength="32" />
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">产品名称</div>
                <div class="input">
                    <el-input v-model="x_query_cpmc" placeholder="产品名称" maxlength="32" />
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">产品类别</div>
                <div class="input">
                    <tcplb v-model="x_query_cplb" :cplb-list="cplbList" />
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">调拨状态</div>
                <div class="input">
                    <vdic dic="调拨状态" :all="true" field="value" v-model="x_query_jyzt" />
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="input_w">
                    <el-button type="primary" @click="onSearch">查找</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import tcplb from "@/views/web/ext/comm/tcplb.vue";
import vdic from "@/components/web/vdic.vue";

const props = defineProps<{
    cplbList: any[],
    initBatch?: string
}>();

const emit = defineEmits<{
    (e: 'search', params: { cplb: number[], cpmc: string, cpbm: string, kcbh: string, jyzt: number }): void
}>();

// 查询条件
const x_query_kcbh = ref(props.initBatch || "");
const x_query_cpmc = ref("");
const x_query_cpbm = ref("");
const x_query_cplb = ref([0, 0]);
const x_query_jyzt = ref(-1);

const onSearch = () => {
    emit('search', {
        cplb: x_query_cplb.value,
        cpmc: x_query_cpmc.value,
        cpbm: x_query_cpbm.value,
        kcbh: x_query_kcbh.value,
        jyzt: x_query_jyzt.value,
    });
};
</script>

<style lang="scss" scoped>
</style>
