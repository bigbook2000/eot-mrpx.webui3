<template>
    <!-- 客户公海 -->
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


            <div class="eo_col_f">
                <div class="eo_row">
                    <!-- 客户列表 -->
                    <div class="eo_row_f">

                        <div class="eo_col">
                            
                            <!-- 操作工具栏 -->
                            <div class="eo_tool_bar">
                                <div class="eo_form">
                                    <div class="cell">
                                        <vbuttonk type="default" class="input_w" permit="" 
                                            @click="onButtonClick_Upd_ghbz">我要联系</vbuttonk>
                                        <vbuttonk type="primary" class="input_w" permit="" 
                                            @click="onButtonClick_Upd_kh">客户信息</vbuttonk>
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
export default { name: "ext_xsgl_khgh" }
</script>

<script lang="ts" setup>

    import { ref, onMounted } from "vue"

    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    import vdic from "@/logic/common/vdic.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vbuttonk from "@/logic/common/vbuttonk.vue"

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

    // 使用公共逻辑（isGh=true 表示客户公海）
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
        onTableRowClick_khgl,
        onPageChange_khgl,
        onButtonClick_Clear_khgl,
        onButtonClick_Load_khgl

    } = useKhglCommon(v_table_khgl, v_khgl_ex, v_kehu_xx, TLogic.ghbzCodes["公海"])

    onMounted(async () => {
        // 初始化加载数据
        netLoad_khgl_query(-1)
    })

    /**
     * 修改客户
     */
    const onButtonClick_Upd_kh = () => {
        let khData = v_table_khgl.value?.get_select_data(true)
        if (!khData) return
        
        v_kehu_xx.value?.showDialog(khData)
    }

    /**
     * 提交公海
     */
    const onButtonClick_Upd_ghbz = async () => {

        let khList = v_table_khgl.value?.get_check_list() || []
        if (eocore.check_empty(khList)) return

        let dret = await eocore.show_confirm("确定要将 " + khList.length + " 客户转到我的私有客户吗？")
        if (!dret) return

        netLoad_khgl_ghbz(khList, TLogic.ghbzCodes["私有"]);
    }

    const onDialogClose_kehu_xx = (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }

        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>