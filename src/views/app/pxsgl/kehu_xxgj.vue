<template>
    <!-- 沟通记录 -->
    <div class="eo_col">
        <div class="eo_col_f">
            <div class="eo_scroll_v">
                <div class="ap_list" ref="v_list_ref">
                    <div v-if="x_khgt_list.length == 0" class="empty">
                        暂无沟通记录
                    </div>
                    <div v-for="(item, index) in x_khgt_list" :key="index"
                        class="item" @click="onViewClick_khgt(index)">
                        <div class="body">
                            <div class="row">
                                <span class="label">时间</span>
                                <span class="value">{{ item.f_gtsj_s }}</span>
                                <span class="label">销售员</span>
                                <span class="value">{{ item.f_xsy_id_s }}</span>
                            </div>
                            <div class="row">
                                <span class="label">方式</span>
                                <span class="value">{{ item.f_gtfs }}</span>
                                <span class="label">地点</span>
                                <span class="value">{{ item.f_gtdz }}</span>
                            </div>
                            <div class="row">
                                <span class="label">内容</span>
                                <span class="div_gtnr">{{ item.f_gtnr_s }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="eo_col_d">
            <div class="eo_form">
                <div class="button">
                    <el-button class="ap_button" type="primary" :disabled="!x_edit_mode"
                        @click="onButtonClick_Add_khgt">新建沟通</el-button>
                </div>
            </div>
        </div>
        <!-- 沟通信息对话框 -->
        <vformd ref="v_formd_khgt" title="沟通信息" width="700px"
            :form-types="x_form_types_khgt" @close="onFormdClose_khgt"/>
    </div>
</template>

<script lang="ts" setup>
    import { ref, watch, nextTick } from "vue"
    import type { cfunc_boolean, cform_options } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    import vformd from "@/components/app/vformd.vue"

    import TGlobal from "@/logic/TGlobal";
    import TLogic from "@/logic/TLogic";

    const props = defineProps<{
        khglId: number
        editMode: boolean
    }>();

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_khgt = ref<t_formd>();
    const v_list_ref = ref<HTMLElement>();

    const x_khgt_list = ref<any[]>([]);
    const x_edit_mode = ref(false);
    let m_khgt_data: any = undefined;

    const x_form_types_khgt = ref<cform_options[]>([
        { type: "datetime", name: "f_gtsj", span: 100, label: "沟通时间" },
        { type: "number", name: "f_gtsc", span: 100, label: "沟通时长", precision: 0, min: 0 },
        { type: "input", name: "f_gtdz", span: 100, label: "沟通地点" },
        { type: "text2", name: "f_gtnr", span: 100, label: "沟通内容", row: 10 },
        { type: "dic", name: "f_gtfs", span: 100, label: "沟通方式", dic: "沟通方式", all: false, field: "label" },
        { type: "label", name: "f_xsy_id_s", span: 100, label: "销售员" },
    ]);

    const loadData = async () => {
        x_edit_mode.value = props.editMode;
        x_khgt_list.value = [];
        m_khgt_data = undefined;

        if (props.khglId <= 0) return;

        const ret = await eocore.proc("p_khgt_list", {
            "v_khgl_id": props.khglId
        });
        const list = eocore.check_net_array(ret);
        if (list == undefined) return;

        for (let d of list) {
            updateItemData(d);
        }

        x_khgt_list.value = list;

        nextTick(() => {
            if (v_list_ref.value) {
                v_list_ref.value.scrollTop = v_list_ref.value.scrollHeight;
            }
        });
    };

    watch(() => [props.khglId, props.editMode], () => {
        loadData();
    }, { immediate: true });

    const updateItemData = (data: any) => {
        data["f_gtsj_s"] = eolib.datetime_2_short(data["f_gtsj"]);
        data["f_gtnr_s"] = data["f_gtnr"];
        data["f_gtnr"] = eolib.decode_string(data["f_gtnr_s"]);
        TLogic.updateDicUserData(data, ["f_xsy_id"]);
    };

    const onViewClick_khgt = (index: number) => {
        if (!x_edit_mode.value) return;
        m_khgt_data = x_khgt_list.value[index];
        v_formd_khgt.value?.show_dialog(m_khgt_data);
    };

    const onButtonClick_Add_khgt = () => {
        const dt = new Date();
        if (props.khglId <= 0) {
            eocore.show_info('请先选择客户');
            return;
        }

        const khgtData = {
            "f_khgt_id": 0,
            "f_khgl_id": props.khglId,
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

    const onFormdClose_khgt = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true);
            return;
        }

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
        if (dataNew == undefined) {
            cb(false);
            return;
        }

        updateItemData(dataNew);
        x_khgt_list.value.splice(0, 0, dataNew);

        eocore.show_success('修改成功');
        cb(true);
    };
</script>

<style lang="scss" scoped>
    .div_gtnr {
        flex: 1 1 0%;
        font-size: 0.9rem;
        color: #666;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
    }
</style>
