<template>
    <!-- 采购退货编辑对话框 -->
    <vdialog ref="v_dialog"
        width="1000px" title="采购退货"
        @open="onDialogOpen"
        @close="onDialogClose">
        <div class="eo_form">
            <div class="cell eo_w2">
                <div class="label_n">货物批次</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_kcbh']" style="width:100%"
                        placeholder="请选择货物批次" readonly>
                        <template #append>
                            <el-button :icon="More" @click="onInputOpen_cgdrk" 
                                v-show="x_edit_fields['f_kcbh']"/>
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">产品名称</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_cpmc']" style="width:100%"
                        maxlength="100" disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">数量</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_kcsl']" style="width:100%"
                        disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">采购单号</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_cgdh']" style="width:100%"
                        maxlength="50" disabled>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">供应商</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_gysmc']" style="width:100%"
                        placeholder="请输入供应商" disabled>
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">物流公司</div>
                <div class="input">
                    <twlgs v-model="x_data_cgth['f_wlgs_id']" 
                        :label="x_data_cgth['f_wlgs_id_s']" 
                        :disabled="!x_edit_fields['f_wlgs_id']"
                        @change="(value: any) => { x_data_cgth['f_wlgs_id_s'] = value['f_wlgs_id_s']; }"/>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">退款金额</div>
                <div class="input">
                    <el-input-number v-model="x_data_cgth['f_thje']" 
                        :precision="2" :step="0.01" :min="0"
                        style="width:100%" :disabled="!x_edit_fields['f_thje']"/>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">物流单号</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_wldh']" style="width:100%"
                        maxlength="50" placeholder="请输入物流单号" 
                        :disabled="!x_edit_fields['f_wldh']">
                    </el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">收货人</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_shr']" style="width:100%"
                        maxlength="50" placeholder="请输入收货人"
                        :disabled="!x_edit_fields['f_shr']"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">收货电话</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_shdh']" style="width:100%"
                        maxlength="20" placeholder="请输入收货电话"
                        :disabled="!x_edit_fields['f_shdh']"></el-input>
                </div>
            </div>
            <div class="cell eo_w4">
                <div class="label_n">采购员</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_cgy_id_s']" style="width:100%"
                        disabled></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">收货地址</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_shdz']" style="width:100%"
                        maxlength="200" placeholder="请输入收货地址"
                        :disabled="!x_edit_fields['f_shdz']"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">退货原因</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_thyy']" style="width:100%"
                        type="textarea" :rows="3"
                        maxlength="500" placeholder="请输入退货原因"
                        :disabled="!x_edit_fields['f_thyy']"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input v-model="x_data_cgth['f_beizhu']" style="width:100%"
                        maxlength="50" placeholder="请输入备注"></el-input>
                </div>
            </div>
        </div>
        <cgdrk_list ref="v_cgdrk_list" @close="onDialogClose_cgdrk"/>
    </vdialog>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import vdialog from "@/components/web/vdialog.vue"

    import TLogic from "@/logic/TLogic";

    import cgdrk_list from "@/views/vweb/ext/tcggl/cgdrk_list.vue"
    import twlgs from "@/views/vweb/ext/comm/twlgs.vue"
    import eolib from "@/inc/eolib";

    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    const v_cgdrk_list = ref<InstanceType<typeof cgdrk_list>>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    let x_data_cgth: any = reactive({});
    let m_edit_mode = 0;

    const x_edit_fields = ref<any>({
        "f_kcbh": false,
        "f_wlgs_id": false,
        "f_wldh": false,
        "f_thje": false,
        "f_shr": false,
        "f_shdh": false,
        "f_shdz": false,
        "f_thyy": false,
        "f_beizhu": false
    });

    /**
     * 显示对话框
     */
    const showDialog = (data: any) => {
        v_dialog.value!.show_dialog(undefined);
        x_data_cgth = reactive(Object.assign({}, data));
    }
    const onDialogOpen = (data: any) => {
    }
    /**
     * 对话框关闭事件
     */
    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (m_edit_mode == 0) {
            cb(true); return;
        }

        emits("close", cancel, x_data_cgth, (result: boolean) => {
            cb(result);
        });
    }

    const onInputOpen_cgdrk = () => {
        v_cgdrk_list.value?.show_dialog({});
    }

    const onDialogClose_cgdrk = (cancel: boolean, data: any, cb: cfunc_boolean) => {

        if (cancel) {
            cb(true); return;
        }

        x_data_cgth["f_kcmx_id"] = data["f_kcmx_id"];
        x_data_cgth["f_kcbh"] = data["f_kcbh"];
        x_data_cgth["f_cpmc"] = data["f_cpmc"];
        x_data_cgth["f_kcsl"] = data["f_kcsl"];

        x_data_cgth["f_cgd_id"] = data["f_cgd_id"];
        x_data_cgth["f_cgdh"] = data["f_cgdh"];

        x_data_cgth["f_gys_id"] = data["f_gys_id"];
        x_data_cgth["f_gysmc"] = data["f_gysmc"];

        x_data_cgth["f_shr"] = data["f_lxr"];
        x_data_cgth["f_shdh"] = data["f_lxdh"];
        x_data_cgth["f_shdz"] = data["f_lxdz"];

        x_data_cgth["f_cgdrk_id"] = data["f_cgdrk_id"];
        x_data_cgth["f_thje"] = data["f_cgdj"] * data["f_kcsl"];

        TLogic.updateDicUserData(data, ["f_cgy_id"]);

        cb(true);
    }

    /**
     * 设置编辑字段
     */
    const setEditFields = (mode: number, fieldArray: string[]) => {
        m_edit_mode = mode;
        x_edit_fields.value = TLogic.checkEditFields(x_edit_fields.value, fieldArray);
    }

    defineExpose({
        showDialog,
        setEditFields,
    });
</script>

<style lang="scss" scoped>
</style>
