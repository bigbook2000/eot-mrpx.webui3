<template>
    <!-- 库存整理 - 查询条件 -->
    <div class="eo_tool_bar">
        <div class="eo_form">
            <div class="cell eo_w100">
                <div class="label_n">货物</div>
                <div class="input">
                    <el-input v-model="x_query_kcxx" placeholder="批次或名称" maxlength="32" />
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
import vdic from "@/components/vdic.vue";

const props = defineProps<{
    cplbList: any[],
    initBatch?: string
}>();

const emit = defineEmits<{
    (e: 'search', params: { cplb: number[], kcxx: string, jyzt: number }): void
}>();

// 查询条件
const x_query_kcxx = ref(props.initBatch || "");
const x_query_cplb = ref([0, 0]);
const x_query_jyzt = ref(-1);

const onSearch = () => {
    emit('search', {
        cplb: x_query_cplb.value,
        kcxx: x_query_kcxx.value,
        jyzt: x_query_jyzt.value,
    });
};
</script>

<style lang="scss" scoped>
</style>
