<template>
    <!-- 产品类别 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_row">
            <!-- 左侧：产品大类表格 -->
            <div class="eo_row_f">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <div class="info_w">
                                    <span>产品大类</span>
                                </div>
                                 <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Add_cpdl">添加大类</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Del_cpdl">删除大类</vbuttonk>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_cpdl">修改大类</vbuttonk>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" 
                                        @click="onButtonClick_Load_cpdl">刷新</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="eo_col_f">
                        <vtable ref="v_table_cpdl" 
                            name="产品大类"
                            id-field="f_cpdl_id"
                            @loading="onTableLoading"
                            @row-click="onTableRowClick_cpdl">
                            <el-table-column prop="f_dlbm" label="编码" width="120" />
                            <el-table-column prop="f_dlmc" label="名称" width="180" show-overflow-tooltip />
                            <el-table-column prop="f_beizhu" label="描述" width="200" show-overflow-tooltip />
                            <el-table-column />
                        </vtable>
                    </div>
                </div>
            </div>
            
            <!-- 分隔线 -->
            <div class="eo_line_v"></div>
            
            <!-- 右侧：产品小类表格 -->
            <div class="eo_row_f">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <div class="info_w">
                                    <span>产品小类</span>
                                </div>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Add_cpxl">添加小类</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Del_cpxl">删除小类</vbuttonk>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_cpxl">修改小类</vbuttonk>
                            </div>
                        </div>
                    </div>
                    <div class="eo_col_f">
                        <vtable ref="v_table_cpxl" 
                            name="产品小类"
                            id-field="f_cpxl_id"
                            @loading="onTableLoading"
                            @row-click="onTableRowClick_cpxl">
                            <el-table-column prop="f_xlbm" label="编码" width="120" />
                            <el-table-column prop="f_xlmc" label="名称" width="180" show-overflow-tooltip />
                            <el-table-column prop="f_beizhu" label="描述" width="200" show-overflow-tooltip />
                            <el-table-column />
                        </vtable>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 产品类别编辑对话框 -->
        <vformd ref="v_formd_cpdl" title="产品大类" width="500px"
            :form-types="x_form_types_cpdl" @close="onFormdClose_cpdl"/>
        <vformd ref="v_formd_cpxl" title="产品小类" width="500px"
            :form-types="x_form_types_cpxl" @close="onFormdClose_cpxl"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_kcgl_cplb" }
</script>

