<template>
    <vtab :itemList="['沟通记录', '成交记录']" v-model="x_tab_index" item-width="80px">
        <div class="eo_col" v-show="x_tab_index==0">
            <div class="eo_col_f">
                <div class="eo_scroll_v">
                <div class="chat-container">
                    <div class="chat-list" ref="v_khgt_ref">
                        <div v-for="(item, index) in x_khgt_list" :key="index" class="chat-item">
                            <div class="chat-header">
                                <span class="chat-time">{{ item['f_gtsj_s'] }}</span>
                                <span class="chat-user">{{ item['f_xsy_id_s'] }}</span>
                                <el-icon class="edit-icon" @click="onViewClick_kght(index)">
                                    <Edit />
                                </el-icon>
                            </div>
                            <div class="chat-content">
                                <span class="chat-method" v-if="item['f_gtfs']!=''">{{ item['f_gtfs'] }}</span>
                                <span class="chat-location">{{ item['f_gtdz'] }}</span>
                            </div>
                            <div class="chat-message" v-html="item['f_gtnr_s']"></div>
                        </div>
                        <div v-if="x_khgt_list.length === 0" class="empty-chat">
                            暂无沟通记录
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell">
                        <vbuttonk type="primary" class="input_w" permit="" 
                            v-if="x_edit_mode"
                            @click="onButtonClick_Add_khgt">新建沟通</vbuttonk>
                    </div>
                </div>
            </div>

        </div>
        <div class="eo_fill" v-show="x_tab_index==1">
            <div class="eo_col">
                <div class="eo_col_f">
                    <vtable ref="v_table_cjjl" 
                        name="成交记录"
                        id-field="f_kcmx_id"
                        @loading="onTableLoading_cjjl"
                        :on-item="onTableItem_cjjl"
                        :on-page="onTablePage_cjjl"
                        @row-click="onTableRowClick_cjjl">
                        <el-table-column prop="f_cjsj_s" label="时间" width="140" />                
                        <el-table-column prop="f_cpmc" label="产品名称" width="180" show-overflow-tooltip />                    
                        <el-table-column prop="f_xsje_s" label="金额" width="120" align="right" />
                        <el-table-column prop="f_kcsl" label="数量" width="120" />
                        <el-table-column prop="f_kcbh" label="批次" width="200" />
                        <el-table-column prop="f_xsy_id_s" label="销售员" width="120" />
                        <el-table-column prop="f_xsdh" label="订单号" width="160" />
                        <el-table-column prop="f_cpgg" label="规格" width="180" show-overflow-tooltip />
                        <el-table-column prop="f_cpcc" label="尺寸" width="160" show-overflow-tooltip />
                        <el-table-column prop="f_cpzl" label="重量" width="160" show-overflow-tooltip />
                        <el-table-column prop="f_cpdw" label="单位" width="100" show-overflow-tooltip />
                        <el-table-column prop="f_beizhu" label="备注" width="200" show-overflow-tooltip />
                        <el-table-column />
                    </vtable>
                </div>

                <!-- 分页 -->
                <div class="eo_page_bar">
                    <el-pagination
                        background
                        @current-change="onPageChange_cjjl"
                        :current-page="x_page_index"
                        :page-size="x_page_row_count"
                        layout="total, prev, pager, next, jumper"
                        :total="x_row_total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </vtab>
    
    <!-- 沟通信息对话框 -->
    <vformd ref="v_formd_khgt" title="沟通信息" width="700px"
        :form-types="x_form_types_khgt" @close="onFormdClose_khgt"/>
</template>


