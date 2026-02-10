<template>
    <!-- 采购入库单编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="采购入库"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">采购单号</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_cgdh']" style="width:100%"
                        maxlength="50" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">采购计划</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_cgjhdh']" style="width:100%" disabled></el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">供应商</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_gys_id_s']" style="width:100%"
                        placeholder="请输入供应商" :readonly="true">
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_gys" />
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">联系人</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_lxr']" style="width:100%"
                        maxlength="50" placeholder="请输入联系人"></el-input>
                </div>
            </div>            
            <div class="cell eo_w4">
                <div class="label_n">联系电话</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_lxdh']" style="width:100%"
                        maxlength="20" placeholder="请输入联系电话"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">付款类别</div>
                <div class="input">
                    <vdic v-model="x_data_cgd['f_fklb']" dic="付款类别" :all="false" field="value" style="width:100%" />
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">采购员</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_cgy_id_s']" style="width:100%"
                        maxlength="50" :disabled="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">有效标志</div>
                <div class="input">
                    <el-switch v-model="x_data_cgd['f_yxbz']" 
                        :active-value="1" 
                        :inactive-value="0" />
                </div>
            </div>


            <div class="cell eo_w2">
                <div class="label_n">总金额</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_zje']" style="width:100%"
                        maxlength="50" :disabled="true"></el-input>
                </div>
            </div>            
            <div class="cell eo_w2">
                <div class="label_n">实付金额</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_sfje']" style="width:100%"
                        maxlength="50" :disabled="true"></el-input>
                </div>
            </div>
            
<!-- 
            <div class="cell eo_w4">
                <div class="label_n">收货人</div>
                <div class="input">
                    <user_input v-model="x_data_cgd['f_shr_id']" 
                        :userName="x_data_cgd['f_shr_id_s']" 
                        style="width:100%"></user_input>
                </div>
            </div>            
            <div class="cell eo_w4">
                <div class="label_n">&nbsp;</div>
            </div>            
            <div class="cell eo_w4">
                <div class="label_n">物流公司</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_wlgs_id_s']" style="width:100%"
                        placeholder="请输入物流公司" :readonly="true">
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_wlgs" />
                        </template>
                    </el-input>
                </div>
            </div>            
            <div class="cell eo_w2">
                <div class="label_n">物流单号</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_wldh']" style="width:100%"
                        maxlength="200" placeholder="请输入物流单号"></el-input>
                </div>
            </div>
-->
           

            
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_cgd['f_beizhu']" style="width:100%"
                        maxlength="100" placeholder="请输入备注"></el-input>
                </div>
            </div>
        </div>
        <gys_list ref="v_gys_list" @close="onListSelect_gys"></gys_list>
        <wlgs_list ref="v_wlgs_list" @close="onListSelect_wlgs"></wlgs_list>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import vdialog from "@/logic/common/vdialog.vue"
    import vdic from "@/logic/common/vdic.vue"

    import user_input from "@/views/platform/user_input.vue"
    import gys_list from "@/views/frame/ext/cggl/gys_list.vue"
    import wlgs_list from "@/views/frame/ext/cwgl/wlgs_list.vue"

    const v_gys_list = ref<InstanceType<typeof gys_list>>();
    const v_wlgs_list = ref<InstanceType<typeof wlgs_list>>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    let x_data_cgd: any = reactive({});

    let m_edit_enable = true;

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = (data: any, edit?: boolean) => {
        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        if (edit != undefined) {
            m_edit_enable = edit;
        } else {
            m_edit_enable = true;
        }

        // 创建一个副本并更新响应式数据
        x_data_cgd = reactive(Object.assign({}, data));
        console.log(x_data_cgd);
    }
    const onDialogOpen = (data: any) => {
    }
    /**
     * 对话框关闭事件
     */
    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {

        // 如果不允许编辑，则取消对话框
        if (!m_edit_enable) {
            cancel = true;
        };

        emits("close", cancel, x_data_cgd, (result: boolean) => {
            cb(result);
        });
    }

    const onInputOpen_gys = () => {

        if (!m_edit_enable) return;
        v_gys_list?.value?.show_dialog({});
    }
    const onListSelect_gys = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }

        x_data_cgd['f_gys_id_s'] = data['f_gysmc'];
        x_data_cgd['f_gys_id'] = data['f_gys_id'];
        x_data_cgd['f_lxr'] = data['f_lxr'];
        x_data_cgd['f_lxdh'] = data['f_lxdh'];

        cb(true);
    }
    const onInputOpen_wlgs = () => {
        v_wlgs_list?.value?.show_dialog({});
    }
    const onListSelect_wlgs = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true);
            return;
        }

        x_data_cgd['f_wlgs_id_s'] = data['f_gsmc'];
        x_data_cgd['f_wlgs_id'] = data['f_wlgs_id'];

        cb(true);
    }

    // 暴露方法给父组件使用
    defineExpose({
        showDialog,
    });
</script>

<style lang="scss" scoped>
</style>