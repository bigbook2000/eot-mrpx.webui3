<template>
    <el-dialog v-model="x_show_dialog" 
        width="900px"
        :show-close="false" 
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>选择供应商</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div v-loading="x_show_loading">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_gysmc" placeholder="请输入供应商名称"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">联系人</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_lxr" placeholder="请输入联系人"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">电话</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_lxdh" placeholder="请输入联系电话"></el-input>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Search">查找</el-button>
                        </div>                        
                    </div>
                </div>
            </div>
            
            <div class="eo_col_sp"></div>
            
            <!-- 供应商表格 -->
            <div style="height:350px;">
                <vtable ref="v_table_gys" 
                    name="供应商"
                    id-field="f_gys_id" 
                    check="single" 
                    :on-item="onTableItem_gys"
                    :on-page="onTablePage_gys"
                    @loading="onTableLoading">
                    <el-table-column prop="f_jyzt_s" label="状态" width="70" />
                    <el-table-column prop="f_gysmc" label="名称" width="280" show-overflow-tooltip />
                    <el-table-column prop="f_hzdj_s" label="等级" width="80" />
                    <el-table-column prop="f_lxr" label="联系人" width="100" show-overflow-tooltip />
                    <el-table-column prop="f_lxdh" label="联系电话" width="130" show-overflow-tooltip />
                    <el-table-column prop="f_lxdz" label="地址" width="150" show-overflow-tooltip />
                    <el-table-column prop="f_zycp" label="主营产品" width="150" show-overflow-tooltip />
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
            
            <div>
                <div class="sv_dialog_foot">
                    <div class="button">
                        <el-button type="default" class="eo_w100" @click="onButtonClick_Cancel">取消</el-button>
                    </div>
                    <div class="button">
                        <el-button type="primary" class="eo_w100" @click="onButtonClick_Ok">确定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">

    import { ref, reactive, nextTick } from "vue"

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import type {ctree_node, cfunc_boolean} from "@/inc/eotypes";    

    import vtable from "@/logic/common/vtable.vue"
    type t_table = InstanceType<typeof vtable>
    
    const x_show_loading = ref(false);

    const v_table_gys = ref<t_table>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_show_dialog = ref(false);

    // 查询条件
    const x_query_gysmc = ref("");
    const x_query_lxr = ref("");
    const x_query_lxdh = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(10);
    const x_row_total = ref(0);

    const show_dialog = async (data: any) => {

        // 重置查询条件
        x_query_gysmc.value = "";
        x_query_lxr.value = "";
        x_query_lxdh.value = "";
        x_page_index.value = 1;

        v_table_gys.value?.load_list([]);

        x_show_dialog.value = true;
    }

    const onDialogOpened = async () => {
        // 加载供应商数据
        netLoad_gys_query(-1);
    }

    const onDialogClose = () => {
    }

    const onButtonClick_Cancel = () => {
        emits("close", true, {}, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }

    const onButtonClick_Ok = () => {
        let list = v_table_gys?.value?.get_check_list() || [];
        if (list.length <= 0) {
            eocore.show_info("请选择供应商");
            return;
        }

        emits("close", false, list[0], (result: boolean) => {
            x_show_dialog.value = !result;
        });        
    }

    const onButtonClick_Search = () => {
        x_page_index.value = 1;
        netLoad_gys_query(-1);
    }

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
            "v_zycp": "",            
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
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_gys = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_gys_query(pageIndex - 1);
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>