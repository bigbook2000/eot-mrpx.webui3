<template>
    <!-- tab -->
    <div class="sv_tab">
        <div class="sv_tab_head">
            <div v-for="(item, index) in x_item_list" 
                :style="{width:props.itemWidth}"
                :class="'item'+(index==props.modelValue?'true':'false')" :key="index"
                @click="onSelectChange(index)">{{ item }}</div>
        </div>
        <div class="sv_tab_body">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">

    import { ref, watch } from "vue"

    import type {cdic_item, cform_options} from "@/inc/eotypes";

    const props = withDefaults(defineProps<{
        modelValue: number,        
        itemList: string[],
        itemWidth?: string
    }>(), {
        modelValue: 0,
        itemList: () => {
            return [] as string[];
        },
        itemWidth: "auto",
    })

    const emits = defineEmits<{
        (e: 'update:modelValue', value: number): void
        (e: 'change', value: number): void
    }>()

    const x_item_list = ref<string[]>([...props.itemList]);

    watch(() => props.itemList, (val) => {
        x_item_list.value = [...val];
    });

    /**
     * 手动列表
     * @param list 
     */
    const update_list = (itemList: string[]) => {
        x_item_list.value = [...itemList];
    }
    
    const onSelectChange = (index: number) => {
        emits("update:modelValue", index);
        // 触发一个事件
        emits("change", index);
    }

    defineExpose({
        update_list
    })    

</script>

<style lang="scss">
</style>