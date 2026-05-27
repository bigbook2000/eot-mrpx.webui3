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
                                :disabled="!x_query_xsy"
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


            <div class="eo_col_f">
                <div class="eo_row">
                    <!-- 客户列表 -->
                    <div class="eo_row_f">

                        <div class="eo_col">
                            
                            <!-- 操作工具栏 -->
                            <div class="eo_tool_bar">
                                <div class="eo_form">
                                    <div class="cell">
                                        <vbuttonk type="primary" class="input_w" permit="" 
                                            @click="onButtonClick_Add_kh">新建客户</vbuttonk>
                                        <vbuttonk type="default" class="input_w" permit="" 
                                            @click="onButtonClick_Upd_ghbz">提交公海</vbuttonk>
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
                                    check="single" 
                                    @loading="onTableLoading"
                                    :on-item="onTableItem_khgl"
                                    :on-page="onTablePage_khgl"
                                    @row-click="onTableRowClick_khgl">
                                    <el-table-column prop="f_jyzt_s" label="状态" width="80" />
                                    <el-table-column prop="f_xsy_id_s" label="销售员" width="100" />
                                    <el-table-column prop="f_qzyx_s" label="意向" width="80" />
                                    <el-table-column prop="f_hzdj_s" label="等级" width="80" />
                                    <el-table-column prop="f_khmc" label="名称" width="280" show-overflow-tooltip />                    
                                    <el-table-column prop="f_lxr" label="联系人" width="100" />
                                    <el-table-column prop="f_lxfh" label="联系方式" width="120" />
                                    <el-table-column prop="f_khlb_s" label="类别" width="80" />
                                    <el-table-column prop="f_khly_s" label="来源" width="120" />
                                    <el-table-column prop="f_gsgm_s" label="规模" width="80" />
                                    <el-table-column prop="f_jyfs_s" label="经营方式" width="120" />
                                    <el-table-column prop="f_xzds" label="地市" width="80" show-overflow-tooltip />
                                    <el-table-column prop="f_xzqx" label="区县" width="80" show-overflow-tooltip />                    
                                    <el-table-column prop="f_gsdz" label="公司地址" width="200" show-overflow-tooltip />
                                    <el-table-column prop="f_jdsj_s" label="创建时间" width="140" />
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
                    </div>
                    <div class="eo_row_d" style="width:500px">
                        <khgl_ex ref="v_khgl_ex" />
                    </div>
                </div>
            </div>
        </div>
        <!-- 客户编辑对话框 -->
        <kehu_xx ref="v_kehu_xx" @close="onDialogClose_kehu_xx"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_xsgl_khgl" }
</script>