<script lang="ts" setup>

    import { ref, reactive, onMounted, nextTick } from "vue"
    import type { cfunc_boolean, cform_options } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"
    import vformd from "@/logic/common/vformd.vue"
    import vdialog from "@/logic/common/vdialog.vue"
    import vdic from "@/logic/common/vdic.vue"
    import vregion from "@/logic/common/vregion.vue"
    import vtab from "@/logic/common/vtab.vue"
    import { Edit } from '@element-plus/icons-vue'

    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    type t_table = InstanceType<typeof vtable>;
    const v_table_cjjl = ref<t_table>();

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_khgt = ref<t_formd>();

    const x_tab_index = ref(0);
    const x_khgt_list = ref<any[]>([]);
    const v_khgt_ref = ref<HTMLElement>();

    const x_show_loading = ref(false);
    let m_khgt_data: any = undefined; // 选中的沟通记录

    let m_khgl_data: any = {};
    const x_edit_mode = ref(false);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(50);
    const x_row_total = ref(0);

    // 沟通信息表单字段定义
    const x_form_types_khgt = ref<cform_options[]>([
        { type: "datetime", name: "f_gtsj", span: 2, label: "沟通时间" },
        { type: "number", name: "f_gtsc", span: 2, label: "沟通时长", precision: 0, min: 0 },
        { type: "input", name: "f_gtdz", span: 100, label: "沟通地点" },
        { type: "text2", name: "f_gtnr", span: 100, label: "沟通内容", row: 10 },
        { type: "dic", name: "f_gtfs", span: 2, label: "沟通方式", dic: "沟通方式", all: false, field: "label" },
        { type: "label", name: "f_xsy_id_s", span: 2, label: "销售员" },
    ]);

    // 加载沟通记录数据
    const loadData = async (khglData: any, editMode: boolean) => {

        m_khgl_data = khglData;
        x_khgt_list.value = [];
        m_khgt_data = undefined;
        x_edit_mode.value = editMode;

        if (khglData == undefined) {
            return;
        }

        const ret = await eocore.proc("p_khgt_list", {
            "v_khgl_id": khglData["f_khgl_id"] 
        });
        const list = eocore.check_net_array(ret);
        if (list == undefined) return;

        for (let d of list) {
           updateItemData_khgt(d);
        }

        x_khgt_list.value = list;
            
        // 滚动到底部
        nextTick(() => {
            if (v_khgt_ref.value) {
                v_khgt_ref.value.scrollTop = v_khgt_ref.value.scrollHeight;
            }
        });

        await netLoad_xsdck_query(-1);
    };

    const updateItemData_khgt = (data: any): any => {
        
        data["f_gtsj_s"] = eolib.datetime_2_short(data["f_gtsj"]);
        data["f_gtnr_s"] = data["f_gtnr"];
        data["f_gtnr"] = eolib.decode_string(data["f_gtnr_s"]);
        TLogic.updateDicUserData(data, ["f_xsy_id"]);

        return data;
    };

    const netLoad_xsdck_query = async (pageIndex: number = -1) => {

        const pageRowCount = x_page_row_count.value;
        const rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_table_cjjl.value?.load_list_proc("p_xsdck_query", { 
            "v_xsy_id": -1, 
            "v_khgl_id": m_khgl_data["f_khgl_id"],           
            "v_khmc": "",
            "v_xsdh": "", 
            "v_cjsj1": "", 
            "v_cjsj2": "", 
            "v_kcbh": "", 
            "v_cpmc": "", 
            "v_order_by": " ORDER BY f_xsdck_id DESC",
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount
        });
    }    

    const onViewClick_kght = (index: number) => {
        // 点击聊天记录，设置为选中状态并打开编辑对话框
        m_khgt_data = x_khgt_list.value[index];
        v_formd_khgt.value?.show_dialog(m_khgt_data);
    };

    // 成交记录表格相关
    const onTableLoading_cjjl = (loading: boolean) => {
    };

    const onTableItem_cjjl = (item: any) => {
        // 日期格式化
        item["f_cjsj_s"] = eolib.datetime_2_short(item["f_cjsj"]);
        
        // 金额格式化
        item["f_xsje_s"] = eolib.fixed_num(item["f_xsdj"] * item["f_kcsl"], 3);
        
        // 用户转换
        TLogic.updateDicUserData(item, ["f_xsy_id"]);
    };

    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_cjjl = (n: number): number => {
        x_row_total.value = n;
        return n;
    }

    /**
     * 分页点击事件
     * @param pageIndex 页码
     */
    const onPageChange_cjjl = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_xsdck_query(pageIndex - 1);
    }
    
    const onTableRowClick_cjjl = (item: any) => {
    };

    // 沟通信息对话框关闭事件
    const onFormdClose_khgt = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true);
            return;
        }

        // 验证必填字段
        if (!data["f_gtsj"]) {
            eocore.show_info('请选择沟通时间');
            cb(false);
            return;
        }
        if (!data["f_gtnr"]) {
            eocore.show_info('请输入沟通内容');
            cb(false);
            return;
        }

        data["f_gtnr"] = eolib.encode_string(data["f_gtnr"]);

        x_show_loading.value = true;
        // 调用存储过程保存沟通记录
        const ret = await eocore.proc("p_khgt_upd", {
            "v_khgt_id": data["f_khgt_id"],
            "v_khgl_id": data["f_khgl_id"],
            "v_gtsj": data["f_gtsj"],
            "v_gtfs": data["f_gtfs"],
            "v_gtdz": data["f_gtdz"],
            "v_gtsc": data["f_gtsc"],
            "v_gtnr": data["f_gtnr"],
            "v_xsy_id": data["f_xsy_id"],
        });

        const dataNew = eocore.check_net_object(ret);
        x_show_loading.value = false;

        if (dataNew == undefined) {
            cb(false);
            return;
        }

        updateItemData_khgt(dataNew);
        x_khgt_list.value.splice(0, 0, dataNew);

        eocore.show_success('修改成功');
        cb(true);
    };
    

    const onButtonClick_Add_khgt = () => {

        const dt = new Date();
        const khglId = eocore.to_int(m_khgl_data?.["f_khgl_id"]);
        if (khglId <= 0) {
            eocore.show_info('请先勾选客户');
            return;
        }
        
        const khgtData = {
            "f_khgt_id": 0,
            "f_khgl_id": khglId,
            "f_gtsj": eolib.datetime_2_string(dt),
            "f_gtsc": 0,
            "f_gtfs": "",
            "f_gtdz": "",
            "f_gtnr": "",
            "f_xsy_id": TGlobal.userData["f_user_id"],
            "f_xsy_id_s": TGlobal.userData["f_name"],
        };
        v_formd_khgt.value?.show_dialog(khgtData);
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