<script setup lang="ts">

    // 流程按钮

    import { type cflow_point } from "@/inc/eoflow";
    import { useTflowButton } from "@/views/comm/tflow_button"
    import vbuttonk from "@/components/vbuttonk.vue"

    const emits = defineEmits<{
        (e: 'on-new', point: cflow_point, data: any): void
        (e: 'on-back', point: cflow_point, data: any): void
        (e: 'on-edit', point: cflow_point, data: any): void
        (e: 'on-get', point: cflow_point, data: any): void
        (e: 'on-cancel', point: cflow_point, data: any): void
        (e: 'on-flow', point: cflow_point, data: any): void
    }>()

    const {
        x_flow_new,
        x_flow_edit,
        x_flow_cancel,
        x_flow_back,
        x_flow_status,
        x_flow_status_text,
        init_flow,
        get_point,
        get_point_name,
        set_flow_back,
        set_flow_edit,
        update_flow_status,
        show_flow_dialog,
        onButtonClick_Flow_Add,
        onButtonClick_Flow_Upd,
        onButtonClick_Flow_Get,
        onButtonClick_Flow_Cancel,
        onButtonClick_Flow_Back,
        onButtonClick_Flow,
    } = useTflowButton(emits)

    defineExpose({
        init_flow,
        get_point,
        get_point_name,
        set_flow_back,
        set_flow_edit,
        update_flow_status,
        show_flow_dialog
    })

</script>

<template>
    <div class="sv_flow_button">
        <vbuttonk width="8rem" type="primary" class="input_w" permit="" 
            v-show="x_flow_new" 
            @click="onButtonClick_Flow_Add">新建</vbuttonk>
        <vbuttonk width="8rem" type="primary" class="input_w" permit="" 
            v-show="x_flow_edit"
            @click="onButtonClick_Flow_Upd">修改</vbuttonk>
        <vbuttonk width="8rem" type="default" class="input_w" permit="" 
            v-show="!x_flow_edit"
            @click="onButtonClick_Flow_Get">详情</vbuttonk>
        <div class="split"></div>
        <vbuttonk width="8rem" type="warning" class="input_w" permit="" 
            v-show="x_flow_cancel"
            @click="onButtonClick_Flow_Cancel">作废</vbuttonk>
        <vbuttonk width="8rem" type="warning" class="input_w" permit="" 
            v-show="x_flow_back"
            @click="onButtonClick_Flow_Back">退回</vbuttonk>
        <vbuttonk width="8rem" type="warning" class="input_w" permit="" 
            v-show="x_flow_status"
            @click="onButtonClick_Flow">{{ x_flow_status_text }}</vbuttonk>
    </div>
</template>

<style lang="scss">
.sv_flow_button {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
}
.ap_flow_button {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    .input {
        padding: 0.8rem 0.9rem 0.8rem 0.9rem;
        width: 100%;
        box-sizing: border-box;
    }
}
</style>