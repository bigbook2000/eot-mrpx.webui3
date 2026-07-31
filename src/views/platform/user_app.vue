<template>
    <el-dialog v-model="x_show_dialog"
        :fullscreen="true"
        :show-close="false"
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>选择用户</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div v-loading="x_show_loading">
            <div class="ap_list">
                <div v-if="x_data_list.length == 0" class="empty">
                    暂无数据
                </div>
                <div v-for="item in x_data_list" :key="item.f_user_id"
                    class="item"
                    :class="{ 'ap_sel': x_selected_id == item.f_user_id }"
                    @click="onItemClick(item)">
                    <div class="body">
                        <div class="row">
                            <span class="value title">{{ item.f_name }}</span>
                            <span class="value">{{ item.f_phone }}</span>
                            <span class="value right">{{ item.f_dept_id_s }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="sv_dialog_foot">
                    <div class="button">
                        <el-button type="default" class="eo_w100" @click="onButtonClick_Cancel">取消</el-button>
                    </div>
                    <div class="button">
                        <el-button type="primary" class="eo_w100" @click="onButtonClick_Ok">确定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">

    import { ref } from "vue"

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    import type { cfunc_boolean } from "@/inc/eotypes";

    const x_show_loading = ref(false);
    const x_data_list = ref<any[]>([]);
    const x_selected_id = ref(0);

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_show_dialog = ref(false);

    const show_dialog = async (data: any) => {
        x_data_list.value = [];
        x_show_dialog.value = true;
    }

    const loadData = async () => {
        x_show_loading.value = true;
        let ret = await eocore.post("/framework/user/query", [{
            "login_id": "",
            "name": "",
            "phone": "",
        }]);
        let list = eocore.check_net_array(ret);
        x_show_loading.value = false;
        if (list == undefined) list = [];

        x_data_list.value = list;
        x_selected_id.value = 0;
    }

    const onDialogOpened = async () => {
        await loadData();
    }

    const onDialogClose = () => {
    }

    const onItemClick = (item: any) => {
        x_selected_id.value = item.f_user_id;
    }

    const onButtonClick_Cancel = () => {
        emits("close", true, {}, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }

    const onButtonClick_Ok = () => {
        if (x_selected_id.value <= 0) {
            eocore.show_info("请选择用户");
            return;
        }

        const item = x_data_list.value.find(d => d.f_user_id == x_selected_id.value);
        if (!item) {
            eocore.show_info("未找到所选用户");
            return;
        }

        emits("close", false, item, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss" scoped>
</style>
