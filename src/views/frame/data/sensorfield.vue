<template>
    <!-- 数据转换 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_row">
            <div class="eo_row_d" style="width:600px;">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">                            
                            <div class="cell">
                                <div class="info_w">
                                    <span>设备类别</span>
                                </div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_group">刷新</el-button>
                                </div>
                                <div class="split"></div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p"
                                        @click="onButtonClick_Add_group">添加</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="default" class="eo_w80p"
                                        @click="onButtonClick_Del_group">删除</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p"
                                        @click="onButtonClick_Upd_group">修改</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="eo_col_f">
                        <vtable ref="v_table_group" 
                            name="参数类别"
                            id-field="f_sensor_group_id" 
                            :on-item="onTableItem_group"
                            @loading="onTableLoading_group"
                            @row-click="onTableRowClick_group">                    
                            <el-table-column prop="f_name" label="名称" width="160" />
                            <el-table-column prop="f_code" label="编码" width="120" />
                            <el-table-column prop="f_note" label="备注" width="280" show-overflow-tooltip />
                            <el-table-column />
                        </vtable>
                    </div>
                </div>
            </div>
            <div class="eo_row_sp"></div>
            <div class="eo_row_f">
                <div class="eo_col">
                    <div class="eo_col_f">
                        <vtable ref="v_table_field" 
                            name="参数字段"
                            id-field="f_sensor_field_id" 
                            :on-item="onTableItem_field"
                            @loading="onTableLoading_field"
                            @row-click="onTableRowClick_field">                    
                            <el-table-column prop="f_name" label="名称" width="160" />
                            <el-table-column prop="f_index" label="字段" width="100" />
                            <el-table-column prop="f_note" label="备注" width="280" show-overflow-tooltip />
                            <el-table-column />
                        </vtable>
                    </div>
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p"
                                        @click="onButtonClick_Add_field">添加</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="default" class="eo_w80p"
                                        @click="onButtonClick_Del_field">删除</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p"
                                        @click="onButtonClick_Upd_field">修改</el-button>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
        <vformd ref="v_formd_group" width="400px"
            :formTypes="x_form_types_group" @close="onDialogClose_group"></vformd>
        <vformd ref="v_formd_field" width="400px"
            :formTypes="x_form_types_field" @close="onDialogClose_field"></vformd>
    </div>    
</template>


<script lang="ts">
/** KeepAlive */
export default { name: "data_sensorfield" }
</script>

<script lang="ts" setup>

    import { ref, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import TGlobal from "@/logic/TGlobal";

    import vtable from "@/logic/common/vtable.vue"
    import vformd from "@/logic/common/vformd.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_field = ref<t_table>();
    const v_table_group = ref<t_table>();

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_field = ref<t_formd>();
    const v_formd_group = ref<t_formd>();

    // 每个用户使用的设备不同，对应不同的字段信息

    // 表单对话框字段
    var x_form_types_group = ref<cform_options[]>([
        {type: "input", name: "f_name", span: 100, label: "名称"},
        {type: "input", name: "f_code", span: 100, label: "编码"},
        {type: "input", name: "f_note", span: 100, label: "备注"},
    ]);
    var x_form_types_field = ref<cform_options[]>([
        {type: "label", name: "f_sensor_group_id_s", span: 100, label: "类别"},  
        {type: "label", name: "f_code", span: 100, label: "编码"},  
        {type: "input", name: "f_name", span: 100, label: "名称"},
        {type: "number", name: "f_index", span: 100, label: "字段"},
        {type: "input", name: "f_note", span: 100, label: "备注"},
    ]);

    var x_show_loading = ref(false);

    onMounted(() => {
        v_table_group.value!.load_list_proc("np_sensorgroup_list", {});
    })

    const onButtonClick_Load_group = () => {
        v_table_group.value!.load_list_proc("np_sensorgroup_list", {});
    }

    /**
     * 点击添加设备按钮
     */
    const onButtonClick_Add_group = async () => {

        let groupData = {
            "f_data_group_id": 0,
            "f_name": "",
            "f_code": "",
            "f_note": ""
        }

        //console.log(fieldData);
        v_formd_group.value!.show_dialog(groupData);
    }
    /**
     * 点击更新设备
     */
    const onButtonClick_Upd_group = () => {

        let groupData = v_table_group.value!.get_select_data(true);
        if (groupData == undefined) return;

        //console.log(fieldData);
        v_formd_group.value!.show_dialog(groupData);
    }
    /**
     * 点击移除设备
     */
    const onButtonClick_Del_group = () => {
        v_table_group.value!.remove_data_proc_select("np_sensorgroup_del", (data: any) => {
            return {
                "v_sensor_group_id": data["f_sensor_group_id"]
            }
        });
    }

    /**
     * 点击添加设备按钮
     */
    const onButtonClick_Add_field = async () => {

        let groupData = v_table_group.value!.get_select_data(true);
        if (groupData == undefined) return;

        let fieldData = {
            "f_sensor_field_id": 0,
            "f_sensor_group_id": groupData["f_sensor_group_id"],
            "f_sensor_group_id_s": groupData["f_name"],
            "f_code": groupData["f_code"],
            "f_name": "",
            "f_index": 1,
            "f_note": ""
        }

        //console.log(fieldData);
        v_formd_field.value!.show_dialog(fieldData);
    }
    /**
     * 点击更新设备
     */
    const onButtonClick_Upd_field = () => {

        let fieldData = v_table_field.value!.get_select_data(true);
        if (fieldData == undefined) return;

        //console.log(fieldData);
        v_formd_field.value!.show_dialog(fieldData);
    }
    /**
     * 点击移除设备
     */
    const onButtonClick_Del_field = () => {
        v_table_field.value!.remove_data_proc_select("np_sensorfield_del", (data: any) => {
            return {
                "v_data_field_id": data["f_data_field_id"]
            }
        });
    }

    const onTableItem_group = (data: any) => {
    }
    const onTableLoading_group = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableRowClick_group = (data: any) => {
        v_table_field.value!.load_list_proc("np_sensorfield_list", {
            "v_sensor_group_id": data["f_sensor_group_id"]
        });
    }

    const onTableItem_field = (data: any) => {
    }
    const onTableLoading_field = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableRowClick_field = (data: any) => {
    }    

    const onDialogClose_field = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        //console.log(data);
        if (!eocore.check_len(data["f_name"])) {
            eocore.show_error("请输入名称");
            return;
        }

        let fieldId = data["f_sensor_field_id"];

        v_table_field.value!.update_data_proc("np_sensorfield_upd", {
            "v_sensor_field_id": fieldId,
            "v_sensor_group_id": data["f_sensor_group_id"],
            "v_name": data["f_name"],
            "v_index": data["f_index"],
            "v_note": data["f_note"],
        }, -1, fieldId <= 0, true);

        cb(true);
    }

    const onDialogClose_group = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        //console.log(data);
        if (!eocore.check_len(data["f_name"])) {
            eocore.show_error("请输入名称");
            return;
        }
        if (!eocore.check_len(data["f_code"])) {
            eocore.show_error("请输入编码");
            return;
        }

        let groupId = data["f_sensor_group_id"];

        v_table_group.value!.update_data_proc("np_sensorgroup_upd", {
            "v_sensor_group_id": groupId,
            "v_name": data["f_name"],
            "v_code": data["f_code"],
            "v_note": data["f_note"],
        }, -1, groupId <= 0, true);

        cb(true);
    }


</script>

<style lang="scss" scoped>
</style>