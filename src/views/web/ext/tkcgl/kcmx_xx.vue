<template>
    <!-- 库存信息表单 -->
    <div class="eo_form">
        <div class="cell eo_w100">
            <div class="label_n">批次</div>
            <div class="input">
                <el-input v-model="x_data_kcmx['f_kcbh']" style="width:100%" 
                    :readonly="true">
                </el-input>
            </div>
        </div>
        <div class="cell eo_w100">
            <div class="label_n">产品名称</div>
            <div class="input">
                <el-input v-model="x_data_kcmx['f_cpmc']" style="width:100%" 
                    placeholder="请选择产品" readonly>
                    <template #append v-if="!props.readonly">
                        <el-button @click="onSelectProduct">
                            <el-icon><Search /></el-icon>
                        </el-button>
                    </template>
                </el-input>
            </div>
        </div>

        <div class="cell eo_w2">
            <div class="label_n">单件数量</div>
            <div class="input">
                <el-input-number v-model="x_data_kcmx['f_kcsl']" style="width:100%"
                    :min="0" :max="999999" :precision="3" :step="1" :disabled="props.readonly" />
            </div>
        </div>
        <div class="cell eo_w2">
            <div class="label_n">成本单价</div>
            <div class="input">
                <el-input-number v-model="x_data_kcmx['f_kcdj']" style="width:100%"
                    :min="0" :max="999999" :precision="3" :step="1" :disabled="props.readonly" />
            </div>
        </div>        
        <div class="cell eo_w2">
            <div class="label_n">入库时间</div>
            <div class="input">
                <el-input v-model="x_data_kcmx['f_rksj_s']" style="width:100%" 
                    :disabled="true"></el-input>
            </div>
        </div>
        <div class="cell eo_w2">
            <div class="label_n">出库时间</div>
            <div class="input">
                <el-input v-model="x_data_kcmx['f_pksj_s']" style="width:100%" 
                    :disabled="true"></el-input>
            </div>
        </div>


        <div class="cell eo_w2">
            <div class="label_n">盘库时间</div>
            <div class="input">
                <el-input v-model="x_data_kcmx['f_pksj_s']" style="width:100%" 
                    :disabled="true"></el-input>
            </div>
        </div>
        <div class="cell eo_w2">
            <div class="label_n">库管员</div>
            <div class="input">
                <el-input v-model="x_data_kcmx['f_kgy_id_s']" style="width:100%" 
                    :disabled="true"></el-input>
            </div>
        </div>
        
        <div class="cell eo_w2">
            <div class="label_n">仓库</div>
            <div class="input">
                <vdic style="width:100%" dic="产品仓库" :all="false" field="value"
                    v-model="x_data_kcmx['f_hwck']" :disabled="props.readonly" />
            </div>
        </div>
        <div class="cell eo_w2">
            <div class="label_n">调拨状态</div>
            <div class="input">
                <vdic style="width:100%" dic="调拨状态" :all="false" field="value"
                    v-model="x_data_kcmx['f_jyzt']" :disabled="true" />
            </div>
        </div>

        <div class="cell eo_w100">
            <div class="label_n">备注</div>
            <div class="input">
                <el-input v-model="x_data_kcmx['f_beizhu']" style="width:100%"
                    maxlength="200" placeholder="请输入备注" :disabled="props.readonly"></el-input>
            </div>
        </div>

        <div class="cell eo_w2" v-if="x_edit_add">
            <div class="label_n">入库件数<span style="color:red;">*</span></div>
            <div class="input">
                <el-input-number v-model="x_data_kcmx['rksl']" style="width:100%"
                    :min="1" :max="99" :precision="0" :step="1"/>
            </div>
        </div>
    </div>
    
    <!-- 产品选择对话框 -->
    <cpdy_list ref="v_cpdy_list" @close="onDialogClose_cpdy_list" />

</template>

