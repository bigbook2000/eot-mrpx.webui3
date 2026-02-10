<template>
    <!-- 客户管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <!-- 查询工具栏 -->
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_n">销售员</div>
                        <div class="input">
                            <user_input v-model="x_query_xsy_id" 
                                :userName="x_query_xsy_id_s" 
                                style="width:100%"></user_input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">潜在意向</div>
                        <div class="input">
                            <vdic v-model="x_query_qzyx" dic="客户意向" :all="true" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">客户类别</div>
                        <div class="input">
                            <vdic v-model="x_query_khlb" dic="客户类别" :all="true" field="value" style="width:100%" />
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_n">合作等级</div>
                        <div class="input">
                            <vdic v-model="x_query_hzdj" dic="合作等级" :all="true" field="value" style="width:100%" />
                        </div>
                    </div>
                </div>
                <div class="eo_form">
                    <div class="cell eo_w240p">
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
                        <div class="label_n">客户来源</div>
                        <div class="input">
                            <vdic v-model="x_query_khly" dic="客户来源" :all="true" field="value" style="width:100%" />
                        </div>
                    </div>                    
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="default" class="eo_w80p" @click="onButtonClick_Clear_khgl">重置</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_khgl">查找</el-button>
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
                            @click="onButtonClick_Add_kh">新建客户</vbuttonk>
                        <vbuttonk type="default" class="input_w" permit="" 
                            @click="onButtonClick_Del_kh">删除客户</vbuttonk>
                        <vbuttonk type="primary" class="input_w" permit="" 
                            @click="onButtonClick_Upd_kh">修改客户</vbuttonk>
                    </div>
                </div>
            </div>
            
            <!-- 客户表格 -->
            <div class="eo_col_f">
                <vtable ref="v_table_khgl" 
                    name="客户管理"
                    id-field="f_khgl_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_khgl"
                    :on-page="onTablePage_khgl"
                    @row-click="onTableRowClick_khgl">
                    <el-table-column prop="f_jyzt_s" label="状态" width="80" />
                    <el-table-column prop="f_xsy_id_s" label="销售员" width="100" />
                    <el-table-column prop="f_qzyx_s" label="意向" width="80" />
                    <el-table-column prop="f_hzdj_s" label="等级" width="80" />
                    <el-table-column prop="f_khmc" label="名称" width="280" show-overflow-tooltip />                    
                    <el-table-column prop="f_fzr" label="负责人" width="100" />
                    <el-table-column prop="f_gsdh" label="公司电话" width="120" />
                    <el-table-column prop="f_khlb_s" label="类别" width="80" />
                    <el-table-column prop="f_khly_s" label="来源" width="120" />
                    <el-table-column prop="f_gsgm_s" label="规模" width="80" />
                    <el-table-column prop="f_jyfs_s" label="经营方式" width="120" />
                    <el-table-column prop="f_xzds" label="地市" width="80" show-overflow-tooltip />
                    <el-table-column prop="f_xzqx" label="区县" width="80" show-overflow-tooltip />                    
                    <el-table-column prop="f_jdsj_s" label="建档时间" width="140" />
                    <el-table-column prop="f_gtsj_s" label="沟通时间" width="140" />
                    <el-table-column prop="f_cjsj_s" label="成交时间" width="140" />
                    <el-table-column prop="f_cjje_s" label="成交金额" width="120" />
                    <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column prop="f_xzsf" label="省份" width="80" />
                    <el-table-column prop="f_gsdz" label="地址" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_sshy_s" label="行业" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
            
            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_khgl"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next, jumper"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>
        <!-- 客户编辑对话框 -->
        <kehu_xx ref="v_kehu_xx" @save="onDialogClose_kehu_xx"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_xsgl_khgl" }
</script>

