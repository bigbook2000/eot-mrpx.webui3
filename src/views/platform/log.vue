<template>
    <div class="eo_page" v-loading="x_show_loading">
        <!-- 日志管理 -->
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_s">用户</div>
                        <div class="input">
                            <user_input v-model="x_query_yg_id" 
                                :userName="x_query_yg_id_s" 
                                style="width:100%"></user_input>
                        </div>
                    </div>              
                    <div class="cell" style="width:300px;">
                        <div class="label_s">时间</div>
                        <div class="input">
                            <el-date-picker style="width:210px"
                                v-model="x_query_time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="cell eo_w240p">
                        <div class="label_s">接口</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_url"></el-input>
                        </div>
                    </div>
                </div>
                <div class="eo_form">
                    <div class="cell eo_w240p">
                        <div class="label_s">地址</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_addr"></el-input>
                        </div>
                    </div>                    
                    <div class="cell" style="width: 300px;">
                        <div class="label_s">参数</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_param"></el-input>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load">查找</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="default" class="eo_w80p" @click="onButtonClick_Detail">详情</el-button>
                        </div> 
                    </div>
                </div>                
            </div>
            <div class="eo_col_f">
                <vtable ref="v_table_file" 
                    name="文件"
                    id-field="f_file_id" 
                    :on-item="onTableItem_file"
                    :on-page="onTablePage_file"
                    @loading="onTableLoading_file">
                    
                    <el-table-column prop="f_log_time_s" label="时间" width="140" />
                    <el-table-column prop="f_user_id_s" label="用户" width="100" />
                    <el-table-column prop="f_address" label="地址" width="200" />
                    <el-table-column prop="f_url" label="接口" width="240" show-overflow-tooltip />                    
                    <el-table-column prop="f_request" label="请求" width="320" show-overflow-tooltip />
                    <el-table-column prop="f_response" label="响应" width="320" show-overflow-tooltip />                    
                    
                    <el-table-column />
                </vtable>
            </div>

            <!-- 分页 -->
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_file"
                    :current-page="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next, jumper"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>
    </div>

    <!-- 日志详情对话框 -->
    <vformd ref="v_formd_log" title="日志详情" width="700px"
        :form-types="x_form_types_log" @close="onFormdClose_log"/>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "platform_menu" }
</script>

<script lang="ts" setup>
    
    import { ref, reactive, onMounted } from "vue"
    import router from "@/router/index"

    import eocore from "@/inc/eocore"
    import eodic from "@/inc/eodic"
    import eolib from "@/inc/eolib"

    import TGlobal from "@/logic/TGlobal"
    import TLogic from "@/logic/TLogic"

    import vtable from "@/logic/common/vtable.vue"
    import user_input from "@/views/platform/user_input.vue"
    import vformd from "@/logic/common/vformd.vue"

    import type { cform_options } from "@/inc/eotypes"

    type t_table = InstanceType<typeof vtable>;
    const v_table_file = ref<t_table>();

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_log = ref<t_formd>();
    
    var x_show_loading = ref(false);

    const x_form_types_log: cform_options[] = [
        { type: "input", name: "f_log_time_s", span: 2, label: "时间" },
        { type: "input", name: "f_url", span: 2, label: "接口" },
        { type: "input", name: "f_user_id_s", span: 2, label: "用户" },
        { type: "input", name: "f_address", span: 2, label: "地址" },        
        { type: "text", name: "f_request", span: 100, label: "请求" },
        { type: "text2", name: "f_response", span: 100, label: "响应", row: 10 },
    ];

    const x_query_yg_id = ref(0);
    const x_query_yg_id_s = ref("");
    const x_query_url = ref("");
    const x_query_addr = ref("");
    const x_query_param = ref("");
    const x_query_time = ref<[string, string] | undefined>(undefined);

    // 分页变量
    const x_page_index = ref(1);
    const x_page_row_count = ref(50);
    const x_row_total = ref(0);

    onMounted(async () => {
        netLoad_file_query(-1);
    });

    const onTableLoading_file = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableItem_file = (data: any) => {
        data["f_log_time_s"] = eolib.datetime_2_short(data["f_log_time"]);
        data["f_url_s"] = TLogic.getXSaveDataUrl(data["f_file_id"]);

        // 用户转换
        TLogic.updateDicUserData(data, ["f_user_id"]);
    }
    /**
     * 分页处理
     * @param n 总记录数
     */
    const onTablePage_file = (n: number): number => {
        x_row_total.value = n;
        return n;
    }

    const netLoad_file_query = (pageIndex: number = -1) => {
                
        const pageRowCount = x_page_row_count.value;
        const rowIndex = pageIndex * pageRowCount;
        if (pageIndex < 0) x_page_index.value = 1;

        v_table_file.value!.load_list_net("/common/log/query", {
            "user_id": x_query_yg_id.value,
            "address": x_query_addr.value,
            "url": x_query_url.value,
            "request": x_query_param.value,
            "response": x_query_param.value,
            "log_time1": x_query_time.value?.[0],
            "log_time2": x_query_time.value?.[1],
            "s_page_row_index": rowIndex,
            "s_page_row_count": pageRowCount,
        });
    }

    const onButtonClick_Load = () => {
        netLoad_file_query(-1);
    }

    const onPageChange_file = (pageIndex: number) => {
        x_page_index.value = pageIndex;
        netLoad_file_query(pageIndex - 1);
    }

    const onButtonClick_Detail = () => {
        const data = v_table_file.value?.get_select_data(true);
        if (!data) return;
        v_formd_log.value?.show_dialog(data);
    }

    const onFormdClose_log = (cancel: boolean, data: any, cb: any) => {
        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>