<template>
    <!-- 销售退货编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="销售退货"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">货物批次</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_kcbh']" style="width:100%"
                        placeholder="请选择货物批次" readonly>
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_kcbh" 
                                v-show="x_edit_fields['f_kcbh']"/>
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">产品名称</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_cpmc']" style="width:100%"
                        maxlength="100" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">数量</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_kcsl']" style="width:100%"
                        disabled></el-input>
                </div>
            </div>

            <div class="cell eo_w2">
                <div class="label_n">销售单号</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_xsdh']" style="width:100%"
                        maxlength="50" disabled>                        
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">产品名称</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_cpmc']" style="width:100%"
                        maxlength="100" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">客户名称</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_khmc']" style="width:100%"
                        placeholder="请输入客户" disabled>
                    </el-input>
                </div>
            </div>
            
            
            <div class="cell eo_w2">
                <div class="label_n">销售金额</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_xsje_s']" style="width:100%"
                        maxlength="50" :disabled="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">物流公司</div>
                <div class="input">
                    <twlgs v-model="x_data_xsth['f_wlgs_id']" 
                        :label="x_data_xsth['f_wlgs_id_s']" 
                        :disabled="!x_edit_fields['f_wlgs_id']"
                        @change="(value) => { x_data_xsth['f_wlgs_id_s'] = value['f_wlgs_id_s']; }"/>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">退货金额</div>
                <div class="input">
                    <el-input-number v-model="x_data_xsth['f_thje']" 
                        :precision="2" :step="0.01" :min="0"
                        style="width:100%" :disabled="!x_edit_fields['f_thje']"/>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">物流单号</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_wldh']" style="width:100%"
                        maxlength="50" placeholder="请输入物流单号" 
                        :disabled="!x_edit_fields['f_wldh']">
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">发货人</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_fhr']" style="width:100%"
                        maxlength="50" placeholder="请输入发货人"
                        :disabled="!x_edit_fields['f_fhr']"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">发货电话</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_fhdh']" style="width:100%"
                        maxlength="20" placeholder="请输入发货电话"
                        :disabled="!x_edit_fields['f_fhdh']"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">销售员</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_xsy_id_s']" style="width:100%"
                        disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">发货地址</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_fhdz']" style="width:100%"
                        maxlength="200" placeholder="请输入发货地址"
                        :disabled="!x_edit_fields['f_fhdz']"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">退货原因</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_thyy']" style="width:100%"
                        type="textarea" :rows="3"
                        maxlength="500" placeholder="请输入退货原因"
                        :disabled="!x_edit_fields['f_thyy']"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_xsth['f_beizhu']" style="width:100%"
                        maxlength="50" placeholder="请输入备注"></el-input>
                </div>
            </div>
        </div>
        <xsdck_list ref="v_xsdck_list" @close="onDialogClose_kcbh"/>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import vdialog from "@/logic/common/vdialog.vue"
    import vdic from "@/logic/common/vdic.vue"

    import TLogic from "@/logic/TLogic";

    import user_input from "@/views/platform/user_input.vue"
    import xsdck_list from "@/views/frame/ext/txsgl/xsdck_list.vue"

    import twlgs from "@/views/frame/ext/comm/twlgs.vue"
    import eolib from "@/inc/eolib";

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    const v_xsdck_list = ref<InstanceType<typeof xsdck_list>>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    let x_data_xsth: any = reactive({});

    const x_edit_fields = ref<any>({
        "f_kcbh": false,
        "f_wlgs_id": false,
        "f_wldh": false,
        "f_thje": false,
        "f_fhr": false,
        "f_fhdh": false,
        "f_fhdz": false,
        "f_thyy": false,
        "f_beizhu": false
    });

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const showDialog = (data: any) => {
        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        // 创建一个副本并更新响应式数据
        x_data_xsth = reactive(Object.assign({}, data));

        console.log(x_data_xsth);
    }
    const onDialogOpen = (data: any) => {
    }
    /**
     * 对话框关闭事件
     */
    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {

        console.log(x_data_xsth);

        emits("close", cancel, x_data_xsth, (result: boolean) => {
            cb(result);
        });
    }

    const onInputOpen_kcbh = () => {
        v_xsdck_list.value?.show_dialog({
            "f_cpbm": x_data_xsth["f_cpbm"] || ""
        });
    }

    const onDialogClose_kcbh = (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }

        console.log(data);

        x_data_xsth["f_kcmx_id"] = data["f_kcmx_id"];
        x_data_xsth["f_kcbh"] = data["f_kcbh"];
        x_data_xsth["f_cpmc"] = data["f_cpmc"];
        x_data_xsth["f_kcsl"] = data["f_kcsl"];

        x_data_xsth["f_xsd_id"] = data["f_xsd_id"];
        x_data_xsth["f_xsdh"] = data["f_xsdh"];

        x_data_xsth["f_khgl_id"] = data["f_khgl_id"];
        x_data_xsth["f_khmc"] = data["f_khmc"];

        x_data_xsth["f_fhr"] = data["f_lxr"];
        x_data_xsth["f_fhdh"] = data["f_lxdh"];
        x_data_xsth["f_fhdz"] = data["f_lxdz"];

        x_data_xsth["f_xsdck_id"] = data["f_xsdck_id"];
        x_data_xsth["f_thje"] = data["f_xsdj"] * data["f_kcsl"];
        x_data_xsth["f_xsje_s"] = eolib.fixed_num(data["f_thje"], 3);


        // 用户转换
        TLogic.updateDicUserData(data, ["f_xsy_id"]);

        cb(true);
    }

    /**
     * 设置编辑字段
     * @param mode 
     * @param fieldArray 
     */
    const setEditFields = (mode: number, fieldArray: string[]) => {
        x_edit_fields.value = TLogic.checkEditFields(x_edit_fields.value, fieldArray);
    }

    // 暴露方法给父组件
    defineExpose({
        showDialog,
        setEditFields,
    });
</script>

<style lang="scss" scoped>
</style>