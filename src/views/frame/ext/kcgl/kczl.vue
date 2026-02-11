<template>
    <!-- 库存管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w280p">
                        <div class="label_n">产品编码</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpbm" placeholder="产品编码"></el-input>
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
                        <div class="label_n">占用状态</div>
                        <div class="input">
                            <vdic style="width:100%" dic="占用状态" :all="true" field="value"
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
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Del_kcmx">移除</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_kcjy">占用</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_kccf">拆库</vbuttonk>
                                <vbuttonk type="default" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_kchb">并库</vbuttonk>
                                <vbuttonk type="primary" class="input_w" permit="" 
                                    @click="onButtonClick_Upd_kcmx">修改</vbuttonk>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 库存明细表格 -->
                    <div class="eo_col_f">
                        <vtable ref="v_table_kcmx" 
                            name="库存明细"
                            id-field="f_kcmx_id"
                            check="single" 
                            @loading="onTableLoading"
                            :on-item="onTableItem_kcmx"
                            :on-page="onTablePage_kcmx"
                            @row-click="onTableRowClick_kcmx"
                            @sort-change="onTableSortChange">                            
                            
                            <el-table-column prop="f_jyzt_s" label="占用" width="120">
                                <template #default="scope">
                                    <div v-if="scope.row.f_jyzt==0">-</div>
                                    <div v-else>{{ scope.row.f_jyzt_s+'-'+scope.row.f_jyyg_id_s }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="f_kcbh" label="批次" width="200" />
                            <el-table-column prop="f_cpmc" label="产品名称" width="200" show-overflow-tooltip sortable />
                            <el-table-column prop="f_cpdj_s" label="单价" width="120" align="right" sortable />
                            <el-table-column prop="f_rksj_s" label="入库时间" width="160" sortable />
                            <el-table-column prop="f_cpsl" label="包装数量" width="100" />
                            <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                            <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                            <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                            
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
        <kcmx_xx ref="v_kcmx_xx" @close="onDialogClose_kcmx_xx"/>
        <!-- 借用单编辑对话框 -->
        <kcjy_xx ref="v_kcjy_xx" @close="onDialogClose_kcjy_xx"/>
        <!-- 拆库编辑对话框 -->
        <kccf_xx ref="v_kccf_xx" @close="onDialogClose_kccf_xx"></kccf_xx>
        <!-- 并库编辑对话框 -->
        <kcmx_rx ref="v_kcmx_rx" @close="onDialogClose_kcmx_rx"></kcmx_rx>
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
    import kccf_xx from "@/views/frame/ext/kcgl/kccf_xx.vue";
    import kcmx_rx from "@/views/frame/ext/kcgl/kcmx_rx.vue";

    import tcplb from "@/views/frame/ext/comm/tcplb.vue"
    import kcmx_xx from "./kcmx_xx.vue"
    import kcjy_xx from "./kcjy_xx.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_kcmx = ref<t_table>();

    type t_kcmx_xx = InstanceType<typeof kcmx_xx>;
    const v_kcmx_xx = ref<t_kcmx_xx>();

    type t_kcjy_xx = InstanceType<typeof kcjy_xx>;
    const v_kcjy_xx = ref<t_kcjy_xx>();        

    type t_kccf_xx = InstanceType<typeof kccf_xx>;
    const v_kccf_xx = ref<t_kccf_xx>();

    type t_kcmx_rx = InstanceType<typeof kcmx_rx>;
    const v_kcmx_rx = ref<t_kcmx_rx>();
    
    // 产品类别列表
    const x_cplb_list = ref<any[]>([]);
    // 用户字典
    let m_user_dic: any = {};

    // 查询条件
    const x_query_cplb = ref([0, 0]);
    const x_query_cpmc = ref("");
    const x_query_cpbm = ref("");
    const x_query_jyzt = ref(-1);

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

        // 所有账号信息
        m_user_dic = await TLogic.netLoad_UserDic();
                
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
            "v_cpdl_id": x_query_cplb.value[0],
            "v_cpxl_id": x_query_cplb.value[1],
            "v_cpmc": x_query_cpmc.value,
            "v_cpbm": x_query_cpbm.value,
            "v_jyzt": x_query_jyzt.value,
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
        // 占用状态显示
        data["f_jyzt_s"] = eodic.get_dic_label("占用状态", data["f_jyzt"]);
        
        // 日期格式化
        if (data["f_rksj"]) {
            data["f_rksj_s"] = eolib.datetime_2_short(data["f_rksj"], true);
        }

        // 价格格式化
        data["f_cpdj_s"] = eolib.fixed_num(data["f_cpdj"], 3);
        
        // 仓库显示
        data["f_hwck_s"] = eodic.get_dic_label("产品仓库", data["f_hwck"]);
        
        // 用户转换
        TLogic.updateDicUserData(data, m_user_dic, ["f_jyyg_id"]);
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

        const dts = eolib.datetime_2_string(new Date(), true);
        let kcmxData = {
            "f_kcmx_id": 0,
            "f_kcbh": "",
            "f_kcmxrk_id": 0, // 入库明细ID
            "f_kcmxck_id": 0, // 出库明细ID
            "f_cpdy_id": 0,        // 产品定义ID
            "f_cpmc": "",          // 产品名称
            "f_cpbm": "",          // 产品编码
            "f_jyzt": 0,           // 占用状态（0:正常）
            "f_jyyg_id": 0,         // 占用员工ID
            "f_hwck": 0,           // 仓库
            "f_cpsl": 1.0,         // 数量
            "f_cpsl_s": "1.0",         // 数量
            "f_cpdj": 0.0,         // 单价
            "f_cpdj_s": "0.00",        // 价格
            "f_rksj": dts,
            "f_rksj_s": dts,
            "f_pksj": "1970-01-01 00:00:00",
            "f_pksj_s": "",
            "f_yxbz": 1,           // 有效标志
            "f_kgy_id": TGlobal.userData["f_user_id"],
            "f_kgy_id_s": TGlobal.userData["f_name"],
            "f_beizhu": ""         // 备注
        };
        
        v_kcmx_xx.value?.showDialog(kcmxData);
    }

    /**
     * 出库，并不是删除
     */
    const onButtonClick_Del_kcmx = async () => {

        const sel = v_table_kcmx.value?.get_select_data(true);
        if (sel == undefined) return;

        // 二次确认
        let ret = await eocore.show_confirm("是否移除库存货物 " + sel["f_kcbh"] + "？一旦操作将造成不可预知的错误");
        if (!ret) return;
        
        // await v_table_kcmx.value?.remove_data_proc_select("p_kcmx_del", async (data: any) => {
        //     return {
        //         "v_kcmx_id": data["f_kcmx_id"]
        //     };
        // });

        const kgyId = TGlobal.userData["f_user_id"];
        const kcmxId = sel["f_kcmx_id"];
        const cklb = TLogic.codeTypes["盘库整理"];
        
        // 直接出库
        ret = await eocore.proc(
            "p_kcmxck_upd", {
                "v_kcmx_id": kcmxId,
                "v_cklb": cklb,
                "v_ckd_id": 0, // 直接盘库新增
                "v_kgy_id": kgyId,
                "v_cpsl": 1.0,
                "v_cpdj": sel["f_cpdj"],
                "v_cpzj": sel["f_cpdj"],
                "v_wlgs_id": 0,
                "v_wldh": "",
                "v_beizhu": sel["f_beizhu"]
        });

        const data = eocore.check_net_object(ret);
        if (data == undefined) return;

        v_table_kcmx.value?.remove_data(data, "");
    }

    /**
     * 修改库存明细
     */
    const onButtonClick_Upd_kcmx = () => {
        let kcmxData = v_table_kcmx.value?.get_select_data(true);
        if (kcmxData == undefined) return;
        
        v_kcmx_xx.value?.showDialog(kcmxData);
    }

    /**
     * 库存明细保存事件处理
     */
    const onDialogClose_kcmx_xx = async (cancel: boolean, list: any, cb: cfunc_boolean) => {

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
     * 库存借用或归还（多个）
     */
    const onButtonClick_Upd_kcjy = () => {
        let kcmxList = v_table_kcmx.value?.get_check_list();
        if (kcmxList == undefined) return;
        
        v_kcjy_xx.value?.showDialog(kcmxList, undefined);
    }

    /**
     * 货物占用
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
        let kcmxData = v_table_kcmx.value?.get_select_data(true);
        if (kcmxData == undefined) return;

        const cpsl = eocore.to_int(kcmxData["f_cpsl"]);
        if (cpsl <= 1) {
            eocore.show_info("包装数量不足，无法拆分");
            return;
        }

        kcmxData["f_cpsl1"] = cpsl - 1;
        kcmxData["f_cpsl2"] = 1;
        
        v_kccf_xx.value?.showDialog(kcmxData);
    }

    const onDialogClose_kccf_xx = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) { 
            cb(true); return;
        }

        const cpsl = eocore.to_int(data0["f_cpsl"]);
        const cpsl2 = eocore.to_int(data0["f_cpsl2"]);
        if (cpsl2 <= 0) {
            eocore.show_info("请输入分出数量");
            cb(false); return;
        }

        if (cpsl2 >= cpsl || cpsl2 < 1) {
            eocore.show_info("请输入正确的分出数量");
            cb(false); return;
        }

        const cpsl1 = cpsl - cpsl2;
        const cpdj = data0["f_cpdj"];

        // 修改原有数量
        const ret = await eocore.proc(
            "p_kcmx_upd", {
                "v_kcbh": data0["f_kcbh"],
                "v_kcmxrk_id": data0["f_kcmxrk_id"],
                "v_cpdy_id": data0["f_cpdy_id"],
                "v_jyzt": data0["f_jyzt"],
                "v_hwck": data0["f_hwck"],
                "v_cpdj": cpdj,
                "v_cpsl": cpsl1,
                "v_yxbz": data0["f_yxbz"],
                "v_kgy_id": data0["f_kgy_id"],
                "v_beizhu": data0["f_beizhu"]
        });
        let dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) return;

        // 更新数据表原有记录
        v_table_kcmx.value?.update_data(dataNew, -1, false, false);

        const kgyId = TGlobal.userData["f_user_id"];
        const rklb = TLogic.codeTypes["库存拆分"];

        let data2 = Object.assign({}, data0);
        data2["f_cpsl"] = cpsl2;
        data2["f_cpzj"] = cpdj * cpsl2;

        dataNew = await TLogic.netLoad_kcmxrk_upd(kgyId, rklb, data2);
        if (dataNew == undefined) return;
        
        // 显示拆分后的数据
        v_kcmx_rx.value?.showDialog(dataNew);

        // 添加到数据表
        v_table_kcmx.value?.update_data(dataNew, -1, true, true);

        cb(true);
    }

    /**
     * 库存合并
     */
    const onButtonClick_Upd_kchb = async () => {
        let kcmxList = v_table_kcmx.value?.get_check_list();
        if (kcmxList == undefined) return;
        if (eocore.check_empty(kcmxList)) return;

        let data = kcmxList[0];

        let cpzj = 0.0;
        let cpsl = 0;

        // 合并库存，需要产品定义一致
        let cpdyId = data["f_cpdy_id"];
        for (let d of kcmxList) {

            cpzj += d["f_cpdj"] * d["f_cpsl"];
            cpsl += d["f_cpsl"];

            if (cpdyId != d["f_cpdy_id"]) {
                eocore.show_info("请选择产品定义一致的库存进行合并");
                return;
            }
        }

        if (cpsl <= 0) {
            eocore.show_info("产品数量必须大于零");
            return;
        }

        //console.log(kcmxList, cpzj, cpsl);

        // 二次确认
        let ret = await eocore.show_confirm("确信要将 " + cpsl + " 个 " + data["f_cpmc"] + " 合并吗？");
        if (!ret) return;

        let dataNew;
        let cklb = TLogic.codeTypes["库存合并"];
        let kgyId = TGlobal.userData["f_user_id"];        
        
        for (let d of kcmxList) {
            ret = await eocore.proc(
                "p_kcmxck_upd", {
                    "v_kcmxck_id": 0,
                    "v_kcmx_id": d["f_kcmx_id"],
                    "v_cklb": cklb,
                    "v_ckd_id": 0,
                    "v_kgy_id": kgyId,
                    "v_cksl": 1.0,
                    "v_ckdj": 0.0,
                    "v_ckzj": 0.0,
                    "v_wlgs_id": 0,
                    "v_wldh": "",
                    "v_beizhu": d["f_beizhu"]
            });
            dataNew = eocore.check_net_object(ret);
            if (dataNew == undefined) return;
        }

        let data2 = Object.assign({}, data);
        data2["f_cpzj"] = cpzj;
        data2["f_cpsl"] = cpsl;
        data2["f_cpdj"] = cpzj / cpsl;

        // 创建一个新的
        dataNew = await TLogic.netLoad_kcmxrk_upd(kgyId, cklb, data2);
        if (dataNew == undefined) return;
        
        v_kcmx_rx.value?.showDialog(dataNew);

        // 重新加载数据
        netLoad_kcmx_query(-1);
    }

    const onDialogClose_kcmx_rx = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) { 
            cb(true); return;
        }

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