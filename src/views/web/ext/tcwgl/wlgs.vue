<template>
    <!-- 物流公司管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">            
            <!-- 操作工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell">
                        <vbuttonk type="primary" class="input_w" permit="" 
                            @click="onButtonClick_Add_wlgs">添加</vbuttonk>
                        <vbuttonk type="default" class="input_w" permit="" 
                            @click="onButtonClick_Del_wlgs">删除</vbuttonk>
                        <vbuttonk type="primary" class="input_w" permit="" 
                            @click="onButtonClick_Upd_wlgs">修改</vbuttonk>
                        <div class="split"></div>
                        <vbuttonk type="primary" class="input_w" permit="" 
                            @click="onButtonClick_Load_wlgs">刷新</vbuttonk>
                    </div>
                </div>
            </div>
            
            <!-- 物流公司表格 -->
            <div class="eo_col_f">
                <vtable ref="v_table_wlgs" 
                    name="物流公司"
                    id-field="f_wlgs_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_wlgs"
                    @row-click="onTableRowClick_wlgs">
                    <el-table-column prop="f_gsmc" label="名称" width="200" show-overflow-tooltip />
                    <el-table-column prop="f_hzdj_s" label="等级" width="100" />
                    <el-table-column prop="f_lxr" label="联系人" width="120" show-overflow-tooltip />
                    <el-table-column prop="f_lxdh" label="电话" width="140" show-overflow-tooltip />
                    <el-table-column prop="f_gsdz" label="地址" width="200" show-overflow-tooltip />
                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
        </div>
        
        <!-- 物流公司编辑对话框 -->
        <vformd ref="v_formd_wlgs" 
            title="物流公司" 
            width="600px"
            :form-types="x_form_types_wlgs"
            @close="onFormdClose_wlgs"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_cwgl_wlgs" }
</script>

<script lang="ts" setup>
    import { ref, nextTick, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import vbuttonk from "@/components/web/vbuttonk.vue"
    import vtable from "@/components/web/vtable.vue"
    import vdic from "@/components/web/vdic.vue"
    import vformd from "@/components/web/vformd.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_wlgs = ref<t_table>();

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_wlgs = ref<t_formd>();

    // 物流公司表单配置
    const x_form_types_wlgs = ref<cform_options[]>([
        { type: "input", name: "f_gsmc", span: 2, label: "公司名称 *" },
        { type: "dic", name: "f_hzdj", span: 2, label: "合作等级", dic: "合作等级", all: false, field: "value" },
        { type: "input", name: "f_lxr", span: 2, label: "联系人" },
        { type: "input", name: "f_lxdh", span: 2, label: "联系电话" },
        { type: "input", name: "f_gsdz", span: 100, label: "公司地址" },
        { type: "input", name: "f_wldh", span: 100, label: "单号规则" },
        { type: "input", name: "f_beizhu", span: 100, label: "备注" },
    ]);

    // 加载状态
    const x_show_loading = ref(false);

    onMounted(async () => {
        // 初始化加载数据
        v_table_wlgs.value?.load_list_proc("p_wlgs_list", {});
    });

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_wlgs = (data: any) => {
        // 合作等级显示 - 使用get_dic_label方法
        data["f_hzdj_s"] = eodic.get_dic_label("合作等级", data["f_hzdj"]);
        
        // 日期格式化
        if (data["f_cjsj"]) {
            data["f_cjsj_s"] = eolib.datetime_2_string(data["f_cjsj"]);
        }
    }

    /**
     * 加载状态处理
     * @param show 是否显示加载状态
     */
    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show;
    }

    /**
     * 表格行点击事件
     * @param data 行数据
     */
    const onTableRowClick_wlgs = (data: any) => {
        // 点击行后的操作，如选中高亮等
    }

    // ========== 工具栏操作 ==========
    
    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_wlgs = () => {
        v_table_wlgs.value?.load_list_proc("p_wlgs_list", {});
    }

    /**
     * 添加物流公司
     */
    const onButtonClick_Add_wlgs = () => {

        let wlgsData = {
            f_wlgs_id: 0,
            f_gsmc: "",          // 公司名称
            f_hzdj: 1, // 合作等级
            f_lxr: "",           // 联系人
            f_lxdh: "",          // 联系电话
            f_gsdz: "",          // 公司地址
            f_wldh: "",          // 物流单号规则
            f_beizhu: ""             // 备注
        };
        v_formd_wlgs.value?.show_dialog(wlgsData);
    }

    /**
     * 删除物流公司
     */
    const onButtonClick_Del_wlgs = async () => {
        await v_table_wlgs.value?.remove_data_proc_select("p_wlgs_del", async (data: any) => {
            return {
                "v_wlgs_id": data["f_wlgs_id"]
            };
        });
    }

    /**
     * 修改物流公司
     */
    const onButtonClick_Upd_wlgs = () => {
        let wlgsData = v_table_wlgs.value?.get_select_data(true);
        if (!wlgsData) return;
        
        v_formd_wlgs.value?.show_dialog(wlgsData);
    }

    /**
     * 物流公司编辑对话框关闭事件
     */
    const onFormdClose_wlgs = async (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true);
            return;
        }
        
        // 验证数据
        if (!data["f_gsmc"]) {
            eocore.show_info("请填写公司名称");
            cb(false);
            return;
        }
        
        try {

            let isAdd = data["f_wlgs_id"] == 0;
            await v_table_wlgs.value?.update_data_proc(
                "p_wlgs_upd", {
                    "v_wlgs_id": data["f_wlgs_id"],
                    "v_gsmc": data["f_gsmc"],
                    "v_hzdj": data["f_hzdj"],
                    "v_lxr": data["f_lxr"],
                    "v_lxdh": data["f_lxdh"],
                    "v_gsdz": data["f_gsdz"],
                    "v_wldh": data["f_wldh"],
                    "v_beizhu": data["f_beizhu"]
                }, -1, isAdd, true);
            
            cb(true);
            
        } catch (error) {
            eocore.show_error("保存失败：" + error);
            cb(false);
        }
    }
</script>

<style lang="scss" scoped>
</style>