<script lang="ts" setup>
    import { ref, reactive, onMounted, type Ref } from "vue"
    import type { cform_options, cfunc_boolean, cdic_item } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vbuttonk from "@/components/web/vbuttonk.vue"
    import vtable from "@/components/web/vtable.vue"
    import vformd from "@/components/web/vformd.vue"

    type t_table = InstanceType<typeof vtable>;
    type t_formd = InstanceType<typeof vformd>;
    const v_table_cpdl = ref<t_table>();
    const v_table_cpxl = ref<t_table>();

    const v_formd_cpdl = ref<t_formd>();
    const v_formd_cpxl = ref<t_formd>();

    let x_show_loading = ref(false);
    let x_form_types_cpdl = ref<cform_options[]>([]);
    let x_form_types_cpxl = ref<cform_options[]>([]);

    onMounted(() => {
        // 初始化表单字段配置
        x_form_types_cpdl.value = [
            { type: "input", name: "f_dlbm", span: 100, label: "编码" },
            { type: "input", name: "f_dlmc", span: 100, label: "名称" },
            { type: "text", name: "f_beizhu", span: 100, label: "描述", row: 3 },            
        ];
        x_form_types_cpxl.value = [
            { type: "list", name: "f_cpdl_id", span: 100, label: "大类", list: []},
            { type: "input", name: "f_xlbm", span: 100, label: "编码" },
            { type: "input", name: "f_xlmc", span: 100, label: "名称" },
            { type: "text", name: "f_beizhu", span: 100, label: "描述", row: 3 },            
        ];

        v_table_cpdl.value?.load_list_proc("p_cpdl_list", {});
    });

    const onButtonClick_Load_cpdl = () => {
        v_table_cpdl.value?.load_list_proc("p_cpdl_list", {});
    }

    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show;
    }

    const onTableRowClick_cpdl = (data: any) => {
        
        let cpdlId = data["f_cpdl_id"];
        v_table_cpxl.value?.load_list_proc("p_cpxl_list", { "v_cpdl_id": cpdlId });
    }

    const updateList_cpdl = () => {

        let list = v_table_cpdl.value?.get_list() || [];

        let dic: cdic_item[] = [];
        for (let d of list) {
            dic.push({
                value: d["f_cpdl_id"],
                label: d["f_dlmc"],
                level: 1
            });
        }

        v_formd_cpxl.value?.update_list("f_cpdl_id", dic);
    }

    /**
     * 点击添加大类
     */
    const onButtonClick_Add_cpdl = () => {
        
        let cpdlData = {
            f_cpdl_id: 0,
            f_dlbm: "",
            f_dlmc: "",
            f_beizhu: "",
        };
        
        v_formd_cpdl.value?.show_dialog(cpdlData);
    }

    /**
     * 点击删除大类
     */
    const onButtonClick_Del_cpdl = async () => {
        await v_table_cpdl.value?.remove_data_proc_select("p_cpdl_del", async (data: any) => {
            return {
                "v_cpdl_id": data["f_cpdl_id"]
            };
        });
    }

    /**
     * 修改产品大类
     */
    const onButtonClick_Upd_cpdl = () => {
        let cpdlData = v_table_cpdl.value?.get_select_data(true);
        if (!cpdlData) return;

        v_formd_cpdl.value?.show_dialog(cpdlData);
    }

    const onButtonClick_Add_cpxl = () => {

        let sel = v_table_cpdl.value?.get_select_data(true);
        if (sel == undefined) return;

        updateList_cpdl();

        let cpxlData = {
            f_cpxl_id: 0,
            f_cpdl_id: sel["f_cpdl_id"],
            f_cpdl_id_s: sel["f_dlmc"],
            f_xlbm: "",
            f_xlmc: "",
            f_beizhu: "",
        };
        
        v_formd_cpxl.value?.show_dialog(cpxlData);
    }

    const onButtonClick_Del_cpxl = async () => {
        await v_table_cpxl.value?.remove_data_proc_select("p_cpxl_del", async (data: any) => {
            return {
                "v_cpxl_id": data["f_cpxl_id"]
            };
        });
    }

    /**
     * 删除小类按钮点击事件
     */
    const onButtonClick_Upd_cpxl = () => {
        let cpxlData = v_table_cpxl.value?.get_select_data(true);
        if (!cpxlData) return;

        v_formd_cpxl.value?.show_dialog(cpxlData);
    }

    const onTableRowClick_cpxl = (data: any) => {
        // 选中产品小类项
    }

    // 产品小类编辑对话框关闭事件
    const onFormdClose_cpdl = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true);
            return;
        }

        console.log(data);
        
        // 验证数据
        if (!data["f_dlbm"] || !data["f_dlmc"]) {
            eocore.show_info("请填写完整的编码和名称");
            cb(false);
            return;
        }
        
        let isAdd = data["f_cpdl_id"] == 0;
        await v_table_cpdl.value?.update_data_proc(
            "p_cpdl_upd", {
                "v_cpdl_id": data["f_cpdl_id"],
	            "v_dlbm": data["f_dlbm"],
	            "v_dlmc": data["f_dlmc"],
	            "v_beizhu": data["f_beizhu"]
            }, -1, isAdd, true);
        
        cb(true);
    }
    const onFormdClose_cpxl = async (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true);
            return;
        }

        if (!eocore.check_id(data, "f_cpdl_id")) {
            eocore.show_info("请选择大类");
            cb(false);
            return;
        }
        
        // 验证数据
        if (!data["f_xlbm"] || !data["f_xlmc"]) {
            eocore.show_info("请填写完整的编码和名称");
            cb(false);
            return;
        }
        
        let isAdd = data["f_cpxl_id"] == 0;
        await v_table_cpxl.value?.update_data_proc(
            "p_cpxl_upd", {
                "v_cpxl_id": data["f_cpxl_id"],
                "v_cpdl_id": data["f_cpdl_id"],
	            "v_xlbm": data["f_xlbm"],
	            "v_xlmc": data["f_xlmc"],
	            "v_beizhu": data["f_beizhu"]
            }, -1, isAdd, true);

        cb(true);
    }
</script>

<style lang="scss" scoped>
</style>