<script lang="ts" setup>

    import { ref, reactive } from "vue"
    import { Search } from '@element-plus/icons-vue'
    import type { cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";
    import vdialog from "@/components/web/vdialog.vue"
    import vdic from "@/components/web/vdic.vue"

    import TLogic from "@/logic/TLogic";
    import TGlobal from "@/logic/TGlobal";

    import cpdy_list from "@/views/web/ext/tkcgl/cpdy_list.vue"

    const props = defineProps<{
        readonly?: boolean
    }>();

    const v_cpdy_list = ref<InstanceType<typeof cpdy_list>>();
    // 表单数据
    const x_data_kcmx: any = reactive({});
    // 是否新增
    const x_edit_add = ref(false);

    let m_data_string = "";

    /**
     * 显示对话框
     * @param data 数据对象
     */
    const loadData = (data: any) => {

        x_edit_add.value = !eocore.check_id(data, "f_kcmx_id");

        m_data_string = JSON.stringify(data);
        // 创建一个副本并更新响应式数据
        Object.assign(x_data_kcmx, data);

        console.log("loadData", x_data_kcmx, x_edit_add);
    }

    const getData = () => {
        return x_data_kcmx;
    }

    const isNoChanged = (): boolean => {
                
        const dataStr = JSON.stringify(x_data_kcmx);
        //console.log("dataStr", (dataStr == m_data_string), dataStr, m_data_string);
        return (dataStr == m_data_string);
    }

    /**
     * 选择产品
     */
    const onSelectProduct = () => {
        v_cpdy_list.value?.show_dialog({});
    }

    /**
     * 产品选择回调
     */
    const onDialogClose_cpdy_list = (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        
        if (cancel) {
            cb(true); return;
        }

        // 先取实际成本价，如果无则取定价
        let kcdj = eocore.to_float(data0["f_kcdj_s"]);
        if (kcdj <= 0.0) {
            kcdj = data0["f_cpjg"];
        }

        // 散装的产品打包入库，每包固定数量
        let cpsl = eocore.to_float(data0["f_bzsl"]);
        if (cpsl <= 0.0) {
            cpsl = 1.0;
        }

        // 更新产品信息
        x_data_kcmx["f_cpdy_id"] = data0["f_cpdy_id"];
        x_data_kcmx["f_cpmc"] = data0["f_cpmc"];
        x_data_kcmx["f_cpbm"] = data0["f_cpbm"];
        x_data_kcmx["f_kcdj"] = kcdj;
        x_data_kcmx["f_kcsl"] = cpsl;

        cb(true); 
    }

    const updateDataProc = async (): Promise<any[]|undefined> => {
        
        const data = x_data_kcmx;

        // 检查必填字段
        if (!eocore.check_id(data, "f_cpdy_id")) {
            eocore.show_info("请选择产品");
            return undefined;
        }

        const kcsl = eocore.to_int(data["f_kcsl"]);
        if (kcsl <= 0) {
            eocore.show_info("请输入单件数量");
            return undefined;
        }

        let dataNew = x_data_kcmx;
        let dataListNew: any[] = [];
        const isAdd = !eocore.check_id(data, "f_kcmx_id");
        data["_is_add"] = isAdd;

        // 扩展字段，批量添加
        let rksl = eocore.to_int(data["rksl"]);
        if (rksl <= 0) rksl = 1;
        if (rksl > 99) {
            eocore.show_info("单次入库数量不能超过100");
            return undefined;
        }

        if (isAdd) { 

            const kgyId = TGlobal.userData["f_user_id"];

            for (let i=0; i<rksl; i++) {
                
                data["f_kcbh"] = await TLogic.netLoad_RecordString_kcbh(
                    data["f_cpdy_id"], data["f_cpbm"]);
		        dataNew = await TLogic.netLoad_kcmx_upd(
                    0,
                    0,
                    data["f_cpdy_id"],
                    data["f_kcbh"],
                    data["f_rklb"],
                    data["f_rkid"],
                    data["f_hwck"],
                    data["f_kcdj"],
                    data["f_kcsl"],
                    kgyId,
                    data["f_beizhu"],
                    data["f_kcbz"],
                );

                dataListNew.push(dataNew);
            }

        } else {

            // 回写数据库
            dataNew = await TLogic.netLoad_kcmx_upd(
                data["f_kcmx_id"],
                data["f_kcmx_pid"],
                data["f_cpdy_id"],
                data["f_kcbh"],
                data["f_rklb"],
                data["f_rkid"],
                data["f_hwck"],
                data["f_kcdj"],
                data["f_kcsl"],
                data["f_kgy_id"],
                data["f_beizhu"],
                data["f_kcbz"],
            );
            if (dataNew == undefined) return undefined;

            dataListNew.push(dataNew);
        }

        return dataListNew;
    }

    // 暴露方法给父组件使用
    defineExpose({
        isNoChanged,
        loadData,
        getData,
        updateDataProc
    });
</script>

<style lang="scss" scoped>
</style>