<template>
    <el-dialog v-model="x_show_dialog" 
        width="1000px"
        :show-close="false" 
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>选择客户</span>
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
                    <div class="cell eo_w200p">
                        <div class="label_n">客户名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_khmc" placeholder="请输入客户名称"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">联系信息</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_lxxx" placeholder="联系人或电话"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">客户类别</div>
                        <div class="input">
                            <vdic v-model="x_query_khlb" dic="客户类别" :all="true" field="value" style="width:100%" />
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
            
            <!-- 客户表格 -->
            <div style="height:350px;">
                <vtable ref="v_table_kh" 
                    name="客户"
                    id-field="f_khgl_id" 
                    check="single" 
                    :on-item="onTableItem_kh"
                    :on-page="onTablePage_kh"
                    @loading="onTableLoading">
                    <el-table-column prop="f_jyzt_s" label="状态" width="70" />
                    <el-table-column prop="f_khmc" label="名称" width="200" show-overflow-tooltip />
                    <el-table-column prop="f_hzdj_s" label="等级" width="80" />
                    <el-table-column prop="f_fzr" label="负责人" width="100" show-overflow-tooltip />
                    <el-table-column prop="f_gsdh" label="公司电话" width="120" show-overflow-tooltip />
                    <el-table-column prop="f_khlb_s" label="类别" width="80" />
                    <el-table-column prop="f_khly_s" label="来源" width="100" />
                    <el-table-column prop="f_gsgm_s" label="规模" width="80" />
                    <el-table-column prop="f_xzds" label="地市" width="80" show-overflow-tooltip />
                    <el-table-column prop="f_xzqx" label="区县" width="80" show-overflow-tooltip />
                    <el-table-column prop="f_gsdz" label="地址" width="150" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
            
            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_kh"
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
    import region from "@/inc/region";

    import type {ctree_node, cfunc_boolean} from "@/inc/eotypes";    

    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"
    type t_table = InstanceType<typeof vtable>
    
    const x_show_loading = ref(false);

    const v_table_kh = ref<t_table>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_show_dialog = ref(false);

    // 查询条件
    const x_query_khmc = ref("");
    const x_query_lxxx = ref("");
    const x_query_khlb = ref(-1);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(10);
    const x_row_total = ref(0);

    const show_dialog = async (data: any) => {

        // 重置查询条件
        x_query_khmc.value = "";
        x_query_lxxx.value = "";
        x_query_khlb.value = -1;
        x_page_index.value = 1;

        v_table_kh.value?.load_list([]);

        x_show_dialog.value = true;
    }

    const onDialogOpened = async () => {
        // 加载客户数据
        netLoad_kh_query(-1);
    }

    const onDialogClose = () => {
    }

    const onButtonClick_Cancel = () => {
        emits("close", true, {}, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }

    const onButtonClick_Ok = () => {
        let list = v_table_kh?.value?.get_check_list() || [];
        if (list.length <= 0) {
            eocore.show_info("请选择客户");
            return;
        }

        emits("close", false, list[0], (result: boolean) => {
            x_show_dialog.value = !result;
        });        
    }

    const onButtonClick_Search = () => {
        x_page_index.value = 1;
        netLoad_kh_query(-1);
    }

    /**
     * 查询客户数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_kh_query = (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_table_kh.value?.load_list_proc("p_khgl_query", { 
            "v_xsy_id": -1,
            "v_khmc": x_query_khmc.value,
            "v_lxxx": x_query_lxxx.value,
            "v_khlb": x_query_khlb.value,
            "v_khly": -1,
            "v_hzdj": -1,
            "v_qzyx": -1,
            "v_ghbz": 1,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_kh = (data: any) => {
        // 经营状态
        data["f_jyzt_s"] = eodic.get_dic_label("经营状态", data["f_jyzt"]);
        // 客户类别
        data["f_khlb_s"] = eodic.get_dic_label("客户类别", data["f_khlb"]);        
        // 合作等级
        data["f_hzdj_s"] = eodic.get_dic_label("合作等级", data["f_hzdj"]);        
        // 客户来源
        data["f_khly_s"] = eodic.get_dic_label("客户来源", data["f_khly"]);        
        // 公司规模
        data["f_gsgm_s"] = eodic.get_dic_label("经营规模", data["f_gsgm"]);        
        // 经营方式
        data["f_jyfs_s"] = eodic.get_dic_label("经营方式", data["f_jyfs"]);
        // 客户意向
        data["f_qzyx_s"] = eodic.get_dic_label("客户意向", data["f_qzyx"]);
        
        // 所属行业显示
        data["f_sshy_s"] = eodic.get_dic_label("行业类别", data["f_sshy"]);
        
        // 日期格式化
        data["f_jdsj_s"] = eolib.datetime_2_short(data["f_jdsj"]);
        data["f_gtsj_s"] = eolib.datetime_2_short(data["f_gtsj"]);
        data["f_cjsj_s"] = eolib.datetime_2_short(data["f_cjsj"]);

        data["f_cjje_s"] = eolib.fixed_num(data["f_cjje"], 2);

        data["f_xzqh_s"] = region.set_region_info(
            data["f_xzsf"], data["f_xzds"], data["f_xzqx"]);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_kh = (n: number): number => {
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
    const onPageChange_kh = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kh_query(pageIndex - 1);
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>