<template>
    <!-- 销售订单编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="销售订单"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">销售单号</div>
                <div class="input">
                    <el-input v-model="x_data_xsd['f_xsdh']" style="width:100%"
                        maxlength="50" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">销售计划</div>
                <div class="input">
                    <el-input v-model="x_data_xsd['f_xsjhdh']" style="width:100%" disabled></el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">客户</div>
                <div class="input">
                    <el-input v-model="x_data_xsd['f_khgl_id_s']" style="width:100%"
                        placeholder="请输入客户" :readonly="true">
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_kehu" />
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">客户地址</div>
                <div class="input">
                    <el-input v-model="x_data_xsd['f_lxdz']" style="width:100%"
                        maxlength="50" placeholder="请输入客户地址"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">联系人</div>
                <div class="input">
                    <el-input v-model="x_data_xsd['f_lxr']" style="width:100%"
                        maxlength="50" placeholder="请输入联系人"></el-input>
                </div>
            </div>            
            <div class="cell eo_w4">
                <div class="label_n">联系电话</div>
                <div class="input">
                    <el-input v-model="x_data_xsd['f_lxdh']" style="width:100%"
                        maxlength="20" placeholder="请输入联系电话"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">付款类别</div>
                <div class="input">
                    <vdic v-model="x_data_xsd['f_fklb']" dic="付款类别" :all="false" field="value" style="width:100%" />
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">销售员</div>
                <div class="input">
                    <el-input v-model="x_data_xsd['f_xsy_id_s']" style="width:100%"
                        maxlength="50" :disabled="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">有效标志</div>
                <div class="input">
                    <el-switch v-model="x_data_xsd['f_yxbz']" 
                        :active-value="1" 
                        :inactive-value="0" />
                </div>
            </div>


            <div class="cell eo_w2">
                <div class="label_n">总金额</div>
                <div class="input">
                    <el-input v-model="x_data_xsd['f_xsje']" style="width:100%"
                        maxlength="50" :disabled="true"></el-input>
                </div>
            </div>            
            <div class="cell eo_w2">
                <div class="label_n">实收金额</div>
                <div class="input">
                    <el-input v-model="x_data_xsd['f_ssje']" style="width:100%"
                        maxlength="50" :disabled="true"></el-input>
                </div>
            </div>            
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_xsd['f_beizhu']" style="width:100%"
                        maxlength="100" placeholder="请输入备注"></el-input>
                </div>
            </div>
        </div>
        <kehu_list ref="v_kehu_list" @close="onListSelect_kehu"></kehu_list>
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
    import kehu_list from "@/views/frame/ext/txsgl/kehu_list.vue"

    const v_kehu_list = ref<InstanceType<typeof kehu_list>>();

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    let x_data_xsd: any = reactive({});

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
        x_data_xsd = reactive(Object.assign({}, data));
        console.log(x_data_xsd);
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

        emits("close", cancel, x_data_xsd, (result: boolean) => {
            cb(result);
        });
    }

    const onInputOpen_kehu = () => {

        if (!m_edit_enable) return;
        v_kehu_list?.value?.show_dialog({});
    }

    const onListSelect_kehu = (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }

        x_data_xsd["f_khgl_id"] = data["f_khgl_id"];
        x_data_xsd["f_khgl_id_s"] = data["f_khmc"];
        x_data_xsd["f_lxr"] = data["f_fzr"];
        x_data_xsd["f_lxdh"] = data["f_gsdh"];

        cb(true);
    }


    // 暴露方法给父组件
    defineExpose({
        showDialog,
    });
</script>

<style lang="scss" scoped>
</style>