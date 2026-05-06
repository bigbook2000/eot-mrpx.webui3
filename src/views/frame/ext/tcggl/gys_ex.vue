<template>
    <vtab :itemList="['采购记录', '资料文档']" v-model="x_tab_index" item-width="80px">

        <div class="eo_fill" v-show="x_tab_index==0">
            <vtable ref="v_table_cgjl" 
                name="采购记录"
                id-field="f_kcmx_id"
                @loading="onTableLoading"
                :on-item="onTableItem_cgjl"
                @row-click="onTableRowClick_cgjl">
                <el-table-column prop="f_cjsj_s" label="时间" width="140" />                
                <el-table-column prop="f_cpmc" label="产品名称" width="180" show-overflow-tooltip />                    
                <el-table-column prop="f_xsje_s" label="金额" width="120" align="right" />
                <el-table-column prop="f_kcsl" label="数量" width="120" />
                <el-table-column prop="f_kcbh" label="批次" width="200" />
                <el-table-column prop="f_cgdh" label="采购单" width="160" />
                <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                <el-table-column />
            </vtable>
        </div>

        <div class="eo_col" v-show="x_tab_index==1">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell">
                        <vbuttonk type="primary" class="input_w" permit="" 
                            @click="onButtonClick_Add_wjzl">添加资料</vbuttonk>
                        <vbuttonk type="default" class="input_w" permit="" 
                            @click="onButtonClick_Del_wjzl">删除资料</vbuttonk>
                        <vbuttonk type="primary" class="input_w" permit="" 
                            @click="onButtonClick_Upd_wjzl">修改资料</vbuttonk>
                    </div>
                </div>
            </div>
            <div class="eo_col_f">
                <vtable ref="v_table_wjzl" 
                    name="文件资料"
                    id-field="f_wdzl_id"
                    @loading="onTableLoading"
                    :on-item="onTableItem_wdzl"
                    @row-click="onTableRowClick_wdzl">
                    <el-table-column prop="f_xgsj_s" label="时间" width="140" />                
                    <el-table-column prop="f_url_s" label="文件" width="200" show-overflow-tooltip>
                        <template #default="scope">
                            <a target="_blank" :href="scope.row['f_url_s']">{{ scope.row['f_name'] }}</a>
                        </template>
                    </el-table-column> 
                    <el-table-column prop="f_wdms" label="描述" width="400" show-overflow-tooltip /> 
                    <el-table-column />
                </vtable>
            </div>
        </div>
    </vtab>
    
    <!-- 文件对话框 -->
    <wdzl_xx ref="v_wdzl_xx" title="文件信息" width="600px"
        :file-type="TLogic.fileTypes['业务_供应商资料']" 
        @close="onFiledClose_wdzl"/>

</template>


