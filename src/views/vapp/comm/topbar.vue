<template>
    <!-- App顶部导航栏 -->
    <div class="ap_dialog_head">
        <div class="back" @click="onButtonClick_back">
            <el-icon><ArrowLeft /></el-icon>
        </div>
        <div class="title">
            {{ title }}
        </div>
        <div class="tool">
            <slot name="tool"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">

    import { onMounted, ref, watch } from "vue"
    import { ArrowLeft } from '@element-plus/icons-vue'

    import router from "@/router/index"

    const props = withDefaults(defineProps<{
        title: string,
        back?: boolean
    }>(), { 
        title: "",
        back: true 
    })

    const emits = defineEmits<{
        (e: "click"): void
    }>()

    onMounted(() => {        
    });

    const onButtonClick_back = () => {
        // 触发一个事件
        emits("click");

        if (props.back) {
            router.back();
        } else {
            router.replace({name: 'app_menu'}); 
        }
    }
</script>

<style lang="scss">

</style>