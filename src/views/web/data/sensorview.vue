<template>
    <!-- 数据显示 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_s">部门</div>
                        <div class="input">
                            <dept_input :deptName="x_query_dept_id_s" style="width:100%"
                                @change="onInputChange_dept"></dept_input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">数据类型</div>
                        <div class="input">
                            <vdic style="width:100%" dic="数据类型" :all="false" field="label"
                                v-model="x_query_type" @change="onDicChange_type" />
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load">刷新</el-button>
                        </div>
                        <div class="split"></div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p"
                                @click="onButtonClick_Add">添加</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="default" class="eo_w80p"
                                @click="onButtonClick_Del">删除</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p"
                                @click="onButtonClick_Upd">修改</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="eo_col_f">
                <vtable ref="v_table_view" 
                    name="数据展示"
                    id-field="f_data_view_id" 
                    :on-item="onTableItem_view"
                    @loading="onTableLoading_view"
                    @row-click="onTableRowClick_view">                    
                    <el-table-column prop="f_order" label="顺序" width="60" />
                    <el-table-column prop="f_visible" label="显示" width="60" />
                    <el-table-column prop="f_type" label="类型" width="100" />
                    <el-table-column prop="f_label" label="名称" width="160" />
                    <el-table-column prop="f_kname" label="字段" width="100" />
                    <el-table-column prop="f_precision" label="精度" width="80" />
                    <el-table-column prop="f_unit" label="单位" width="100" />
                    <el-table-column prop="f_note" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
        </div>
        <vformd ref="v_formd_view" width="700px"
            :formTypes="x_form_types" @close="onDialogClose_view"></vformd>
    </div>    
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "data_sensorview" }
</script>

<script lang="ts" setup>

    import { ref, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import TGlobal from "@/logic/TGlobal";

    import vtable from "@/components/web/vtable.vue"
    import vformd from "@/components/web/vformd.vue"
    import vdic from "@/components/web/vdic.vue"

    import dept_input from "@/views/platform/dept_input.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_view = ref<t_table>();

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_view = ref<t_formd>();


    // 每个用户使用的设备不同，对应不同的字段信息

    // 表单对话框字段
    var x_form_types = ref<cform_options[]>([
        {type: "input", name: "f_label", span: 2, label: "名称"},
        {type: "dic", name: "f_type", span: 2, label: "类型", dic: "数据类型", all: false, field: "label"},
        {type: "number", name: "f_index", span: 2, label: "字段"},
        {type: "number", name: "f_order", span: 2, label: "顺序"},
        {type: "switch", name: "f_visible", span: 2, label: "可见"},        
        {type: "number", name: "f_precision", span: 2, label: "精度"},
        {type: "input", name: "f_unit", span: 2, label: "单位"},
        {type: "blank", name: "", span: 2, label: ""},
        {type: "input", name: "f_params", span: 100, label: "参数"},
        {type: "input", name: "f_note", span: 100, label: "备注"},
    ]);

    var x_show_loading = ref(false);

    var x_query_dept_id_s = ref("");
    var m_query_dept_id = 0;
    var x_query_type = ref("2011");

    /**
     * 处理vue onMounted事件
     */
    const doVue_Mounted = () => {

        // 给部门赋值
        x_query_dept_id_s.value = TGlobal.userData["f_dept_id_s"];
        m_query_dept_id = TGlobal.userData["f_dept_id"];

        netLoad_data_view();
    }

    /**
     * 获取一个空的view对象
     */
    const getEmpty_dataview = (): any => {

        return {
            "f_data_field_id": 0,
            "f_dept_id": m_query_dept_id,
            "f_type": x_query_type.value,
            "f_index": 1,
            "f_label": "",
            "f_precision": 0,
            "f_unit": "",
            "f_order": 0,
            "f_visible": 1,
            "f_params": "",
            "f_note": ""
        }
    }

    /**
     * 加载数据显示参数清单
     */
    const netLoad_data_view = () => {

        v_table_view.value!.load_list_proc("np_dataview_list", {
            "v_dept_id": m_query_dept_id,
            "v_type": x_query_type.value
        });
    }

    const onButtonClick_Load = () => {
        netLoad_data_view();
    }

    /**
     * 点击添加设备按钮
     */
    const onButtonClick_Add = async () => {

        if (m_query_dept_id <= 0) {
            eocore.show_info("请选择部门");
            return;
        }

        let viewData = getEmpty_dataview();

        //console.log(fieldData);
        v_formd_view.value!.show_dialog(viewData);
    }
    /**
     * 点击更新设备
     */
    const onButtonClick_Upd = () => {

        let viewData = v_table_view.value!.get_select_data(true);
        if (viewData == undefined) return;

        //console.log(viewData);
        v_formd_view.value!.show_dialog(viewData);
    }
    /**
     * 点击移除设备
     */
    const onButtonClick_Del = () => {
        v_table_view.value!.remove_data_proc_select("np_datafield_del", (data: any) => {
            return {
                "v_data_field_id": data["f_data_field_id"]
            }
        });
    }

    const onTableItem_view = (data: any) => {
    }
    const onTableLoading_view = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableRowClick_view = (data: any) => {
    }

    const onDialogClose_view = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        //console.log(data);

        if (!eocore.check_id(data, "f_dept_id")) {
            eocore.show_error("请选择部门");
            return;
        }

        if (!eocore.check_len(data["f_label"])) {
            eocore.show_error("请输入名称");
            return;
        }
        if (!eocore.check_len(data["f_type"])) {
            eocore.show_error("请选择类型");
            return;
        }

        let viewId = data["f_data_view_id"];

        v_table_view.value!.update_data_proc("np_dataview_upd", {
            "v_data_view_id": viewId,
            "v_dept_id": data["f_dept_id"],
            "v_type": data["f_type"],
            "v_index": data["f_index"],
            "v_label": data["f_label"],
            "v_precision": data["f_precision"],
            "v_unit": data["f_unit"],
            "v_order": data["f_order"],
            "v_visible": data["f_visible"],
            "v_params": data["f_params"],
            "v_note": data["f_note"],
        }, -1, viewId <= 0, true);

        cb(true);
    }

    const onInputChange_dept = (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true);
            return;
        }

        // 给部门赋值
        x_query_dept_id_s.value = data["f_name"];
        m_query_dept_id = data["f_dept_id"];

        //console.log(data);

        cb(true);
    }
    const onDicChange_type = (val: number|string) => {
        netLoad_data_view();
    }
</script>

<style lang="scss" scoped>
</style>