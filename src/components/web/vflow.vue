<template>
    <!-- Web流程面板 -->   
    <div class="sv_flow_panel" :style="{width:x_panel_width}">
        <div class="flow_bar">
            <el-icon size="24" color="#999" 
                class="flow_icon" @click="onClick_Flow_Panel"><Notebook /></el-icon>
        </div>
        <el-timeline v-show="x_show_panel">
            <el-timeline-item :timestamp="item['f_op_time_s']" 
                v-for="(item,index) in x_process_list" :key="index"
                placement="top" 
                type="primary"
                :color="item.color"
                size="large">
                <div @click="onClick_Flow_Process(index)">
                    <div class="flow_info">
                        <div class="point">{{ item['f_flow_point_id_s'] }}</div>
                        <div class="user">{{ item.user_id_s }}</div>
                        <div class="flag0" v-if="item['f_op_flag']==0">正常</div>
                        <div class="flag1" v-if="item['f_op_flag']==1">退回</div>
                    </div>
                    <div class="flow_text">
                        {{ item['f_text'] }}
                    </div>
                    <div class="flow_files">
                        <div v-for="(file,j) in item.files" :key="j" class="file">
                            <i class="el-icon-link"></i>&nbsp;
                            <a :href="file.link" target="_blank">
                                {{file['f_name']}}
                            </a>
                        </div>
                    </div>
                </div>
            </el-timeline-item>
        </el-timeline>
        <vflowd ref="v_flowd" @close="onFlowdClose" />
    </div>
   
</template>

<script setup lang="ts">

    import { ref, watch, onMounted } from "vue"
    import { useVflow } from "@/components/vflow"
    import vflowd from "./vflowd.vue"

    const props = defineProps<{
        type: string
    }>()

    const emits = defineEmits<{
        (e: "click"): void
    }>()

    const x_panel_width = ref("5rem"); // 流程面板宽度
    const x_show_panel = ref(false); // 是否显示流程面板    


    const onClick_Flow_Panel = () => {
        if (x_show_panel.value) {
            x_show_panel.value = false;
            x_panel_width.value = "5rem";
        } else {
            x_show_panel.value = true;
            x_panel_width.value = "30rem";
        }
    }

    const {
        v_flowd,
        x_process_list,
        onClick_Flow_Process,
        onFlowdClose,
        last_error,
        get_first_point,
        get_last_point,
        get_point_name_by_id,
        get_point_by_name,
        get_point_by_id,
        get_prev_point,
        get_next_point,
        check_point_back,
        check_point_order,
        load_List,
        clear_list,
        process_add_data,
        process_add_dialog,
        process_back_dialog,
    } = useVflow(props)

    defineExpose({
        last_error,
        get_first_point,
        get_last_point,
        get_point_name_by_id,
        get_point_by_name,
        get_point_by_id,
        get_prev_point,
        get_next_point,
        check_point_back,
        check_point_order,
        load_List,
        clear_list,
        process_add_data,
        process_add_dialog,
        process_back_dialog
    })
</script>

<style lang="scss">
.sv_flow_panel { 
    height: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.8rem 0rem;

    .flow_bar {
        text-align: right;
        padding: 0rem 0.8rem 0.8rem 0rem;

        .flow_icon {            
            cursor: pointer;
        }
    }

    .flow_info {
        display: flex;
        flex-direction: row;
    }
    .flow_info .point {
        width: 40%; 
        font-size: 1.2rem;
        color: #666;
        font-weight: bold;    
    }
    .flow_info .user {
        width: 30%; 
        font-size: 1.2rem;
        color: #666;
    }
    .flow_info .flag0 {
        width: 30%; 
        font-size: 1.2rem;
        color: #3c0;
    }
    .flow_info .flag1 {
        width: 30%; 
        font-size: 1.2rem;
        color: #c00;
    }
    .flow_text {
        box-sizing: border-box;
        width: 100%; 
        padding: 0.8rem 1.6rem 0rem 0rem;
        font-size: 1.2rem;
        color: #999;
    }

    .flow_button {
        width: 20%; 
        font-size: 1rem;    
        color: #999;
        text-decoration: underline;
    }

    .flow_files {
        padding: 0.5rem 0rem;
        font-size: 1rem;
    }
    .flow_files .file {
        padding: 0.5rem 0rem    ;    
    }
}
</style>