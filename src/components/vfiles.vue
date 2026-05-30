<template>
    <!-- 多个文件 -->
    <div>
        <!-- num从1开始 index从0开始 -->
        <div v-for="(num, index) in count" :key="index">
            <vfile :ref="vref => { v_files[index] = vref;}"
                :type="type" :key-id="keyId" :index="index"
                v-model="x_file_ids[index]"
                :onLoading="onLoading"
                :onFileName="onFileName"></vfile>
        </div>
    </div>
</template>

<script setup lang="ts">

    import { onBeforeUpdate, onMounted, ref, watch } from "vue"

    import vfile from "@/components/vfile.vue";

    import type { cfunc_loading } from "@/inc/eotypes";

    const x_file_ids = ref<number[]>([]);

    const v_files = ref<any[]>([]);

    const props = defineProps<{
        count: number,
        type: string,
        keyId: number,
        onLoading?: cfunc_loading
    }>()

    const emits = defineEmits<{
        (e: "click"): void
    }>()

    onMounted(() => {

        for (let i = 0; i < props.count; i++) {
            x_file_ids.value[i] = 0;
        }
    });
    onBeforeUpdate(() => { 
        v_files.value = [];
    });

    const onFileName = (fileName: string): string => {
        console.log("fileName: " + fileName);
        return fileName;
    }

    const clear_files = () => { 

        for (let i in x_file_ids.value) {
            x_file_ids.value[i] = 0;
        }
        for (let vf of v_files.value) {
            if (vf != undefined) vf.clear_file();
        }
    }

    const update_key_id = async (keyId: number) => { 
        for (let vf of v_files.value) {
            if (vf != undefined) await vf.update_key_id(keyId);
        }
    }

    defineExpose({
        clear_files,
        update_key_id
    })

</script>

<style lang="scss">
</style>