<template>
    <div class="eo_page">
        <!-- 销售查询 -->
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">批次</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_kcbh" placeholder="产品批次"></el-input>
                        </div>
                    </div>                    
                    <div class="cell eo_w240p">
                        <div class="label_n">销售员</div>
                        <div class="input">
                            <user_input v-model="x_query_xsy_id"
                                :userName="x_query_xsy_id_s"
                                :disabled="!x_query_xsy"
                                style="width:100%"></user_input>
                        </div>
                    </div>
                    <div class="cell" style="width:320px;">
                        <div class="label_n">销售时间</div>
                        <div class="input">
                            <el-date-picker style="width:100%"
                                v-model="x_query_cjsj"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD">
                            </el-date-picker>
                        </div>
                    </div>

                </div>
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">客户名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="64"
                                v-model="x_query_khmc" placeholder="客户名称"></el-input>
                        </div>
                    </div>                    
                    <div class="cell eo_w240p">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpmc" placeholder="产品名称"></el-input>
                        </div>
                    </div>

                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_kcmx">查找</el-button>
                        </div>                        
                    </div>
                </div>
            </div>
            
            <div class="eo_col_sp"></div>
            
            <!-- 产品表格 -->
            <div class="eo_col_f">
                <vtable ref="v_table_xsdck" 
                    name="库存明细"
                    id-field="f_kcmx_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_xsdck"
                    :on-page="onTablePage_xsdck"
                    @row-click="onTableRowClick_xsdck">
                    <el-table-column prop="f_cjsj_s" label="时间" width="140" />
                    <el-table-column prop="f_kcbh" label="批次" width="200" />
                    <el-table-column prop="f_cpmc" label="产品名称" width="180" show-overflow-tooltip />                    
                    <el-table-column prop="f_xsje_s" label="金额" width="120" align="right" />
                    <el-table-column prop="f_kcsl" label="数量" width="120" />
                    <el-table-column prop="f_xsy_id_s" label="销售员" width="120" />
                    <el-table-column prop="f_khgl_id_s" label="客户" width="280" show-overflow-tooltip />
                    <el-table-column prop="f_xsdh" label="订单号" width="160" />
                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
            
            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_xsdck"
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
export default { name: "ext_xsgl_xscx" }
</script>

<script lang="ts" setup>
    import { ref, onMounted } from "vue"

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import vtable from "@/components/web/vtable.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import user_input from "@/views/platform/user_input.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_xsdck = ref<t_table>();

    // 查询条件
    const x_query_xsy_id = ref(-1);
    const x_query_xsy_id_s = ref("");
    const x_query_xsy = ref(false);

    const x_query_khmc = ref("");
    const x_query_cjsj = ref<[string, string] | undefined>(undefined);
    const x_query_kcbh = ref("");
    const x_query_cpmc = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    onMounted(() => {
        x_query_xsy_id.value = TGlobal.userData["f_user_id"];
        x_query_xsy_id_s.value = TGlobal.userData["f_name"];

        if (TLogic.checkPermit("platform.user.dept")) {
            x_query_xsy.value = true;
        }

        let dt = new Date();
        const jssj = eolib.date_end(dt);
        dt.setMonth(dt.getMonth() - 1);
        const kssj = eolib.date_start(dt);
        x_query_cjsj.value = [kssj, jssj];

        // 加载产品数据
        netLoad_xsdck_query(-1);
    });

    /**
     * 查询产品数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_xsdck_query = async (pageIndex: number = -1) => {

        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        let cjsj1 = eolib.date_start(x_query_cjsj.value?.[0]);
        let cjsj2 = eolib.date_end(x_query_cjsj.value?.[1]);

        v_table_xsdck.value?.load_list_proc("p_xsdck_query", { 
            "v_xsy_id": x_query_xsy_id.value,
            "v_khgl_id": -1,
            "v_khmc": x_query_khmc.value,
            "v_xsdh": "", 
            "v_cjsj1": cjsj1, 
            "v_cjsj2": cjsj2, 
            "v_kcbh": x_query_kcbh.value, 
            "v_cpmc": x_query_cpmc.value, 
            "v_order_by": " ORDER BY f_xsdck_id DESC",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    
    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_xsdck = (data: any) => {

        data["f_cjsj_s"] = eolib.date_2_string(data["f_cjsj"]);

        data["f_xsje_s"] = 
            eolib.fixed_num(eocore.to_float(data["f_xsdj"] * data["f_kcsl"]), 2);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_xsdck = (n: number): number => {
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
    const onTableRowClick_xsdck = (data: any) => {
        // 点击行后的操作，如选中高亮等
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_xsdck = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_xsdck_query(pageIndex - 1);
    }

    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_kcmx = () => {
        netLoad_xsdck_query(-1);
    }
</script>

<style lang="scss" scoped>
</style>