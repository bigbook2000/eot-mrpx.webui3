<template>
    <!-- 客户详情 - 路由页面 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="客户详情" />
            <div class="eo_col_f">
                <el-tabs v-model="x_active_tab" type="card" class="ap_tabs">
                    <el-tab-pane label="客户资料" name="info">
                        <kehu_xxxq
                            :data="x_kehu_data"
                            @confirm="onConfirm"
                            @cancel="onCancel" />
                    </el-tab-pane>
                    <el-tab-pane label="沟通记录" name="comm">
                        <kehu_xxgj
                            :khgl-id="x_khgl_id"
                            :edit-mode="x_edit_mode" />
                    </el-tab-pane>
                    <el-tab-pane label="成交记录" name="deal">
                        <kehu_xxcj
                            :khgl-id="x_khgl_id" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "app_xsgl_kehu_xx" }
</script>

<script lang="ts" setup>
    import { ref, reactive, onMounted } from "vue"

    import eocore from "@/inc/eocore"
    import region from "@/inc/region"

    import router from "@/router/index"
    import topbar from '@/views/vapp/comm/topbar.vue'

    import kehu_xxxq from "./kehu_xxxq.vue"
    import kehu_xxgj from "./kehu_xxgj.vue"
    import kehu_xxcj from "./kehu_xxcj.vue"

    import TGlobal from "@/logic/TGlobal"

    const x_active_tab = ref("info");
    const x_show_loading = ref(false);
    const x_khgl_id = ref(0);
    const x_edit_mode = ref(false);
    let x_kehu_data: any = reactive({});

    onMounted(() => {
        const state = history.state as any;
        if (state?.kehuData) {
            Object.assign(x_kehu_data, state.kehuData);
            x_khgl_id.value = eocore.to_int(x_kehu_data["f_khgl_id"]);
            x_edit_mode.value = x_kehu_data["f_xsy_id"] == TGlobal.userData["f_user_id"];
        }
    });

    const onBack = () => {
        router.back();
    };

    const onCancel = () => {
        router.back();
    };

    const onConfirm = async () => {
        if (!x_kehu_data["f_khmc"]) {
            eocore.show_info("请输入客户名称");
            return;
        }
        if (!eocore.check_len(x_kehu_data["f_lxr"])) {
            eocore.show_info("请输入联系人");
            return;
        }
        if (!eocore.check_len(x_kehu_data["f_lxfs"])) {
            eocore.show_info("请输入联系方式");
            return;
        }

        let ret = region.get_region_info(x_kehu_data["f_xzqh_s"]);
        x_kehu_data["f_xzsf"] = ret.province;
        x_kehu_data["f_xzds"] = ret.city;
        x_kehu_data["f_xzqx"] = ret.county;

        x_show_loading.value = true;
        const retProc = await eocore.proc("p_khgl_upd", {
            "v_khgl_id": x_kehu_data["f_khgl_id"],
            "v_xsy_id": x_kehu_data["f_xsy_id"],
            "v_khmc": x_kehu_data["f_khmc"],
            "v_jyzt": x_kehu_data["f_jyzt"],
            "v_qzyx": x_kehu_data["f_qzyx"],
            "v_khlb": x_kehu_data["f_khlb"],
            "v_hzdj": x_kehu_data["f_hzdj"],
            "v_khly": x_kehu_data["f_khly"],
            "v_gsgm": x_kehu_data["f_gsgm"],
            "v_jyfs": x_kehu_data["f_jyfs"],
            "v_sshy": x_kehu_data["f_sshy"],
            "v_fzr": x_kehu_data["f_fzr"],
            "v_gsdh": x_kehu_data["f_gsdh"],
            "v_lxr": x_kehu_data["f_lxr"],
            "v_lxfs": x_kehu_data["f_lxfs"],
            "v_xzsf": x_kehu_data["f_xzsf"],
            "v_xzds": x_kehu_data["f_xzds"],
            "v_xzqx": x_kehu_data["f_xzqx"],
            "v_gsdz": x_kehu_data["f_gsdz"],
            "v_gswz": x_kehu_data["f_gswz"],
            "v_jyfw": x_kehu_data["f_jyfw"],
            "v_zycp": x_kehu_data["f_zycp"],
            "v_jdsj": x_kehu_data["f_jdsj"],
            "v_gtsj": x_kehu_data["f_gtsj"],
            "v_cjsj": x_kehu_data["f_cjsj"],
            "v_cjje": x_kehu_data["f_cjje"],
            "v_ghbz": x_kehu_data["f_ghbz"],
            "v_beizhu": x_kehu_data["f_beizhu"]
        });
        const dataNew = eocore.check_net_object(retProc);
        x_show_loading.value = false;

        if (dataNew == undefined) return;

        eocore.show_success("保存成功");
        router.back();
    };

</script>