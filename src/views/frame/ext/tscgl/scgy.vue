<template>
    <!-- 生产工艺 -->
    <div class="eo_page" v-loading="x_show_loading">    
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_n">产品名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_cpmc"></el-input>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_cpdy">查找</el-button>
                        </div>                        
                    </div>
                </div>
            </div>
            <div class="eo_col_sp"></div>            
            <div class="eo_col_f">
                <vtable ref="v_table_cpbj" 
                    name="生产工艺"
                    key="id"
                    id-field="f_cpdy_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_cpdy"
                    @row-click="onTableRowClick_cpdy">                    
                    <el-table-column prop="f_cpmc" label="名称" width="320" show-overflow-tooltip />
                    <el-table-column prop="f_cpbm" label="编码" width="160" />
                    <el-table-column prop="f_bjsl_s" label="部件数量" width="90" align="center" />
                    <el-table-column prop="f_kcsl" label="库存数量" width="120" align="right" />
                    <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                    <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                    <el-table-column prop="f_dlmc" label="大类" width="120" show-overflow-tooltip />
                    <el-table-column prop="f_xlmc" label="小类" width="140" show-overflow-tooltip />
                    <el-table-column prop="f_cjsj_s" label="上架时间" width="140" />
                    <el-table-column prop="f_cpms" label="描述" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "ext_scgl_scgy" }
</script>

<script lang="ts" setup>
    import { ref, nextTick, onMounted, type Ref } from "vue"
    import type { cform_options, cfunc_boolean, cdic_item, ctree_node } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import { ElTree } from 'element-plus'
    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import TLogic from "@/logic/TLogic";

    type t_table = InstanceType<typeof vtable>;
    const v_table_cpbj = ref<t_table>();

    let x_show_loading = ref(false);

    const x_query_cpmc = ref("");

    onMounted(async () => {
        await netLoad_cpbj_query();
    });

    let treeNodeId = 0;
    /**
     * 进行编号唯一化
     * @param node1 节点
     * @param node2 节点
     */
    const treeNode_assign = (node1: any, node2: any) => {

        treeNodeId++;
        node2.rowId = treeNodeId;

        for (let i in node1.children) {

            let d1 = node1.children[i];

            let d2 = Object.assign({}, {}, d1);
            d2["f_bjsl"] = node1.dcounts[i];
            d2["f_bjsl_s"] = "" + d2["f_bjsl"];

            d2.children = [] as any[];
            node2.children.push(d2);

            treeNode_assign(d1, d2);
        }
    }

    const netLoad_cpbj_query = async () => {

        x_show_loading.value = true;
        let ret = await eocore.proc("p_cpbj_plist", {
        });
        x_show_loading.value = false;

        let list = eocore.check_net_array(ret) || [];

        let plist: any[] = [];
        for (let d1 of list) {
            d1.dcounts = [] as number[]; // 记录部件数量
            d1.children = [] as any[];
            if (d1["f_bjsl"] == 0) {                
                plist.push(d1)
            }
        }

        for (let d1 of list) {
            if (d1["f_bjsl"] == 0) continue;

            let dp = undefined,
                dc = undefined;
            for (let d2 of plist) {
                if (d1["f_cpdy_pid"] == d2["f_cpdy_id"]) {
                    dp = d2;
                }
                if (d1["f_cpdy_id"] == d2["f_cpdy_id"]) {
                    dc = d2;
                }

                if (dp != undefined && dc != undefined) break;
            }

            if (dp != undefined) {
                if (dc != undefined) {
                    dp.children.push(dc);
                } else {
                    dp.children.push(d1);
                }
                dp.dcounts.push(d1["f_bjsl"]);
            }
        }

        let plist2: any[] = [];
        // 进行编号唯一化
        for (let i in plist) {

            let d1 = plist[i];
            let d2 = Object.assign({}, {}, d1);
            d2.children = [] as any[];
            d2["f_bjsl"] = 0;
            d2["f_bjsl_s"] = "";

            plist2.push(d2);

            treeNode_assign(d1, d2);
        }
        
        //console.log(plist2);
        v_table_cpbj.value?.load_list(plist2);
    }

    const onTableLoading = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableItem_cpdy = (data: any) => {
        //console.log(data);
    }

    const onTableRowClick_cpdy = (data: any) => {
    }

    const onButtonClick_Load_cpdy = () => {
        netLoad_cpbj_query();
    }

</script>

<style lang="scss" scoped>
</style>