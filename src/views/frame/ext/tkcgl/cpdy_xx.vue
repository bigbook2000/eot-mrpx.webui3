<template>
    <!-- 产品信息 -->
    <vdialog ref="v_dialog"
        width="600px" title="产品定义" 
        @close="onDialogClose">
        <div class="eo_form eo_w100">
            <div class="cell eo_w2">
                <div class="label_n">大类</div>
                <div class="input">
                    <el-select v-model="x_cpdy_data['f_cpdl_id']"
                        @change="onSelectChange_cpdl" 
                        placeholder="请选择" style="width:100%" >
                        <el-option v-for="item in x_cpdl_list"
                            :key="item['value']"
                            :label="item['label']"
                            :value="item['value']">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">小类</div>
                <div class="input">
                    <el-select v-model="x_cpdy_data['f_cpxl_id']" 
                        placeholder="请选择" style="width:100%" >
                        <el-option v-for="item in x_cpxl_list"
                            :key="item['value']"
                            :label="item['label']"
                            :value="item['value']">
                        </el-option>
                    </el-select>
                </div>
            </div>            
            <div class="cell eo_w100">
                <div class="label_n">名称</div>
                <div class="input">
                    <el-input v-model="x_cpdy_data['f_cpmc']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div> 
            <div class="cell eo_w2">
                <div class="label_n">编码</div>
                <div class="input">
                    <el-input v-model="x_cpdy_data['f_cpbm']" style="width:100%" readonly></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">规格</div>
                <div class="input">
                    <el-input v-model="x_cpdy_data['f_cpgg']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">尺寸</div>
                <div class="input">
                    <el-input v-model="x_cpdy_data['f_cpcc']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">重量</div>
                <div class="input">
                    <el-input v-model="x_cpdy_data['f_cpzl']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">单位</div>
                <div class="input">
                    <el-input v-model="x_cpdy_data['f_cpdw']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">单件数量</div>
                <div class="input">
                    <el-input-number style="width:100%"
                        v-model="x_cpdy_data['f_bzsl']" 
                        :step="1"
                        :min="0" 
                        :max="999999">
                    </el-input-number>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">定价</div>
                <div class="input">
                    <el-input-number style="width:100%"
                        v-model="x_cpdy_data['f_cpjg']" 
                        :precision="3" 
                        :step="1"
                        :min="0.0" 
                        :max="999999.99">
                    </el-input-number>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">状态</div>
                <div class="input">
                    <vdic style="width:100%" dic="产品状态" :all="false" field="value"
                        v-model="x_cpdy_data['f_cpzt']" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">库存单价</div>
                <div class="input">
                    <el-input v-model="x_cpdy_data['f_kcdj_s']" style="width:100%"
                        :disabled="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">库存数量</div>
                <div class="input">
                    <el-input v-model="x_cpdy_data['f_kcsl']" style="width:100%"
                        :disabled="true"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">描述</div>
                <div class="input">
                    <el-input v-model="x_cpdy_data['f_cpms']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
        </div>
    </vdialog>
</template>

<script setup lang="ts">

    import { ref, reactive, onMounted, nextTick } from "vue"

    import eocore from "@/inc/eocore";

    import type {cfunc_boolean} from "@/inc/eotypes";

    import vdialog from "@/logic/common/vdialog.vue"
    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    import vdic from "@/logic/common/vdic.vue"

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    let x_cpdy_data: any = reactive({
    });

    let m_cplb_list: any[] = [];

    let x_cpdl_list = ref<any[]>([]);
    let x_cpxl_list = ref<any[]>([]);

    onMounted(async () => {
    });

    const show_dialog = (data: any, cplbList: any[]) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        // 创建一个副本
        x_cpdy_data = reactive(Object.assign({}, data));

        m_cplb_list = cplbList;
        x_cpdl_list.value = m_cplb_list;

        let cpdlId = eocore.to_int(x_cpdy_data["f_cpdl_id"]);
        if (cpdlId > 0) {
            for (let d of m_cplb_list) {                
                if (d["value"] == cpdlId) {
                    //console.log(cpdlId, d);
                    x_cpxl_list.value = d.children;                    
                    break;
                }
            }
        }
    }

    const onDialogOpened = () => {
    }

    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        emits("close", cancel, x_cpdy_data, (result: boolean) => {
            cb(result);
        });
    }

    const onSelectChange_cpdl = async (value: any) => {

        for (let d of m_cplb_list) {
            if (d["value"] == value) {
                x_cpxl_list.value = d.children;                
                break;
            }
        }

        x_cpdy_data['f_cpxl_id'] = 0;
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>