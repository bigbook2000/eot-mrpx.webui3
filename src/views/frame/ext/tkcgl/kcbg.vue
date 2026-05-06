<template>
    <!-- 库存变更 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w280p">
                        <div class="label_n">批次</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_kcbh" placeholder="批次"></el-input>
                        </div>
                    </div>
                    
                    <div class="cell" style="width:400px;">
                        <div class="label_n">产品类别</div>
                        <div class="input">
                            <tcplb v-model="x_query_cplb" :cplb-list="x_cplb_list"></tcplb>
                        </div>
                    </div>
                    
                </div>
                <div class="eo_form">                    
                    <div class="cell eo_w280p">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpmc" placeholder="产品名称"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_n">变更类别</div>
                        <div class="input">
                            <el-select style="width:100%" v-model="x_query_bglb" placeholder="变更类别">
                                <el-option label="-" value=""></el-option>
                                <el-option label="采购入库" value="采购入库"></el-option>
                                <el-option label="生产入库" value="生产入库"></el-option>
                                <el-option label="整理入库" value="整理入库"></el-option>
                                <el-option label="销售出库" value="销售出库"></el-option>
                                <el-option label="生产出库" value="生产出库"></el-option>
                                <el-option label="整理出库" value="整理出库"></el-option>

                            </el-select>
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

            <div class="eo_col_f">
                <!-- 库存明细表格 -->
                <vtable ref="v_table_kcmx" 
                    name="库存明细"
                    id-field="f_kcmx_id"
                    check="single" 
                    @loading="onTableLoading"
                    :on-item="onTableItem_kcmx"
                    :on-page="onTablePage_kcmx"
                    @row-click="onTableRowClick_kcmx"
                    @sort-change="onTableSortChange">                            
                    
                    <el-table-column prop="f_kcbz" label="状态" width="80">
                        <template #default="scope">
                            <div v-if="scope.row.f_kcbz==0">临时</div>
                            <div v-if="scope.row.f_kcbz==-1">历史</div>
                            <div v-else></div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="f_kcbh" label="批次" width="200" />
                    <el-table-column prop="f_rksj_s" label="变更时间" width="160" />
                    <el-table-column prop="f_rklb" label="变更类别" width="120" />
                    <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip />
                    <el-table-column prop="f_jyzt_s" label="调拨" width="120">
                        <template #default="scope">
                            <div v-if="scope.row.f_jyzt==0">-</div>
                            <div v-else>{{ scope.row.f_jyzt_s+'-'+scope.row.f_jyyg_id_s }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="f_kcdj_s" label="单价" width="120" align="right" />
                    <el-table-column prop="f_kcsl" label="数量" width="100" />
                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />                            
                    <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                    
                    <el-table-column prop="f_pksj_s" label="盘库时间" width="160" />
                    <el-table-column prop="f_hwck_s" label="仓库" width="100" />
                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
                    
            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_kcmx"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next, jumper"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>
        <!-- 库存明细编辑对话框 -->
        <kcmx ref="v_kcmx" @close="onDialogClose_kcmx"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_kcgl_kczl" }
</script>

<script lang="ts" setup>

    import { ref, onMounted } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";
    import kcmx_cf from "@/views/frame/ext/tkcgl/kcmx_cf.vue";

    import tcplb from "@/views/frame/ext/comm/tcplb.vue"
    import kcmx from "./kcmx.vue"
    import kcjy_xx from "./kcjy_xx.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_kcmx = ref<t_table>();

    type t_kcmx = InstanceType<typeof kcmx>;
    const v_kcmx = ref<t_kcmx>();
    
    // 产品类别列表
    const x_cplb_list = ref<any[]>([]);

    // 查询条件
    const x_query_cplb = ref([0, 0]);
    const x_query_cpmc = ref("");
    const x_query_cpbm = ref("");
    const x_query_kcbh = ref("");    
    const x_query_bglb = ref("");

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    // 排序数组
    const m_orderby = ref<any[]>([{
        name: "f_kcmx_id",
        order: " DESC"
    }]);

    // 排序映射
    const m_orderby_list = [
        {
            name: "f_kcmx_id",
            field: "`f_kcmx_id`"
        },
        {
            name: "f_cpbm",
            field: "`f_cpbm`"
        },
        {
            name: "f_cpmc",
            field: "`f_cpmc`"
        },
        {
            name: "f_cpsl",
            field: "`f_cpsl`"
        },
        {
            name: "f_cpdj_s",
            field: "`f_cpdj`"
        },
        {
            name: "f_rksj_s",
            field: "`f_rksj`"
        }
    ];

    onMounted(async () => {
                
        // 加载产品类别列表
        x_cplb_list.value = await TLogic.netload_Tree_cplb(true);
        
        // 初始化加载数据
        netLoad_kcmx_query(-1);        
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
                if (d["name"] == d1["name"]) df = d1["field"];
            }

            if (df == "") continue;

            s += "," + df + d["order"];
        }

        if (s.length > 0) {
            // ORDER BY 前面必须有空格
            s = " ORDER BY " + s.substring(1);
        }

        return s;
    }

    /**
     * 查询库存明细数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_kcmx_query = (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        let orderBy = getOrderByString();

        v_table_kcmx.value?.load_list_proc("p_kcmx_query", { 
            "v_kcbz": -9,
            "v_cpdl_id": x_query_cplb.value[0],
            "v_cpxl_id": x_query_cplb.value[1],
            "v_cpmc": x_query_cpmc.value,
            "v_cpbm": x_query_cpbm.value,
            "v_kcbh": x_query_kcbh.value,
            "v_jyzt": -1,
            "v_rklb": x_query_bglb.value,
            "v_cklb": "",
            "v_rksj1": "",
            "v_rksj2": "",
            "v_cksj1": "",
            "v_cksj2": "",
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

        // 先移除以前的
        let i = 0;
        for (let d of m_orderby.value) {
            if (d.name == dn) break;
            ++i;
        }
        if (i < m_orderby.value.length) {
            m_orderby.value.splice(i, 1);
        }

        if (evt.order != undefined) {
            let ds = "";
            if (evt.order == "descending") ds = " DESC";
            m_orderby.value.unshift({
                name: dn,
                order: ds
            })
        }

        console.log(m_orderby.value);
        netLoad_kcmx_query(-1);
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_kcmx = (data: any) => {
        // 调拨状态显示
        data["f_jyzt_s"] = eodic.get_dic_label("调拨状态", data["f_jyzt"]);
        
        // 日期格式化
        data["f_rksj_s"] = eolib.datetime_2_short(data["f_rksj"], true);
        data["f_cksj_s"] = eolib.datetime_2_short(data["f_cksj"], true);
        data["f_pksj_s"] = eolib.datetime_2_short(data["f_pksj"], true);

        // 价格格式化
        data["f_kcdj_s"] = eolib.fixed_num(data["f_kcdj"], 3);
        
        // 仓库显示
        data["f_hwck_s"] = eodic.get_dic_label("产品仓库", data["f_hwck"]);
        
        // 用户转换
        TLogic.updateDicUserData(data, ["f_jyyg_id"]);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_kcmx = (n: number): number => {
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
    const onTableRowClick_kcmx = (data: any) => {
        // 可以在这里添加行点击后的处理逻辑
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_kcmx = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_kcmx_query(pageIndex - 1);
    }
    
    /**
     * 查找按钮点击
     */
    const onButtonClick_Load_kcmx = () => {
        netLoad_kcmx_query(-1);
    }


    /**
     * 修改库存明细
     */
    const onButtonClick_Upd_kcmx = () => {
        let kcmxData = v_table_kcmx.value?.get_select_data(true);
        if (kcmxData == undefined) return;
        
        v_kcmx.value?.showDialog(kcmxData);
    }

    /**
     * 库存明细保存事件处理
     */
    const onDialogClose_kcmx = async (cancel: boolean, list: any, cb: cfunc_boolean) => {

        if (cancel) { 
            cb(true); return;
        }

        // 回写数据库
        for (const d of list) {
            v_table_kcmx.value?.update_data(d, -1, d["_is_add"], false);
        }

        eocore.show_success(list.length + " 项入库成功");

        cb(true);
    }

</script>

<style lang="scss" scoped>
    .div_jyzt1 {    
        color: #111;
    }
    .div_jyzt0 {
        color: #999;
    }
</style>