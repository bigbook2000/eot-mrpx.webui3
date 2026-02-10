<template>
    <!-- 供应商管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_n">名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_gysmc" placeholder="供应商名称"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">产品</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_zycp" placeholder="主营产品"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">联系人</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_lxr" placeholder="联系人"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">电话</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_lxdh" placeholder="联系电话"></el-input>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_gys">查找</el-button>
                        </div>                        
                    </div>
                </div>
            </div>
            
            <div class="eo_col_sp"></div>
            
            <!-- 操作工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell">
                        <vbuttonk type="primary" class="input_w" permit="" 
                            @click="onButtonClick_Add_gys">添加</vbuttonk>
                        <vbuttonk type="default" class="input_w" permit="" 
                            @click="onButtonClick_Del_gys">删除</vbuttonk>
                        <vbuttonk type="primary" class="input_w" permit="" 
                            @click="onButtonClick_Upd_gys">修改</vbuttonk>
                    </div>
                </div>
            </div>
            
            <!-- 供应商表格 -->
            <div class="eo_col_f">
                <vtable ref="v_table_gys" 
                    name="供应商"
                    id-field="f_gys_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_gys"
                    :on-page="onTablePage_gys"
                    @row-click="onTableRowClick_gys">
                    <el-table-column prop="f_jyzt_s" label="状态" width="70" />
                    <el-table-column prop="f_gysmc" label="名称" width="280" show-overflow-tooltip />
                    <el-table-column prop="f_hzdj_s" label="等级" width="100" />
                    <el-table-column prop="f_lxr" label="联系人" width="120" show-overflow-tooltip />
                    <el-table-column prop="f_lxdh" label="联系电话" width="140" show-overflow-tooltip />
                    <el-table-column prop="f_lxdz" label="地址" width="200" show-overflow-tooltip />
                    <el-table-column prop="f_jyfs_s" label="经营方式" width="120" />
                    <el-table-column prop="f_gsgm_s" label="规模" width="100" />
                    <el-table-column prop="f_kysj_s" label="开业时间" width="120" />
                    <el-table-column prop="f_jyfw" label="经营范围" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_zycp" label="主营产品" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_gswz" label="公司网址" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_gysbz" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
            
            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_gys"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next, jumper"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>
        
        <!-- 供应商编辑对话框 -->
        <vformd ref="v_formd_gys" 
            title="供应商信息" 
            width="800px"
            :form-types="x_form_types_gys"
            @close="onFormdClose_gys"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_cggl_gys" }
</script>

