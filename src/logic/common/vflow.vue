<template>
    <!-- 流程面板 -->
    <div class="sv_flow_panel" :style="{width:x_panel_width+'px'}">
        <div class="flow_bar">
            <el-icon size="24" color="#999" 
                class="flow_icon" @click="onClick_Flow_Panel"><Notebook /></el-icon>
        </div>
        <el-timeline v-show="x_panel_width!=50">
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

    import { onMounted, ref, watch } from "vue"

    import type { cfunc_boolean, cfunc_close } from "@/inc/eotypes"
    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";
    import eoflow, { type cflow_type, type cflow_point } from "@/inc/eoflow";

    import vflowd from "./vflowd.vue"
    import TLogic from "@/logic/TLogic"
    import TGlobal from "@/logic/TGlobal";

    const v_flowd = ref<InstanceType<typeof vflowd>>();
    const x_process_list = ref<any[]>([]);

    const props = defineProps<{
        type: string,
    }>()

    const x_panel_width = ref(50);

    let m_flow_type: cflow_type|undefined = undefined;
    let m_data_id: number = 0;

    let m_last_error: string = "";
    let m_callback_close: cfunc_close|undefined = undefined;

    const emits = defineEmits<{
        (e: "click"): void
    }>()

    watch(() => props.type, (newVal, oldVal) => {
        //console.log(newVal, oldVal)
        m_flow_type = eoflow.get_type_by_name(newVal);
    }, {
        immediate: true,
        deep: false
    });

    onMounted(() => {
        m_flow_type = eoflow.get_type_by_name(props.type);
    });

    const last_error = (): string => {
        return m_last_error;
    }

    const get_first_point = (): cflow_point|undefined => {
        if (m_flow_type == undefined) return undefined;
        if (m_flow_type.points.length == 0) return undefined;
        return m_flow_type.points[0];
    }
    const get_last_point = (): cflow_point|undefined => {
        if (m_flow_type == undefined) return undefined;
        if (m_flow_type.points.length == 0) return undefined;
        return m_flow_type.points[m_flow_type.points.length - 1];
    }

    const get_point_by_name = (pointName: string): cflow_point|undefined => {

        if (m_flow_type == undefined) {
            console.log("******** ********", "eoflow::get_point_name: type", pointName);
            return undefined;
        }
        for (let d2 of m_flow_type.points) {
            if (d2.name == pointName) return d2;
        }

        console.log("******** ********", "eoflow::get_point_name: undefined", pointName);
        return undefined;
    }

    const get_point_name_by_id = (pointId: number): string => {

        if (m_flow_type == undefined) {
            console.log("******** ********", "eoflow::get_point_name_by_id: type", pointId, m_flow_type);
            return "";
        }

        for (let d2 of m_flow_type.points) {
            if (d2.flow_point_id == pointId) return d2.name;
        }
        console.log("******** ********", "eoflow::get_point_name_by_id: undefined", pointId, m_flow_type);
        return "";
    }

    const get_point_by_id = (pointId: number): cflow_point|undefined => {

        if (m_flow_type == undefined) {
            console.log("******** ********", "eoflow::get_point_by_id: type", pointId);
            return undefined;
        }

        for (let d2 of m_flow_type.points) {
            if (d2.flow_point_id == pointId) return d2;
        }
        console.log("******** ********", "eoflow::get_point_by_id: undefined", pointId);
        return undefined;
    }

    /**
     * 获取下一个节点
     * @param pointId 当前节点
     */
    const get_next_point = (pointId: number): cflow_point|undefined => {

        if (m_flow_type == undefined) {
            console.log("******** ********", "eoflow::get_next_point: type", pointId);
            return undefined;
        }

        let i;
        for (i = 0; i < m_flow_type.points.length-1; i++) {
            if (m_flow_type.points[i].flow_point_id == pointId) {
                return m_flow_type.points[i+1];
            }
        }

        console.log("******** ********", "eoflow::get_next_point: undefined", pointId);
        return undefined;
    }

    /**
     * 获取上一个节点
     * @param pointId 当前节点
     */
    const get_prev_point = (pointId: number): cflow_point|undefined => {

        if (m_flow_type == undefined) {
            console.log("******** ********", "eoflow::get_prev_point: type", pointId);
            return undefined;
        }

        let i;
        for (i = 1; i < m_flow_type.points.length; i++) {
            if (m_flow_type.points[i].flow_point_id == pointId) {
                return m_flow_type.points[i-1];
            }
        }

        console.log("******** ********", "eoflow::get_prev_point: undefined", pointId);
        return undefined;
    }

    /**
     * 判断节点是否为开始或结束节点
     * @param pointName 
     * @returns 
     */
    const check_point_back = (pointName: string): any => { 

        if (m_flow_type == undefined) {
            console.log("******** ********", "eoflow::get_point_by_id: type", pointName);
            return undefined;
        }

        return {
            first: (m_flow_type.points[0].name == pointName),
            last: (m_flow_type.points[m_flow_type.points.length - 1].name == pointName)
        };
    }

    /**
     * 判断2个节点顺序 point1 < point2
     * @param pointId1 
     * @param pointName2 
     * @returns 
     */
    const check_point_order = (pointId1: number, pointName2: string): boolean => {

        if (m_flow_type == undefined) {
            console.log("******** ********", "eoflow::check_point_order: type", pointId1, pointName2);
            return false;
        }
        
        let point1 = undefined;
        let point2 = undefined;

        for (let d2 of m_flow_type.points) {
            if (d2.flow_point_id == pointId1) point1 = d2;
            if (d2.name == pointName2) point2 = d2;
        }

        if (point1 == undefined || point2 == undefined) {
            console.log("******** ********", "eoflow::check_point_order: point", pointId1, pointName2);
            return false;
        }

        //console.log((point1.order < point2.order), point1, point2);
        return point1.order < point2.order;
    }

    const on_row_data = (row: any) => { 

        row.color = "#00b077";
        row["f_op_time_s"] = eolib.datetime_2_short(row["f_op_time"], false);
        
        let flowPoint = get_point_by_id(row["f_flow_point_id"]);
        row["f_flow_point_id_s"] = flowPoint?.name;
        row["files"] = []
    }

    /**
     * 加载一个流程处理历史记录
     * @param {Number} dataId
     */
    const load_List = async (dataId: number): Promise<any[]> => {

        x_process_list.value = [];
        m_data_id = dataId;
        if (m_data_id <= 0) {            
            return [];
        }

        let ret = await eocore.post("/framework/flow/process/list", [{
            v_flow_type_id: m_flow_type?.flow_type_id, 
            v_data_id: dataId
        }]);
        let listFlow = eocore.check_net_array(ret);
        if (listFlow == undefined) return [];

        let keyIds = "0";
        for (let d of listFlow) {
            keyIds += "," + d["f_flow_process_id"];
            on_row_data(d);
        }

        // 读取附件
        ret = await eocore.post("/framework/hdata/file/list", [{
            v_type: TLogic.fileTypes["系统_流程文件"],
            v_keyids: keyIds, 
        }]);
        let listFile = eocore.check_net_array(ret);
        if (listFile == undefined) return [];

        for (let d1 of listFlow) {
            for (let d2 of listFile) {

                if (d1["f_flow_process_id"] == d2["f_keyid"]) {
                    d2["link"] = TLogic.getXSaveDataUrl(d2["f_file_id"]);
                    d1["files"].push(d2);
                }
            }
        }

        x_process_list.value = listFlow;
        return listFlow;
    }

    const clear_list = (dataId: number) => {
        x_process_list.value = [];
        m_data_id = dataId;
    }

    const get_process_point = () => {

        if (m_flow_type == undefined) {
            m_last_error = "流程未定义";
            console.log(m_last_error);
            return undefined;
        }

        // x_process_list是倒序，所以取第一个即最新的节点
        let pointId = 0;
        if (!eocore.check_empty(x_process_list.value)) {
            pointId = x_process_list.value[0]['f_flow_point_id'];
        }

        let pointPrev = undefined;
        let point = undefined;
        let pointNext = undefined;

        if (pointId > 0) {
            // 追加
            for (let i = 0; i < m_flow_type.points.length; i++) {
                let d2 = m_flow_type.points[i];
                if (d2.flow_point_id == pointId) {
                    point = d2;
                    if (i > 0) pointPrev = m_flow_type.points[i - 1];
                    if (i < m_flow_type.points.length - 1) pointNext = m_flow_type.points[i + 1];
                }
            }
        } else {
            // 新增
            pointNext = get_first_point();
        }

        return {
            pointPrev: pointPrev,
            point: point,
            pointNext: pointNext,
        }
    }

    /**
     * 追加一个新的流程，不弹出对话框
     * @param idValue // 字段值
     * @param text // 描述
     * @returns 
     */
    const process_add_data = async (idValue: number, text: string): Promise<any> => {

        m_last_error = "";
        const process = get_process_point(); // 获取当前流程点
        if (process == undefined) return undefined;
        if (m_flow_type == undefined) return undefined;

        if (process.pointNext == undefined) return undefined;

        let ret = await eocore.post("/framework/flow/process/upd", [{
            f_fprocess_id: 0,
            f_flow_type_id: m_flow_type.flow_type_id,
            f_flow_point_pid: process.point?.flow_point_id || 0,
            f_flow_point_id: process.pointNext.flow_point_id,
            f_data_id: idValue,
            f_op_flag: eoflow.OP_FLAG_NORMAL,
            f_text: text,
            v_table: m_flow_type.table,
            v_id_field: m_flow_type.field,
            v_id_value: idValue,
        }]);
        let data = eocore.check_net_object(ret);

        if (data != undefined) {
            on_row_data(data);
            //console.log(data);
            x_process_list.value.unshift(data);
        }

        return data;
    }

    /**
     * 增加一个流程实例
     * @param callback 
     */
    const process_add_dialog = (callback: cfunc_close): boolean => {

        m_callback_close = callback;

        m_last_error = "";
        const process = get_process_point(); // 获取当前流程点
        if (process == undefined) return false;
        if (m_flow_type == undefined) return false;

        if (process.point == undefined) return false;
        if (process.pointNext == undefined) return false;

        let processData = {
            f_flow_process_id: 0,
            f_user_id: TGlobal.userData["f_user_id"],
            f_flow_type_id: m_flow_type.flow_type_id,
            f_flow_point_pid: process.point.flow_point_id || 0,
            f_flow_point_id: process.pointNext.flow_point_id,
            f_flow_point_id_s: process.pointNext.name,
            f_data_id: m_data_id,
            f_op_time: "",
            f_op_flag: eoflow.OP_FLAG_NORMAL,
            f_text: "已确认",
            v_table: m_flow_type.table,
            v_id_field: m_flow_type.field,
            v_id_value: m_data_id,
        }

        // 标题为当前节点标题，数据为下一节点
        v_flowd.value?.show_dialog(process.point.title, processData);
        return true;
    }    

    const process_back_dialog = (callback: cfunc_close): boolean => {

        m_callback_close = callback;

        m_last_error = "";
        const process = get_process_point(); // 获取当前流程点
        if (process == undefined) return false;
        if (m_flow_type == undefined) return false;

        if (process.point == undefined) return false;
        if (process.pointPrev == undefined) return false;

        let processData = {
            f_flow_process_id: 0,
            f_user_id: TGlobal.userData["f_user_id"],
            f_flow_type_id: m_flow_type.flow_type_id,
            f_flow_point_pid: process.point.flow_point_id,
            f_flow_point_id: process.pointPrev.flow_point_id,
            f_flow_point_id_s: process.pointPrev.name,
            f_data_id: m_data_id,
            f_op_time: "",
            f_op_flag: eoflow.OP_FLAG_GOBACK,
            f_text: "退回修订",
            v_table: m_flow_type.table,
            v_id_field: m_flow_type.field,
            v_id_value: m_data_id,
        }

        v_flowd.value?.show_dialog("退回 " + process.pointPrev.title, processData);
        return true;
    }
    
    const onClick_Flow_Process = (index: number) => {
    }

    const onFlowdClose = async (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (!cancel && data != undefined) {

            // 先调用，清空文件
            on_row_data(data);

            // 读取附件
            let ret = await eocore.post("/framework/hdata/file/list", [{
                v_type: TLogic.fileTypes["系统_流程文件"],
                v_keyids: "" + data["f_flow_process_id"], 
                v_index: -1
            }]);
            let listFile = eocore.check_net_array(ret);
            if (listFile == undefined) return [];

            for (let d2 of listFile) {
                d2["link"] = TLogic.getXSaveDataUrl(d2["f_file_id"]);
                data["files"].push(d2);
            }
            
            x_process_list.value.unshift(data);
        }

        m_callback_close?.(cancel, data, cb);
    }

    const onClick_Flow_Panel = () => {
        if (x_panel_width.value == 50) {
            x_panel_width.value = 360;
        } else {
            x_panel_width.value = 50;
        }
    }

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
    padding: 10px 0px;

    .flow_bar {
        text-align: right;
        padding: 0px 10px 10px 0px;

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
        font-size: 14px;
        color: #666;
        font-weight: bold;    
    }
    .flow_info .user {
        width: 30%; 
        font-size: 14px;
        color: #666;
    }
    .flow_info .flag0 {
        width: 30%; 
        font-size: 14px;
        color: #3c0;
    }
    .flow_info .flag1 {
        width: 30%; 
        font-size: 14px;
        color: #c00;
    }
    .flow_text {
        box-sizing: border-box;
        width: 100%; 
        padding: 10px 20px 0px 0px;
        font-size: 14px;
        color: #999;
    }

    .flow_button {
        width: 20%; 
        font-size: 12px;    
        color: #999;
        text-decoration: underline;
    }

    .flow_files {
        padding: 5px 0px;
        font-size: 12px;
    }
    .flow_files .file {
        padding: 5px 0px;    
    }
}
</style>