<script lang="ts" setup>

    import { ref, onMounted } from "vue"

    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"
    import region from "@/inc/region"
    import eodic from "@/inc/eodic"

    import vdic from "@/components/web/vdic.vue"
    import vtable from "@/components/web/vtable.vue"
    import vbuttonk from "@/components/web/vbuttonk.vue"

    import user_input from "@/views/platform/user_input.vue"

    import kehu_xx from "./kehu_xx.vue"
    import khgl_ex from "./khgl_ex.vue"

    import TLogic from "@/logic/TLogic"
    import TGlobal from "@/logic/TGlobal"

    import { useKhglCommon } from "./khgl_"

    type t_table = InstanceType<typeof vtable>;
    const v_table_khgl = ref<t_table>();

    type t_kehu_xx = InstanceType<typeof kehu_xx>;
    const v_kehu_xx = ref<t_kehu_xx>();

    type t_khgl_ex = InstanceType<typeof khgl_ex>;
    const v_khgl_ex = ref<t_khgl_ex>();

    const x_query_xsy = ref(false);

    // 使用公共逻辑（isGh=false 表示客户管理）
    const {
        x_query_xsy_id,
        x_query_xsy_id_s,
        x_query_khmc,
        x_query_lxxx,
        x_query_khlb,
        x_query_khly,
        x_query_hzdj,
        x_query_qzyx,
        x_page_index,
        x_page_row_count,
        x_row_total,
        x_show_loading,

        netLoad_khgl_query,
        netLoad_khgl_ghbz,        

        onTableItem_khgl,
        onTablePage_khgl,
        onTableLoading,
        onPageChange_khgl,
        onButtonClick_Clear_khgl,
        onButtonClick_Load_khgl

    } = useKhglCommon(v_table_khgl, v_khgl_ex, v_kehu_xx, TLogic.ghbzCodes["私有"])

    onMounted(async () => {

        x_query_xsy_id.value = TGlobal.userData["f_user_id"];
        x_query_xsy_id_s.value = TGlobal.userData["f_name"];

        if (TLogic.checkPermit("platform.user.dept")) {
            x_query_xsy.value = true;
        }

        // 初始化加载数据
        netLoad_khgl_query(-1)
    })

    /**
     * 创建客户初始数据
     */
    const createKehuData = () => {
        return {            
            "f_khgl_id": 0, // 客户ID
            "f_xsy_id": TGlobal.userData["f_user_id"],
            "f_xsy_id_s": TGlobal.userData["f_name"],
            "f_khmc": "", // 客户名称
            "f_jyzt": 1, // 经营状态
            "f_qzyx": 1, // 潜在意向
            "f_khlb": 1, // 客户类别（1:企业客户，2:个人客户）
            "f_hzdj": 1, // 合作等级
            "f_khly": 1, // 客户来源
            "f_gsgm": 1, // 公司规模
            "f_jyfs": 1, // 经营方式 实体，网络，代理
            "f_sshy": 1, // 所属行业
            "f_fzr": "", // 负责人
            "f_gsdh": "", // 公司电话
            "f_lxr": "", // 联系人
            "f_lxfs": "", // 联系方式
            "f_xzqh_s": "__", // 行政区划
            "f_xzsf": "", // 行政省份
            "f_xzds": "", // 行政地市
            "f_xzqx": "", // 行政区县
            "f_gsdz": "", // 公司地址
            "f_gswz": "", // 公司网址
            "f_jyfw": "", // 经营范围
            "f_zycp": "", // 主营产品
            "f_jdsj": "1970-01-01 00:00:00", // 建档时间
            "f_gtsj": "1970-01-01 00:00:00", // 沟通时间
            "f_cjsj": "1970-01-01 00:00:00", // 成交时间            
            "f_cjje": 0.0, // 成交金额
            "f_ghbz": 1, // 公海标识
            "f_beizhu": "" // 备注   
        }
    }

    /**
     * 表格行点击事件
     * @param data 行数据
     */
    const onTableRowClick_khgl = (data: any) => {
        v_khgl_ex.value?.loadData(data, data["f_xsy_id"] == TGlobal.userData["f_user_id"]);
    }    

    /**
     * 添加客户
     */
    const onButtonClick_Add_kh = async () => {
        let kehuData = createKehuData()
        v_kehu_xx.value?.showDialog(kehuData)
    }

    /**
     * 修改客户
     */
    const onButtonClick_Upd_kh = () => {
        let khData = v_table_khgl.value?.get_select_data(true)
        if (!khData) return
        
        v_kehu_xx.value?.showDialog(khData)
    }


    /**
     * 删除客户
     */
    const onButtonClick_Del_kh = async () => {
    }

    /**
     * 提交公海
     */
    const onButtonClick_Upd_ghbz = async () => {
        const { default: eocore } = await import("@/inc/eocore")
        let khList = v_table_khgl.value?.get_check_list() || []
        if (eocore.check_empty(khList)) return

        const dret = await eocore.show_confirm("确定要将 " + khList.length + " 客户提交到公海吗？")
        if (!dret) return

        netLoad_khgl_ghbz(khList, TLogic.ghbzCodes["公海"]);
    }
    
    const onDialogClose_kehu_xx = async (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }

        if (!data["f_khmc"]) {
            eocore.show_info("请输入客户名称")
            cb(false); return;
        }

        if (!eocore.check_len(data["f_lxr"])) {
            eocore.show_info("请输入联系人")
            cb(false); return;
        }
        if (!eocore.check_len(data["f_lxfs"])) {
            eocore.show_info("请输入联系方式")
            cb(false); return;
        }

        let ret = region.get_region_info(data["f_xzqh_s"])
        data["f_xzsf"] = ret.province
        data["f_xzds"] = ret.city
        data["f_xzqx"] = ret.county

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
                "v_lxr": data["f_lxr"],
                "v_lxfs": data["f_lxfs"],
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
            }, -1, data["f_khgl_id"]<=0, true)

        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>