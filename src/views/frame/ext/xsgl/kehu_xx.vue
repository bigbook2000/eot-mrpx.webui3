<template>
    <!-- 客户编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="客户信息"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">客户名称<span style="color:red;">*</span></div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_khmc']" style="width:100%"
                        maxlength="100" placeholder="客户名称"></el-input>
                </div>
            </div>

            <div class="cell eo_w4">
                <div class="label_n">潜在意向</div>
                <div class="input">
                    <vdic v-model="x_data_kh['f_qzyx']" dic="客户意向" :all="false" field="value" style="width:100%" />
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">经营状态</div>
                <div class="input">
                    <vdic v-model="x_data_kh['f_jyzt']" dic="经营状态" :all="false" field="value" style="width:100%" />
                </div>
            </div>
            
            <div class="cell eo_w4">
                <div class="label_n">客户类别</div>
                <div class="input">
                    <vdic v-model="x_data_kh['f_khlb']" dic="客户类别" :all="false" field="value" style="width:100%" />
                </div>
            </div>
            
            <div class="cell eo_w4">
                <div class="label_n">合作等级</div>
                <div class="input">
                    <vdic v-model="x_data_kh['f_hzdj']" dic="合作等级" :all="false" field="value" style="width:100%" />
                </div>
            </div>
            
            <div class="cell eo_w4">
                <div class="label_n">客户来源</div>
                <div class="input">
                    <vdic v-model="x_data_kh['f_khly']" dic="客户来源" :all="false" field="value" style="width:100%" />
                </div>
            </div>
            
            <div class="cell eo_w4">
                <div class="label_n">公司规模</div>
                <div class="input">
                    <vdic v-model="x_data_kh['f_gsgm']" dic="经营规模" :all="false" field="value" style="width:100%" />
                </div>
            </div>
            
            <div class="cell eo_w4">
                <div class="label_n">客户性质</div>
                <div class="input">
                    <vdic v-model="x_data_kh['f_jyfs']" dic="经营方式" :all="false" field="value" style="width:100%" />
                </div>
            </div>
            

            
            <div class="cell eo_w4">
                <div class="label_n">负责人</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_fzr']" style="width:100%"
                        maxlength="50" placeholder="负责人"></el-input>
                </div>
            </div>
            
            <div class="cell eo_w2">
                <div class="label_n">公司电话</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_gsdh']" style="width:100%"
                        maxlength="20" placeholder="公司电话"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">所属行业</div>
                <div class="input">
                    <vdic v-model="x_data_kh['f_sshy']" dic="行业类别" :all="false" field="value" style="width:100%" />
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">行政区划</div>
                <div class="input">
                    <vregion v-model="x_data_kh['f_xzqh_s']" style="width:100%" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">公司网址</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_gswz']" style="width:100%"
                        maxlength="100" placeholder="公司网址"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">公司地址</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_gsdz']" style="width:100%"
                        maxlength="200" placeholder="公司地址"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">主营产品</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_zycp']" style="width:100%"
                        maxlength="100" placeholder="请输入主营产品"></el-input>
                </div>
            </div>

            <div class="cell eo_w100">
                <div class="label_n">经营范围</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_jyfw']" style="width:100%"
                        maxlength="200" placeholder="请输入经营范围"></el-input>
                </div>
            </div>            
            
            
            <div class="cell eo_w4">
                <div class="label_n">创建时间</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_jdsj_s']" style="width:100%"
                        :disabled="true"></el-input>
                </div>
            </div>            
            <div class="cell eo_w4">
                <div class="label_n">最近跟进</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_gtsj_s']" style="width:100%"
                        :disabled="true"></el-input>
                </div>
            </div>            
            <div class="cell eo_w4">
                <div class="label_n">最新成交</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_cjsj_s']" style="width:100%"
                        :disabled="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">成交金额</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_cjje_s']" style="width:100%"
                        :disabled="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">销售员</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_xsy_id_s']" style="width:100%"
                        :disabled="true"></el-input>
                </div>
            </div>
            
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_kh['f_beizhu']" style="width:100%"
                        maxlength="200" placeholder=""></el-input>
                </div>
            </div>
        </div>
    </vdialog>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_xsgl_khdlg" }
</script>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import vdialog from "@/logic/common/vdialog.vue"
    import vdic from "@/logic/common/vdic.vue"
    import vregion from "@/logic/common/vregion.vue"

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    // 定义组件事件
    const emit = defineEmits<{
        save: [data: any, isAdd: boolean]
    }>();

    // 表单数据
    const x_data_kh: any = reactive({});

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = (data: any) => {
        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        // 创建一个副本并更新响应式数据
        Object.assign(x_data_kh, data);
    }

    /**
     * 隐藏对话框
     */
    const hideDialog = () => {
        // vdialog 通过事件关闭，不需要直接调用
    }

    /**
     * 验证表单数据
     */
    const validateForm = (): boolean => {
        if (!x_data_kh['f_khmc']) {
            eocore.show_info("请填写客户名称");
            return false;
        }
        
        // 验证成交金额格式
        if (x_data_kh['f_cjje'] && isNaN(parseFloat(x_data_kh['f_cjje']))) {
            eocore.show_info("成交金额必须是数字");
            return false;
        }

        return true;
    }

    /**
     * 对话框关闭事件
     */
    const onDialogClose = (cancel: boolean, tag: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true);
            return;
        }
        
        // 验证数据
        if (!validateForm()) {
            cb(false);
            return;
        }

        try {
            let isAdd = x_data_kh['f_kh_id'] == 0;
            
            // 触发保存事件，让父组件处理保存逻辑
            emit('save', { ...x_data_kh }, isAdd);
            
            cb(true);
            
        } catch (error) {
            eocore.show_error("保存失败：" + error);
            cb(false);
        }
    }

    // 暴露方法给父组件使用
    defineExpose({
        showDialog,
        hideDialog
    });
</script>

<style lang="scss" scoped>
</style>