<script lang="ts" setup>
    import { ref, nextTick, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";
    import region from "@/inc/region";
    import eodic from "@/inc/eodic";

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"    

    import kehu_xx from "./kehu_xx.vue"
    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import user_input from "@/views/platform/user_input.vue"

    type t_table = InstanceType<typeof vtable>;
    const v_table_khgl = ref<t_table>();

    type t_kehu_xx = InstanceType<typeof kehu_xx>;
    const v_kehu_xx = ref<t_kehu_xx>();

    // 查询条件
    const x_query_xsy_id = ref(-1);
    const x_query_xsy_id_s = ref("");
    const x_query_khmc = ref("");
    const x_query_lxxx = ref("");
    const x_query_khlb = ref(-1);
    const x_query_khly = ref(-1);
    const x_query_hzdj = ref(-1);
    const x_query_qzyx = ref(-1);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(20);
    const x_row_total = ref(0);

    // 加载状态
    const x_show_loading = ref(false);

    let m_user_dic: any = {};

    onMounted(async () => {

        // 所有账号信息
        m_user_dic = await TLogic.netLoad_UserDic();
        // 初始化加载数据
        netLoad_khgl_query(-1);
    });

    /**
     * 查询客户数据
     * @param pageIndex 页码索引，-1表示重置到第1页
     */
    const netLoad_khgl_query = (pageIndex: number = -1) => {
        let pageRowCount = x_page_row_count.value;
        let rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_table_khgl.value?.load_list_proc("p_khgl_query", {             
            "v_xsy_id": x_query_xsy_id.value,
            "v_khmc": x_query_khmc.value,
            "v_lxxx": x_query_lxxx.value,
            "v_khlb": x_query_khlb.value,
            "v_khly": x_query_khly.value,
            "v_hzdj": x_query_hzdj.value,
            "v_qzyx": x_query_qzyx.value,
            "v_ghbz": 1,
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }

    /**
     * 表格数据格式化
     * @param data 表格行数据
     */
    const onTableItem_khgl = (data: any) => {

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

        // 用户转换
        TLogic.updateDicUserData(data, m_user_dic, ["f_xsy_id"]);
    }

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_khgl = (n: number): number => {
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
    const onTableRowClick_khgl = (data: any) => {
        // 点击行后的操作，如选中高亮等
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_khgl = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_khgl_query(pageIndex - 1);
    }

    // ========== 工具栏操作 ==========
    
    /**
     * 查找按钮点击
     */
    const onButtonClick_Clear_khgl = () => {
        x_query_xsy_id.value = -1;
        x_query_khmc.value = "";
        x_query_lxxx.value = "";
            
        x_query_khlb.value = -1;
        x_query_khly.value = -1;
        x_query_hzdj.value = -1;
        x_query_qzyx.value = -1;
    }
    const onButtonClick_Load_khgl = () => {
        netLoad_khgl_query(-1);
    }

    /**
     * 添加客户
     */
    const onButtonClick_Add_kh = async () => {
        
        let kehuData = {            
            f_khgl_id: 0, // 客户ID
            f_xsy_id: TGlobal.userData["f_user_id"],
            f_xsy_id_s: TGlobal.userData["f_name"],
            f_khmc: "", // 客户名称
            f_jyzt: 1, // 经营状态
            f_qzyx: 1, // 潜在意向
            f_khlb: 1, // 客户类别（1:企业客户，2:个人客户）
            f_hzdj: 1, // 合作等级
            f_khly: 1, // 客户来源
            f_gsgm: 1, // 公司规模
            f_jyfs: 1, // 经营方式 实体，网络，代理
            f_sshy: 1, // 所属行业
            f_fzr: "", // 负责人
            f_gsdh: "", // 公司电话
            f_xzqh_s: "__", // 行政区划
            f_xzsf: "", // 行政省份
            f_xzds: "", // 行政地市
            f_xzqx: "", // 行政区县
            f_gsdz: "", // 公司地址
            f_gswz: "", // 公司网址
            f_jyfw: "", // 经营范围
            f_zycp: "", // 主营产品
            f_jdsj: "1970-01-01 00:00:00", // 建档时间
            f_gtsj: "1970-01-01 00:00:00", // 沟通时间
            f_cjsj: "1970-01-01 00:00:00", // 成交时间            
            f_cjje: 0.0, // 成交金额
            f_ghbz: 1, // 公海标识
            f_beizhu: "" // 备注   
        };
        
        v_kehu_xx.value?.showDialog(kehuData);
    }

    /**
     * 删除客户
     */
    const onButtonClick_Del_kh = async () => {
        await v_table_khgl.value?.remove_data_proc_select("p_khgl_del", async (data: any) => {
            return {
                "v_khgl_id": data["f_khgl_id"]
            };
        });
    }

    /**
     * 修改客户
     */
    const onButtonClick_Upd_kh = () => {
        let khData = v_table_khgl.value?.get_select_data(true);
        if (!khData) return;
        
        v_kehu_xx.value?.showDialog(khData);
    }

    /**
     * 客户保存事件处理
     */
    const onDialogClose_kehu_xx = async (data: any, isAdd: boolean) => {

        if (!data["f_khmc"]) {
            eocore.show_info("请输入客户名称");
            return;

        }

        if (!data["f_gsdh"]) {
            eocore.show_info("请输入公司电话");
            return;
        }

        //console.log(data);
        let ret = region.get_region_info(data["f_xzqh_s"]);
        data["f_xzsf"] = ret.province;
        data["f_xzds"] = ret.city;
        data["f_xzqx"] = ret.county;

        await v_table_khgl.value?.update_data_proc(
            "p_khgl_upd", {
                "v_khgl_id": data["f_khgl_id"],
                "v_xsy_id": data["f_xsy_id"],
                "v_khmc": data["f_khmc"],
                "v_jyzt": data["f_jyzt"],
                "v_qzyx": data["f_qzyx"],
                "v_khlb": data["f_khlb"],
                "v_hzdj": data["f_hzdj"],
                "v_khly": data["f_khly"],
                "v_gsgm": data["f_gsgm"],
                "v_jyfs": data["f_jyfs"],
                "v_sshy": data["f_sshy"],
                "v_fzr": data["f_fzr"],
                "v_gsdh": data["f_gsdh"],
                "v_xzsf": data["f_xzsf"],
                "v_xzds": data["f_xzds"],
                "v_xzqx": data["f_xzqx"],
                "v_gsdz": data["f_gsdz"],
                "v_gswz": data["f_gswz"],
                "v_jyfw": data["f_jyfw"],
                "v_zycp": data["f_zycp"],
                "v_jdsj": data["f_jdsj"],
                "v_gtsj": data["f_gtsj"],
                "v_cjsj": data["f_cjsj"],
                "v_cjje": data["f_cjje"],
                "v_ghbz": data["f_ghbz"],
                "v_beizhu": data["f_beizhu"]
            }, -1, isAdd, true);
    }
</script>

<style lang="scss" scoped>
</style>