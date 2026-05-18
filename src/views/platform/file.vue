<template>
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_s">类别</div>
                        <div class="input">
                            <el-select v-model="x_query_type"
                                placeholder="请选择" style="width:100%">
                                <el-option v-for="item in x_list_type" :key="item.value"
                                    :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_s">类型</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_ext"></el-input>
                        </div>
                    </div>
                    <div class="cell" style="width:300px;">
                        <div class="label_s">时间</div>
                        <div class="input">
                            <el-date-picker style="width:100%"
                                v-model="x_query_time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_s">名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_name"></el-input>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load">查找</el-button>
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
                    <el-table-column prop="f_ctime_s" label="时间" width="140" />
                    <el-table-column prop="f_name" label="名称" width="280" show-overflow-tooltip />
                    <el-table-column prop="f_type_s" label="类别" width="160" show-overflow-tooltip />
                    <el-table-column prop="f_ext" label="类型" width="100" show-overflow-tooltip />
                    <el-table-column prop="f_total" label="大小" width="140" show-overflow-tooltip />                    
                    <el-table-column prop="f_sign" label="编码" width="280" show-overflow-tooltip>
                        <template #default="scope">
                            <a target="_blank" :href="scope.row['f_url_s']">{{ scope.row['f_sign'] }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="f_user_id_s" label="创建人" width="100" />
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

    type t_table = InstanceType<typeof vtable>;
    const v_table_file = ref<t_table>();
    
    var x_show_loading = ref(false);

    const x_list_type = ref([
        { label: "-", value: "" },
        { label: "系统_流程文件", value: "file_platform_flow" },
        { label: "应用_产品定义", value: "file_logic_product" },
        { label: "应用_知识库", value: "file_logic_knowledge" },
        { label: "业务_供应商资料", value: "file_logic_gys_wdzl" },
    ]);

    const x_query_name = ref("");
    const x_query_type = ref("");
    const x_query_ext = ref("");
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
        data["f_ctime_s"] = eolib.datetime_2_short(data["f_ctime"]);
        data["f_url_s"] = TLogic.getXSaveDataUrl(data["f_file_id"]);

        // 用户转换
        TLogic.updateDicUserData(data, ["f_user_id"]);
        
        data["f_type_s"] = x_list_type.value.find(item => item.value == data["f_type"])?.label || "-";
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

        v_table_file.value!.load_list_net("/framework/hdata/file/query", {
            "type": x_query_type.value,
            "name": x_query_name.value,
            "ext": x_query_ext.value,
            "ctime1": x_query_time.value?.[0],
            "ctime2": x_query_time.value?.[1],
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

</script>

<style lang="scss" scoped>
</style>