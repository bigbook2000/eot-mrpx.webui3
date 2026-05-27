<template>
    <!-- 库存管理 -->
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
                    <div class="cell eo_w200p">
                        <div class="label_n">调拨状态</div>
                        <div class="input">
                            <vdic style="width:100%" dic="调拨状态" :all="true" field="value"
                                v-model="x_query_jyzt" />
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
                <div class="eo_col">
                    <!-- 操作工具栏 -->
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Add_kcmx">新增</vbuttonk>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_kcmx">修改</vbuttonk>
                                <vbuttonk type="danger" class="input_w" permit="" 
                                    @click="onButtonClick_Del_kcmx">移除</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_kcjy">调拨</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_kccf">拆库</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_kchb">并库</vbuttonk>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Get_kcmx">详情</vbuttonk>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 库存明细表格，使用f_kcbh作为主键 -->
                    <div class="eo_col_f">
                        <vtable ref="v_table_kcmx" 
                            name="库存明细"
                            id-field="f_kcbh"
                            check="single" 
                            @loading="onTableLoading"
                            :on-item="onTableItem_kcmx"
                            :on-page="onTablePage_kcmx"
                            @row-click="onTableRowClick_kcmx"
                            @sort-change="onTableSortChange">                            
                            
                            <el-table-column prop="f_jyzt_s" label="调拨" width="120">
                                <template #default="scope">
                                    <div v-if="scope.row.f_jyzt==0">-</div>
                                    <div v-else>{{ scope.row.f_jyzt_s+'-'+scope.row.f_jyyg_id_s }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="f_kcbh" label="批次" width="200" />
                            <el-table-column prop="f_rksj_s" label="入库时间" width="160" sortable />
                            <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip sortable />
                            <el-table-column prop="f_kcdj_s" label="单价" width="120" align="right" sortable />
                            <el-table-column prop="f_kcsl" label="数量" width="100" />
                            <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                            <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                            <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />                            
                            <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                            
                            <el-table-column prop="f_pksj_s" label="盘库时间" width="160" />
                            <el-table-column prop="f_cpbm" label="产品编码" width="160" sortable />
                            <el-table-column prop="f_dlmc" label="大类" width="120" show-overflow-tooltip />
                            <el-table-column prop="f_xlmc" label="小类" width="140" show-overflow-tooltip />
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
            </div>
        </div>
        <!-- 库存明细编辑对话框 -->
        <kcmx ref="v_kcmx" @close="onDialogClose_kcmx"/>
        <!-- 借用单编辑对话框 -->
        <kcjy_xx ref="v_kcjy_xx" @close="onDialogClose_kcjy_xx"/>
        <!-- 拆库编辑对话框 -->
        <kcmx_cf ref="v_kcmx_cf" @close="onDialogClose_kcmx_cf"/>
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

    import vbuttonk from "@/components/web/vbuttonk.vue"
    import vtable from "@/components/web/vtable.vue"
    import vdic from "@/components/web/vdic.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";
    import kcmx_cf from "@/views/web/ext/tkcgl/kcmx_cf.vue";

    import tcplb from "@/views/web/ext/comm/tcplb.vue"
    import kcmx from "./kcmx.vue"
    import kcjy_xx from "./kcjy_xx.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_kcmx = ref<t_table>();

    type t_kcjy_xx = InstanceType<typeof kcjy_xx>;
    const v_kcjy_xx = ref<t_kcjy_xx>();        

    type t_kcmx_cf = InstanceType<typeof kcmx_cf>;
    const v_kcmx_cf = ref<t_kcmx_cf>();

    type t_kcmx = InstanceType<typeof kcmx>;
    const v_kcmx = ref<t_kcmx>();
    
    // 产品类别列表
    const x_cplb_list = ref<any[]>([]);

    // 查询条件
    const x_query_cplb = ref([0, 0]);
    const x_query_cpmc = ref("");
    const x_query_cpbm = ref("");
    const x_query_kcbh = ref("");
    const x_query_jyzt = ref(-1);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(100);
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
            "v_kcbz": TLogic.kcbzCodes["正常"],
            "v_cpdl_id": x_query_cplb.value[0],
            "v_cpxl_id": x_query_cplb.value[1],
            "v_cpmc": x_query_cpmc.value,
            "v_cpbm": x_query_cpbm.value,
            "v_kcbh": x_query_kcbh.value,
            "v_jyzt": x_query_jyzt.value,
            "v_rklb": "",
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
     * 添加库存明细
     */
    const onButtonClick_Add_kcmx = async () => {
        
        let kcmxData: any = {
            "f_kcmx_id": 0,
            "f_cpdy_id": 0,        // 产品定义ID
            "f_kcbh": "",
            "f_rklb": "整理入库", // 入库类别
            "f_rkid": 0,
            "f_rksj": "1970-01-01 00:00:00",
            "f_rksj_s": "",
            "f_cklb": "", // 出库类别            
            "f_ckid": 0,
            "f_cksj": "1970-01-01 00:00:00",
            "f_cksj_s": "",
            "f_cpmc": "",          // 产品名称
            "f_cpbm": "",          // 产品编码
            "f_jyzt": 0,           // 调拨状态（0:正常）
            "f_jyyg_id": 0,         // 调拨员工ID
            "f_hwck": 0,           // 仓库
            "f_kcsl": 1.0,         // 数量
            "f_kcsl_s": "1.0",         // 数量
            "f_kcdj": 0.0,         // 单价
            "f_kcdj_s": "0.00",        // 价格            
            "f_pksj": "1970-01-01 00:00:00",
            "f_pksj_s": "",            
            "f_kgy_id": TGlobal.userData["f_user_id"],
            "f_kgy_id_s": TGlobal.userData["f_name"],
            "f_beizhu": "",         // 备注
            "f_kcbz": TLogic.kcbzCodes["正常"],           // 有效标志
        };

        // 扩展字段，批量添加
        kcmxData["rksl"] = 1;
        
        v_kcmx.value?.showDialog(kcmxData);
    }

    /**
     * 出库，并不是删除
     */
    const onButtonClick_Del_kcmx = async () => {

        const list = v_table_kcmx.value?.get_check_list() || [];
        if (eocore.check_empty(list)) {
            eocore.show_info("请勾选要出库的库存");
            return;
        }
        let kcmxData = list[0];
        
        // 二次确认
        let ret = await eocore.show_confirm(
            "是否移除库存货物 " + kcmxData["f_kcbh"] + "？一旦操作将造成不可预知的错误");
        if (!ret) return;
        
        // 直接出库
        x_show_loading.value = true;
        const dataNew = await TLogic.netLoad_kcmx_upd(
            kcmxData["f_kcmx_id"],
            0, // 关联
            kcmxData["f_cpdy_id"],
            kcmxData["f_kcbh"],
            "整理出库",
            0,
            kcmxData["f_hwck"],
            kcmxData["f_kcdj"],
            kcmxData["f_kcsl"],
            TGlobal.userData["f_user_id"],
            kcmxData["f_beizhu"],
            TLogic.kcbzCodes["历史"]
        );
        x_show_loading.value = false;        
        if (dataNew == undefined) return;

        v_table_kcmx.value?.remove_data(kcmxData, "");
    }

    /**
     * 修改库存明细
     */
    const onButtonClick_Upd_kcmx = () => {
        let kcmxData = v_table_kcmx.value?.get_select_data(true);
        if (kcmxData == undefined) return;
        
        v_kcmx.value?.showDialog(kcmxData);
    }

    const onButtonClick_Get_kcmx = () => {
        let kcmxData = v_table_kcmx.value?.get_select_data(true);
        if (kcmxData == undefined) return;
        
        v_kcmx.value?.showDialog(kcmxData, false);
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

    /**
     * 库存调拨（多个）
     */
    const onButtonClick_Upd_kcjy = () => {
        let kcmxList = v_table_kcmx.value?.get_check_list();
        if (kcmxList == undefined) return;

        if (eocore.check_empty(kcmxList)) {
            eocore.show_info("请勾选要调拨的库存");
            return;
        }
        
        v_kcjy_xx.value?.showDialog(kcmxList, undefined);
    }

    /**
     * 调拨记录
     */
    const onDialogClose_kcjy_xx = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) { 
            cb(true); return;
        }

        //console.log("onDialogClose_kcjy_xx", data0);
        netLoad_kcmx_query(x_page_index.value - 1);

        cb(true);
    }

    /**
     * 库存拆分
     */
    const onButtonClick_Upd_kccf = () => {

        let kcmxList = v_table_kcmx.value?.get_check_list();
        if (kcmxList == undefined) return;
        if (eocore.check_empty(kcmxList)) return;

        const kcmxData = kcmxList[0];

        const kcsl = eocore.to_int(kcmxData["f_kcsl"]);
        if (kcsl <= 1) {
            eocore.show_info("单件数量不足，无法拆分");
            return;
        }

        kcmxData["f_kcsl1"] = kcsl - 1;
        kcmxData["f_kcsl2"] = 1;
        
        v_kcmx_cf.value?.showDialog(kcmxData);
    }

    const onDialogClose_kcmx_cf = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) { 
            cb(true); return;
        }

        const kcsl = eocore.to_int(data0["f_kcsl"]);
        const kcsl2 = eocore.to_int(data0["f_kcsl2"]);
        if (kcsl2 <= 0) {
            eocore.show_info("请输入分出数量");
            cb(false); return;
        }

        if (kcsl2 >= kcsl || kcsl2 < 1) {
            eocore.show_info("请输入正确的分出数量");
            cb(false); return;
        }

        const kgyId = TGlobal.userData["f_user_id"];
        x_show_loading.value = true;
        const retData = await TLogic.netLoad_kcmx_cf(kgyId, data0, kcsl2);
        x_show_loading.value = false;
        if (retData == undefined) return;

        // 更新数据表原有记录
        v_table_kcmx.value?.update_data(retData.dataNew1, -1, false, false);
        
        // 显示拆分后的数据
        v_kcmx.value?.showDialog(retData.dataNew2);

        // 添加到数据表
        v_table_kcmx.value?.update_data(retData.dataNew2, -1, true, true);

        cb(true);
    }

    /**
     * 库存合并
     */
    const onButtonClick_Upd_kchb = async () => {
        let kcmxList = v_table_kcmx.value?.get_check_list();
        if (kcmxList == undefined) return;
        if (eocore.check_empty(kcmxList)) return;

        if (kcmxList.length <= 1) {
            eocore.show_info("请选择至少两个库存进行合并");
            return;
        }

        let data0 = kcmxList[0];

        // 二次确认
        let ret = await eocore.show_confirm("确信要将 " + kcmxList.length + " 件 " + data0["f_cpmc"] + " 合并吗？");
        if (!ret) return;

        let kgyId = TGlobal.userData["f_user_id"];
        const dataAdd = await TLogic.netLoad_kcmx_hb(kgyId, kcmxList);
        if (dataAdd == undefined) return;

        v_kcmx.value?.showDialog(dataAdd);

        // 重新加载数据
        netLoad_kcmx_query(-1);
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