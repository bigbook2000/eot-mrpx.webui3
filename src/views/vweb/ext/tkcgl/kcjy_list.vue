<template>
    <!-- 借用记录 -->
    <div class="eo_col">
        <div class="eo_col_d eo_tool_bar">
            <div class="eo_form">
                <div class="cell eo_w280p">
                    <div class="label_n">批次<span style="color:red;">*</span></div>
                    <div class="input">
                        <el-input v-model="x_data_kcmx['f_kcbh']" style="width:100%" disabled>
                        </el-input>
                    </div>
                </div>
                <div class="cell eo_w280p">
                    <div class="label_n">产品名称</div>
                    <div class="input">
                        <el-input v-model="x_data_kcmx['f_cpmc']" style="width:100%" disabled>                        
                        </el-input>
                    </div>
                </div>
            </div> 
        </div>
        <div class="eo_col_f">
            <vtable ref="v_table_kcjy" 
                name="调拨记录"
                id-field="f_kcmx_id"
                @loading="onTableLoading"
                :on-item="onTableItem_kcjy">                            
                <el-table-column prop="f_jyzt_s" label="调拨状态" width="90" />
                <el-table-column prop="f_jysj_s" label="调拨时间" width="160" />
                <el-table-column prop="f_jyyg_id_s" label="调拨员工" width="120" />                    
                <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                <el-table-column prop="f_kgy_id_s" label="库管员" width="120" />
                <el-table-column />
            </vtable>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive } from "vue"
    import { More } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";
    import eodic from "@/inc/eodic";

    import vdic from "@/components/vdic.vue"
    import vtable from "@/components/web/vtable.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    type t_table = InstanceType<typeof vtable>;
    const v_table_kcjy = ref<t_table>();

    // 定义组件事件
    const emits = defineEmits<{
        close: [cancel: boolean, data: any, cb: cfunc_boolean]
    }>();

    // 表单数据
    const x_data_kcmx: any = reactive({});

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const loadData = async (kcmxData: any) => {

        // 创建一个副本并更新响应式数据
        Object.assign(x_data_kcmx, kcmxData);

        v_table_kcjy.value?.load_list_proc("p_kcjym_list", {
            "v_kcmx_id": x_data_kcmx["f_kcmx_id"]
        })
    }

    const onTableLoading = (show: boolean) => {
    }
    const onTableItem_kcjy = (data: any) => {

        // 调拨状态
        data["f_jyzt_s"] = eodic.get_dic_label("调拨状态", data["f_jyzt"]);

        // 日期格式化
        data["f_jysj_s"] = eolib.datetime_2_short(data["f_jysj"]);

        // 用户转换
        TLogic.updateDicUserData(data, ["f_jyyg_id", "f_kgy_id"]);
    }

    // 暴露方法给父组件使用
    defineExpose({
        loadData
    });
</script>

<style lang="scss" scoped>
</style>