<script lang="ts" setup>
    import { ref, nextTick, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"
    import vformd from "@/logic/common/vformd.vue"
    import eodic from "@/inc/eodic";

    type t_table = InstanceType<typeof vtable>;
    const v_table_gys = ref<t_table>();

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_gys = ref<t_formd>();

    // 供应商表单配置
    const x_form_types_gys = ref<cform_options[]>([
        { type: "input", name: "f_gysmc", span: 2, label: "名称 *" },
        { type: "dic", name: "f_hzdj", span: 2, label: "等级", dic: "合作等级", all: false, field: "value" },
        { type: "input", name: "f_lxr", span: 2, label: "联系人 *" },
        { type: "input", name: "f_lxdh", span: 2, label: "联系电话 *" },
        { type: "dic", name: "f_jyfs", span: 2, label: "经营方式", dic: "经营方式", all: false, field: "value" },
        { type: "dic", name: "f_gsgm", span: 2, label: "规模", dic: "经营规模", all: false, field: "value" },
        { type: "date", name: "f_kysj", span: 2, label: "开业时间" },
        { type: "dic", name: "f_jyzt", span: 2, label: "状态", dic: "经营状态", all: false, field: "value" },
        { type: "input", name: "f_lxdz", span: 100, label: "地址" },
        { type: "input", name: "f_jyfw", span: 100, label: "经营范围" },
        { type: "input", name: "f_zycp", span: 100, label: "主营产品" },
        { type: "input", name: "f_gswz", span: 100, label: "公司网址" },
        { type: "input", name: "f_gysbz", span: 100, label: "备注" }
    ]);

    // 查询条件
    const x_query_gysmc = ref("");
    const x_query_lxr = ref("");
    const x_query_lxdh = ref("");
    const x_query_zycp = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    onMounted(async () => {
        // 初始化加载数据
        netLoad_gys_query(-1);
    });

    /**
     * 查询供应商数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_gys_query = (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_table_gys.value?.load_list_proc("p_gys_query", { 
            "v_hzdj": -1,
            "v_gsgm": -1,
            "v_gysmc": x_query_gysmc.value,
            "v_lxr": x_query_lxr.value,
            "v_lxdh": x_query_lxdh.value,
            "v_zycp": x_query_zycp.value,            
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_gys = (data: any) => {
        // 状态显示
        data["f_jyzt_s"] = "";
        if (data["f_jyzt"] != 1) {
            data["f_jyzt_s"] = eodic.get_dic_label("经营状态", data["f_jyzt"]);
        }
        
        // 供应商等级显示
        data["f_hzdj_s"] = eodic.get_dic_label("合作等级", data["f_hzdj"]);
        
        // 经营方式显示
        data["f_jyfs_s"] = eodic.get_dic_label("经营方式", data["f_jyfs"]);
        
        // 供应商规模显示
        data["f_gsgm_s"] = eodic.get_dic_label("经营规模", data["f_gsgm"]);        
        
        // 时间格式化
        if (data["f_kysj"]) {
            data["f_kysj_s"] = eolib.date_2_string(data["f_kysj"]);
        }
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_gys = (n: number): number => {
        x_row_total.value = n;
        return n;
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
    const onTableRowClick_gys = (data: any) => {
        // 点击行后的操作，如选中高亮等
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_gys = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_gys_query(pageIndex - 1);
    }

    // ========== 工具栏操作 ==========
    
    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_gys = () => {
        netLoad_gys_query(-1);
    }

    /**
     * 添加供应商
     */
    const onButtonClick_Add_gys = () => {

        let dts = eolib.date_2_string(new Date());

        let gysData = {
            f_gys_id: 0,
            f_hzdj: 1,      // 供应商等级
            f_jyfs: 1,        // 经营方式
            f_gsgm: 1,  // 供应商规模
            f_gysmc: "",      // 供应商名称
            f_kysj: dts, // 开业时间
            f_lxr: "",        // 联系人
            f_lxdh: "",       // 联系电话
            f_lxdz: "",         // 地址
            f_jyfw: "", // 经营范围
            f_zycp: "", // 主营产品
            f_gswz: "", // 公司网址
            f_jyzt: 1,       // 状态（1:启用，0:停用）
            f_gysbz: ""          // 备注
        };
        
        v_formd_gys.value?.show_dialog(gysData);
    }

    /**
     * 删除供应商
     */
    const onButtonClick_Del_gys = async () => {
        await v_table_gys.value?.remove_data_proc_select("p_gys_del", async (data: any) => {
            return {
                "v_gys_id": data["f_gys_id"]
            };
        });
    }

    /**
     * 修改供应商
     */
    const onButtonClick_Upd_gys = () => {
        let gysData = v_table_gys.value?.get_select_data(true);
        if (!gysData) return;
        
        v_formd_gys.value?.show_dialog(gysData);
    }

    /**
     * 供应商编辑对话框关闭事件
     */
    const onFormdClose_gys = async (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true);
            return;
        }
        
        // 验证数据
        if (!data["f_gysmc"]) {
            eocore.show_info("请填写供应商名称");
            cb(false);
            return;
        }

        if (!data["f_lxr"]) {
            eocore.show_info("请填写联系人");
            cb(false);
            return;
        }

        if (!data["f_lxdh"]) {
            eocore.show_info("请填写联系电话");
            cb(false);
            return;
        }

        try {

            let isAdd = data["f_gys_id"] == 0;
            await v_table_gys.value?.update_data_proc(
                "p_gys_upd", {
                    "v_gys_id": data["f_gys_id"],
                    "v_hzdj": data["f_hzdj"],
                    "v_jyfs": data["f_jyfs"],
                    "v_gsgm": data["f_gsgm"],
                    "v_gysmc": data["f_gysmc"],
                    "v_kysj": data["f_kysj"],
                    "v_lxr": data["f_lxr"],
                    "v_lxdh": data["f_lxdh"],
                    "v_lxdz": data["f_lxdz"],
                    "v_jyfw": data["f_jyfw"],
                    "v_zycp": data["f_zycp"],
                    "v_gswz": data["f_gswz"],
                    "v_jyzt": data["f_jyzt"],
                    "v_gysbz": data["f_gysbz"]
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