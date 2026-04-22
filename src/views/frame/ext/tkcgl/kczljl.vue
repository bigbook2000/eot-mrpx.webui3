<template>
    <!-- 库存产品明细变更记录查询 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpmc" placeholder="请输入产品名称"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">产品编码</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpbm" placeholder="请输入产品编码"></el-input>
                        </div>
                    </div>
                    <div class="cell" style="width:320px;">
                        <div class="label_n">变更时间</div>
                        <div class="input">
                            <el-date-picker style="width:100%"
                                v-model="x_query_bgsj"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_kcmxjl">查找</el-button>
                        </div>                        
                    </div>
                </div>
            </div>
            
            <div class="eo_col_sp"></div>

            <div class="eo_col_f">
                <div class="eo_col">
                    <!-- 库存变更记录表格 -->
                    <div class="eo_col_f">
                        <vtable ref="v_table_kcmxjl" 
                            name="库存变更记录"
                            id-field="f_kcmxjl_id"
                            @loading="onTableLoading"
                            :on-item="onTableItem_kcmxjl"
                            :on-page="onTablePage_kcmxjl"
                            @sort-change="onTableSortChange">
                            <el-table-column prop="f_cpbm" label="产品编码" width="160" sortable />
                            <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip sortable />
                            <el-table-column prop="f_bglx_s" label="变更类型" width="120" />
                            <el-table-column prop="f_bgsj_s" label="变更时间" width="160" sortable />
                            <el-table-column prop="f_bzsl" label="变更数量" width="120" align="right" />
                            <el-table-column prop="f_bzje" label="变更金额" width="120" align="right" />
                            <el-table-column prop="f_kcsl" label="库存数量" width="120" align="right" />
                            <el-table-column prop="f_kcje" label="库存金额" width="120" align="right" />
                            <el-table-column prop="f_czr_id_s" label="操作人" width="120" />
                            <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                            <el-table-column />
                        </vtable>
                    </div>
                    
                    <!-- 分页 -->
                    <div class="eo_page_bar">
                        <el-pagination
                            background
                            @current-change="onPageChange_kcmxjl"
                            :current-page="x_page_index"
                            :page-size="x_page_row_count"
                            layout="total, prev, pager, next, jumper"
                            :total="x_row_total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_kcgl_kczljl" }
</script>

<script lang="ts" setup>
    import { ref, onMounted } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vtable from "@/logic/common/vtable.vue"
    import eodic from "@/inc/eodic";
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_table = InstanceType<typeof vtable>;
    const v_table_kcmxjl = ref<t_table>();

    // 查询条件
    const x_query_cpmc = ref("");
    const x_query_cpbm = ref("");
    const x_query_bgsj = ref<[string, string] | null>(null);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    // 排序数组
    const m_orderby = ref([{
        name: "f_kcmxjl_id",
        order: " DESC"
    }]);

    // 排序映射
    const m_orderby_list = [
        {
            name: "f_cpbm",
            field: "`f_cpbm`"
        },
        {
            name: "f_cpmc",
            field: "`f_cpmc`"
        },
        {
            name: "f_bgsj_s",
            field: "`f_bgsj`"
        }
    ];

    onMounted(async () => {
        // 初始化加载数据
        netLoad_kcmxjl_query(-1);        
    });

    /**
     * 获取排序字符串
     */
    const getOrderByString = () => {
        let s = "";
        let df;
        for (let d of m_orderby.value) {
            df = "";
            for (let d1 of m_orderby_list) {
                if (d.name == d1.name) df = d1.field;
            }

            if (df == "") continue;

            s += "," + df + d.order;
        }

        if (s.length > 0) {
            // ORDER BY 前面必须有空格
            s = " ORDER BY " + s.substring(1);
        }
        
        return s;
    }

    /**
     * 查询库存变更记录数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_kcmxjl_query = (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        // 处理日期范围
        let startDate = "";
        let endDate = "";
        if (x_query_bgsj.value) {
            startDate = x_query_bgsj.value[0];
            endDate = x_query_bgsj.value[1];
        }

        let orderBy = getOrderByString();

        v_table_kcmxjl.value?.load_list_proc("p_kcmxjl_query", { 
            "v_cpmc": x_query_cpmc.value,
            "v_cpbm": x_query_cpbm.value,
            "v_start_bgsj": startDate,
            "v_end_bgsj": endDate,
            "v_order_by": orderBy,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    /**
     * 表格排序变化处理
     * @param evt 排序事件参数
     */
    const onTableSortChange = (evt: any) => {
        // 排序
        console.log(evt.column, evt.prop, evt.order);

        let dn = evt.prop;

        let ds = "";
        if (evt.order == "descending") ds = " DESC";

        // 先移除以前的
        let i = 0;
        for (let d of m_orderby.value) {
            if (d.name == dn) break;
            ++i;
        }
        if (i < m_orderby.value.length) {
            m_orderby.value.splice(i, 1);
        }

        m_orderby.value.unshift({
            name: dn,
            order: ds
        })

        console.log(m_orderby.value);
        netLoad_kcmxjl_query(-1);
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_kcmxjl = (data: any) => {
        // 变更类型显示
        // 1:入库 2:出库 3:调整 4:盘盈 5:盘亏
        const bglxMap: any = {
            "1": "入库",
            "2": "出库",
            "3": "调整",
            "4": "盘盈",
            "5": "盘亏"
        };
        data["f_bglx_s"] = bglxMap[data["f_bglx"]] || "未知";
        
        // 日期格式化
        if (data["f_bgsj"]) {
            data["f_bgsj_s"] = eolib.datetime_2_short(data["f_bgsj"], true);
        }

        // 金额格式化
        data["f_bzje"] = eolib.fixed_num(data["f_bzje"], 3);
        data["f_kcje"] = eolib.fixed_num(data["f_kcje"], 3);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_kcmxjl = (n: number): number => {
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
    const onPageChange_kcmxjl = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kcmxjl_query(pageIndex - 1);
    }
    
    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_kcmxjl = () => {
        netLoad_kcmxjl_query(-1);
    }
</script>

<style lang="scss" scoped>
</style>