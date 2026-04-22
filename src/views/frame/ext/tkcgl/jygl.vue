<template>
    <!-- 借用记录 -->
    <div class="eo_page" v-loading="x_show_loading">    
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">批次</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_kcbh"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">开始时间</div>
                        <div class="input">
                            <el-date-picker style="width:100%"
                                v-model="x_query_kssj"
                                type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">员工</div>
                        <div class="input">
                            <user_input v-model="x_query_yg_id" 
                                :userName="x_query_yg_id_s" 
                                style="width:100%"></user_input>
                        </div>
                    </div>

                </div>
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpmc"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">结束时间</div>
                        <div class="input">
                            <el-date-picker style="width:100%"
                                v-model="x_query_jssj"
                                type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </div>
                    </div>

                    <div class="cell eo_w200p">
                        <div class="label_n">调拨状态</div>
                        <div class="input">
                            <vdic style="width:100%" dic="调拨状态" :all="true" field="value"
                                v-model="x_query_jyzt" />
                        </div>
                    </div>

                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_kcjy">查找</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="eo_col_sp"></div>            

            <!-- 操作工具栏 -->
            <!--
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell">
                        <vbuttonk type="primary" class="input_w" permit="" 
                            @click="onButtonClick_Add_jyd">借用</vbuttonk>
                        <vbuttonk type="primary" class="input_w" permit="" 
                            @click="onButtonClick_Upd_jyd">归还</vbuttonk>
                    </div>
                </div>
            </div>
            -->
            
            <div class="eo_col_f">
                <vtable ref="v_table_kcjy" 
                    name="库存借用"
                    id-field="f_kcjy_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_kcjy"
                    :on-page="onTablePage_kcjy"
                    @row-click="onTableRowClick_kcjy">
                    <el-table-column prop="f_jysj_s" label="借用时间" width="140" />
                    <el-table-column prop="f_jyzt_s" label="状态" width="80" />
                    <el-table-column prop="f_yg_id_s" label="员工" width="120" />
                    <el-table-column prop="f_kcbh" label="批次" width="200" />                    
                    <el-table-column prop="f_cpmc" label="产品名称" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_cpsl" label="单件数量" width="100" />
                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />                    
                    <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                    <el-table-column prop="f_kgy_id_s" label="库管员" width="120" show-overflow-tooltip />
                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>

                        
            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_kcjy"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next, jumper"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_kcgl_jygl" }
</script>


<script lang="ts" setup>
    import { ref, nextTick, onMounted, type Ref } from "vue"
    import type { cform_options, cfunc_boolean, cdic_item, ctree_node } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import { ElTree } from 'element-plus'
    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"

    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    import user_input from "@/views/platform/user_input.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_kcjy = ref<t_table>();

    let x_show_loading = ref(false);

    const x_query_kcbh = ref("");
    const x_query_kssj = ref("");
    const x_query_jssj = ref("");
    const x_query_jyzt = ref(-1);
    const x_query_yg_id = ref(-1);
    const x_query_yg_id_s = ref("");
    const x_query_cpmc = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);    

    onMounted(async () => {
        await netLoad_kcjy_query(-1);
    });


    const netLoad_kcjy_query = async (pageIndex: number = -1) => {

        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        const kssj = eolib.datetime_2_string(x_query_kssj.value);
        const jssj = eolib.datetime_2_string(x_query_jssj.value);

        v_table_kcjy.value?.load_list_proc("p_kcjym_query", { 
            "v_kcbh": x_query_kcbh.value, 
            "v_kssj": kssj, 
            "v_jssj": jssj, 
            "v_jyzt": x_query_jyzt.value, 
            "v_yg_id": x_query_yg_id.value, 
            "v_cpmc": x_query_cpmc.value, 
            "v_order_by": " ORDER BY f_kcjy_id DESC",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableItem_kcjy = (data: any) => {
        // 调拨状态
        data["f_jyzt_s"] = eodic.get_dic_label("调拨状态", data["f_jyzt"]);

        // 日期格式化
        data["f_jysj_s"] = eolib.datetime_2_short(data["f_jysj"]);

        // 用户转换
        TLogic.updateDicUserData(data, ["f_yg_id", "f_kgy_id"]);
    }
    const onTablePage_kcjy = (n: number): number => {
        x_row_total.value = n;
        return n;
    }

    const onTableRowClick_kcjy = (data: any) => {
    }

    const onButtonClick_Load_kcjy = () => {
        netLoad_kcjy_query(-1);
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_kcjy = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kcjy_query(pageIndex);
    }

    const onButtonClick_Add_jyd = () => {
    }
    const onButtonClick_Del_jyd = () => {
    }
    const onButtonClick_Upd_jyd = () => {
    }

    /**
     * 保存事件处理
     */
    const onDialogClose_jygl_xx = async (data: any, isAdd: boolean) => {

    }
</script>

<style lang="scss" scoped>
</style>