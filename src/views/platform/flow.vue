<template>
    <!-- 流程管理 -->
    <div class="eo_page">
        <div class="eo_row">
            <!-- 流程类别 -->
            <div class="eo_row_d eo_w2">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Load_type">刷新</vbuttonk>
                                <div class="split"></div>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Add_type">添加类别</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Del_type">删除类别</vbuttonk>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_type">修改类别</vbuttonk>
                            </div>
                        </div>
                    </div>
            
                    <!-- 类别表格 -->
                    <div class="eo_col_f">
                        <vtable ref="v_table_type" 
                            name="流程类别"
                            id-field="f_flow_type_id"
                            @loading="onTableLoading"
                            :on-item="onTableItem_type"
                            @row-click="onTableRowClick_type">
                            <el-table-column prop="f_status_s" label="状态" width="80" />
                            <el-table-column prop="f_name" label="名称" width="160" />
                            <el-table-column prop="f_table" label="表单" width="120" />
                            <el-table-column prop="f_field" label="字段" width="120" />
                            <el-table-column prop="f_beizhu" label="描述" width="200" show-overflow-tooltip />
                            <el-table-column />
                        </vtable>
                    </div>
                </div>
            </div>
            <div class="eo_row_sp"></div>
            <!-- 流程节点 -->
            <div class="eo_row_f">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Add_point">添加节点</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Del_point">删除节点</vbuttonk>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_point">修改节点</vbuttonk>
                            </div>
                        </div>
                    </div>
            
                    <!-- 节点表格 -->
                    <div class="eo_col_f">
                        <vtable ref="v_table_point" 
                            name="流程节点"
                            id-field="f_flow_point_id"
                            @loading="onTableLoading"
                            :on-item="onTableItem_point"
                            @row-click="onTableRowClick_point">
                            <el-table-column prop="f_name" label="名称" width="160" />
                            <el-table-column prop="f_role_s" label="角色" width="240" />
                            <el-table-column prop="f_title" label="标题" width="160" show-overflow-tooltip />
                            <el-table-column prop="f_text" label="描述" width="200" show-overflow-tooltip />
                            <el-table-column />
                        </vtable>
                    </div>

                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Up_point">上移</vbuttonk>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Down_point">下移</vbuttonk>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
        <!-- 流程类别 -->
        <vformd ref="v_formd_type" title="流程类别" width="400px"
            :form-types="x_form_types_type" @close="onFormdClose_type"/>
        <!-- 流程节点 -->
         <flow_point ref="v_flow_point" 
            @close="onDialogClose_point"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "platform_flow" }
</script>