<script lang="ts" setup>

    import { ref, reactive, onMounted, nextTick } from "vue"
    import type { cfunc_boolean, cform_options } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"
    import vtab from "@/logic/common/vtab.vue"


    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    import wdzl_xx from "./wdzl_xx.vue";

    type t_table = InstanceType<typeof vtable>;
    const v_table_cgjl = ref<t_table>();
    const v_table_wjzl = ref<t_table>();

    const v_wdzl_xx = ref<InstanceType<typeof wdzl_xx>>();

    const x_tab_index = ref(0);

    const x_show_loading = ref(false);

    const x_gys_data = ref<any>({});

    // 加载供应商记录
    const loadData = async (gysData: any) => {

        x_gys_data.value = { ...gysData };

        if (gysData == undefined) {
            return;
        }

        await netLoad_cgdrk_query();
        await netLoad_wjzl_query();
    };

    const netLoad_cgdrk_query = async () => {

        v_table_cgjl.value?.load_list_proc("p_cgdrk_query", { 
            "v_gys_id": x_gys_data.value["f_gys_id"],
            "v_gysmc": "",
            "v_cgdh": "", 
            "v_cjsj1": "", 
            "v_cjsj2": "", 
            "v_kcbh": "", 
            "v_cpmc": "", 
            "v_order_by": " ORDER BY f_cgdrk_id DESC",
            "s_page_row_index": 0,
            "s_page_row_count": 200
        });
    }

    const netLoad_wjzl_query = async () => {

        let ret = await eocore.proc("p_wdzl_query", {             
            "v_type": "业务_供应商资料",
            "v_keyid": x_gys_data.value["f_gys_id"],
            "v_wdlx": "", 
            "v_wdly": "", 
            "v_yxbz": -1, 
            "v_wdms": "", 
            "v_user_id": -1, 
            "v_xgsj1": "", 
            "v_xgsj2": "", 
            "s_page_row_index": 0,
            "s_page_row_count": 200
        });
        const list1 = eocore.check_net_array(ret);
        if (list1 == undefined) return;

        if (list1.length > 0) {
            const keyIds = list1.map((item: any) => item["f_wdzl_id"]).join(",");        
            ret = await eocore.post("/framework/hdata/file/list", [{
                "v_type": TLogic.fileTypes["业务_供应商资料"],
                "v_keyids": keyIds,
                "v_index": -1
            }]);
            const list2 = eocore.check_net_array(ret);
            if (list2 == undefined) return;

            eolib.list_merge(list1, list2, "f_wdzl_id", "f_keyid");

            //console.log(list1, list2);
        }
        v_table_wjzl.value?.load_list(list1);
    }

    // 成交记录表格相关
    const onTableLoading = (loading: boolean) => {
        x_show_loading.value = loading;
    };
    const onTableItem_cgjl = (item: any) => {
        // 日期格式化
        item["f_cjsj_s"] = eolib.datetime_2_short(item["f_cjsj"]);
        
        // 金额格式化
        item["f_xsje_s"] = eolib.fixed_num(item["f_xsdj"] * item["f_kcsl"], 3);
        
        // 用户转换
        TLogic.updateDicUserData(item, ["f_xsy_id"]);
    };
    
    const onTableRowClick_wdzl = (item: any) => {
    };
    const onTableItem_wdzl = (item: any) => {
        // 日期格式化
        item["f_xgsj_s"] = eolib.datetime_2_short(item["f_xgsj"]);

        item["f_url_s"] = TLogic.getXSaveDataUrl(item["f_file_id"]);
    };
    
    const onTableRowClick_cgjl = (item: any) => {
    };    

    // 沟通信息对话框关闭事件
    const onFiledClose_wdzl = async (cancel: boolean, data0: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true);
            return;
        }

        v_table_wjzl.value?.update_data(data0, -1, true, true);

        cb(true);
    };
    

    const onButtonClick_Add_wjzl = () => {

        const dts = eolib.date_2_string(new Date());
        const gysId = eocore.to_int(x_gys_data.value["f_gys_id"]);
        if (gysId <= 0) {
            eocore.show_info('请先选择供应商');
            return;
        }

        v_wdzl_xx.value?.showDialog({
            "f_wdzl_id": 0,
            "f_type": "业务_供应商资料",
            "f_keyid": gysId,            
            "f_wdlx": "",
            "f_wdms": "",
            "f_wdly": "",
            "f_xgsj": dts,
            "f_xgsj_s": dts,
            "f_yxbz": 1,
            "f_user_id": TGlobal.userData["f_user_id"],
            "f_user_id_s": TGlobal.userData["f_name"],
            "f_file_id": 0,
        });
    };

    const onButtonClick_Del_wjzl = () => {

        const wdzlData = v_table_wjzl.value?.get_select_data(true);
        if (wdzlData == undefined) return;

        v_table_wjzl.value?.remove_data_proc("p_wdzl_del", async (data: any) => {
            return {
                "v_wdzl_id": data["f_wdzl_id"]
            };
        })
    };

    const onButtonClick_Upd_wjzl = () => {

        const wdzlData = v_table_wjzl.value?.get_select_data(true);
        if (wdzlData == undefined) return;

        v_wdzl_xx.value?.showDialog(wdzlData);
    };
    
    // 组件挂载时加载数据
    onMounted(() => {
    });
    
    defineExpose({
        loadData
    });
</script>

<style lang="scss" scoped>
.chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-top: 10px;
}

.chat-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: #f5f5f5;
}

.chat-item {
    background: white;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
    
    &:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
    }
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
}

.edit-icon {
    cursor: pointer;
    color: #409eff;
    font-size: 16px;
    margin-left: 8px;
    transition: all 0.2s ease;
    
    &:hover {
        color: #66b1ff;
        transform: scale(1.1);
    }
}

.chat-time {
    color: #666;
    font-size: 14px;
}

.chat-user {
    color: #409eff;
    font-size: 14px;
}

.chat-content {
    display: flex;
    gap: 15px;
    margin-bottom: 8px;
    color: #888;
}

.chat-method {
    background: #f0f9ff;
    color: #409eff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 14px;
}

.chat-location {
    color: #67c23a;
    font-size: 14px;
}

.chat-message {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
}

.empty-chat {
    text-align: center;
    color: #999;
    padding: 40px 0;
    font-size: 14px;
}

// 自定义滚动条样式
.chat-list::-webkit-scrollbar {
    width: 6px;
}

.chat-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.chat-list::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
        background: #a8a8a8;
    }
}
</style>