<script lang="ts" setup>
    import { ref, nextTick, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"
    import vformd from "@/logic/common/vformd.vue"

    import flow_point from "@/views/platform/flow_point.vue"

    import TLogic from "@/logic/TLogic";

    type t_table = InstanceType<typeof vtable>;
    const v_table_type = ref<t_table>();
    const v_table_point = ref<t_table>();

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_type = ref<t_formd>();
    const v_flow_point = ref<InstanceType<typeof flow_point>>();

    let m_role_list: any[];

    // 加载状态
    const x_show_loading = ref(false);

    // 流程类别
    const x_form_types_type = ref<cform_options[]>([
        { type: "input", name: "f_name", span: 100, label: "名称 *" },
        { type: "input", name: "f_table", span: 100, label: "表单" },
        { type: "input", name: "f_field", span: 100, label: "字段" },
        { type: "input", name: "f_text", span: 100, label: "描述" },
        { type: "switch", name: "f_status", span: 100, label: "状态" },
        
    ]);

    onMounted(async () => {
                
        let ret: any = await eocore.post("/framework/role/list", [{}]);
        let list = eocore.check_net_array(ret);
        if (list != undefined) m_role_list = list;

        // 初始化加载数据
        v_table_type.value?.load_list_net("/framework/flow/type/list", {});
    });

    /**
     * 加载状态处理
     * @param show 是否显示加载状态
     */
    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show;
    }

    const onButtonClick_Load_type = () => { 
        v_table_type.value?.load_list_net("/framework/flow/type/list", {});
    }

    const onTableItem_type = (data: any) => {
        data["f_status_s"] = "";
        if (data["f_status"] == 0) data["f_status_s"] = "停用";
    }
    const onTableItem_point = (data: any) => {
        let rd = TLogic.getRoleInfo(m_role_list, data["f_role"]);
        data["f_role_s"] = rd["roleStr"];
        data["f_role_d"] = rd["roleIds"];
    }

    /**
     * 表格行点击事件
     * @param data 行数据
     */
    const onTableRowClick_type = (data: any) => {
        // 点击行后的操作，如选中高亮等
        v_table_point.value?.load_list_net("/framework/flow/point/list", {
            "f_flow_type_id": data["f_flow_type_id"]
        });
    }
    const onTableRowClick_point = (data: any) => {
        // 点击行后的操作，如选中高亮等
    }

    /**
     * 添加
     */
    const onButtonClick_Add_type = () => {

        let flowTypeData = {
            f_flow_type_id: 0,
            f_name: "",          // 名称
            f_table: "",    // 表单    
            f_field: "",      // 字段
            f_text: "",         // 描述
            f_status: 1,      // 状态
        };
        v_formd_type.value?.show_dialog(flowTypeData);
    }
    const onButtonClick_Del_type = () => {
        v_table_type.value?.remove_data_net_select ("/framework/flow/type/del", async (data: any) => {
            return {
                "f_flow_type_id": data["f_flow_type_id"]
            };
        });
    }
    const onButtonClick_Upd_type = () => {
        let flowTypeData = v_table_type.value?.get_select_data(true);
        if (!flowTypeData) return;
        
        v_formd_type.value?.show_dialog(flowTypeData);
    }

    const onButtonClick_Add_point = () => {

        let flowTypeData = v_table_type.value?.get_select_data(true);
        if (flowTypeData == undefined) return;

        let list = v_table_point.value?.get_list();
        if (list == undefined) list = [];
        let orderValue = 0.0;
        list.forEach(item => {
            if (item.f_order > orderValue) orderValue = item.f_order;
        });
        orderValue += 1.0;

        let flowPointData = {
            f_flow_point_id: 0,
            f_flow_type_id: flowTypeData["f_flow_type_id"],
            f_name: "",          // 名称
            f_permit: "",    // 权限
            f_order: orderValue, // 顺序
            f_title: "",      // 标题
            f_text: "",         // 描述
        };
        v_flow_point.value?.show_dialog(flowPointData);
    }
    const onButtonClick_Del_point = () => {
        v_table_point.value?.remove_data_net_select ("/framework/flow/point/del", async (data: any) => {
            return {
                "f_flow_point_id": data["f_flow_point_id"]
            };
        });
    }
    const onButtonClick_Upd_point = () => {

        let flowPointData = v_table_point.value?.get_select_data(true);
        if (!flowPointData) return;
        
        v_flow_point.value?.show_dialog(flowPointData);
    }

    const flowPointOrder = async (offset: number) => { 

        let list = v_table_point.value?.get_list();
        if (list == undefined) return;

        let index = v_table_point.value?.get_select_index(true) || -1;
        if (index < 0) return;

        let index1 = index;
        let index2 = index + offset;
        if (index2 < 0 || index2 >= list.length) return;

        let data1 = list[index1];
        let data2 = list[index2];

        let ret = await eocore.post("/framework/flow/point/order", [{
            "f_flow_point_id1": data1["f_flow_point_id"],
            "f_order1": data2["f_order"],
            "f_flow_point_id2": data2["f_flow_point_id"],
            "f_order2": data1["f_order"]
        }]);
        let data = eocore.check_net_object(ret);
        if (data == undefined) return;

        v_table_point.value?.exchange_index(index1, index2);
    }

    /**
     * 上移顺序
     */
    const onButtonClick_Up_point = async () => {
        flowPointOrder(-1);
    }
    /**
     * 下移顺序
     */
    const onButtonClick_Down_point = () => {
        flowPointOrder(1);
    }

    /**
     * 流程类别编辑对话框关闭事件
     */
    const onFormdClose_type = async (cancel: boolean, data: any, cb: cfunc_boolean): Promise<void> => {

        if (cancel) {
            cb(true);
            return;
        }
        
        // 验证数据
        if (!data["f_name"]) {
            eocore.show_info("请输入名称");
            cb(false);
            return;
        }
        
        await v_table_type.value?.update_data_net(
            "/framework/flow/type/upd", data, -1, data["f_flow_type_id"]<=0, true);
            
        cb(true);
    }

    /**
     * 流程节点编辑对话框关闭事件
     */
    const onDialogClose_point = async (cancel: boolean, data: any, cb: cfunc_boolean): Promise<void> => {

        if (cancel) {
            cb(true);
            return;
        }
        
        // 验证数据
        if (!data["f_name"]) {
            eocore.show_info("请输入名称");
            cb(false);
            return;
        }

        await v_table_point.value?.update_data_net(
            "/framework/flow/point/upd", data, -1, data["f_flow_point_id"]<=0, true);
            
        cb(true);
    }    
</script>

<style lang="scss" scoped>
</style>