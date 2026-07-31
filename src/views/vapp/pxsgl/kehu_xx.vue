<template>
    <!-- 客户详情 - 路由页面 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <topbar title="客户详情" />
            <div class="eo_col_f">
                <el-tabs v-model="x_active_tab" type="card" class="ap_tabs">
                    <el-tab-pane label="客户资料" name="info">
                        <kehu_xxxq ref="v_kehu_xxxq" @update="onUpdateKehuXxxq" />
                    </el-tab-pane>
                    <el-tab-pane label="沟通记录" name="comm">
                        <kehu_xxgj ref="v_kehu_xxgj" />
                    </el-tab-pane>
                    <el-tab-pane label="成交记录" name="deal">
                        <kehu_xxcj ref="v_kehu_xxcj" />
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

    type t_kehu_xxxq = InstanceType<typeof kehu_xxxq>;
    type t_kehu_xxgj = InstanceType<typeof kehu_xxgj>;
    type t_kehu_xxcj = InstanceType<typeof kehu_xxcj>;

    const v_kehu_xxxq = ref<t_kehu_xxxq>();
    const v_kehu_xxgj = ref<t_kehu_xxgj>();
    const v_kehu_xxcj = ref<t_kehu_xxcj>();

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

            // 通过方法调用加载各子模块数据
            v_kehu_xxxq.value?.loadData({ ...x_kehu_data });
            v_kehu_xxgj.value?.loadData(x_khgl_id.value, x_edit_mode.value);
            v_kehu_xxcj.value?.loadData(x_khgl_id.value);
        }
    });

    /**
     * kehu_xxxq 更新事件
     * data 为 null 表示取消，否则为需要保存的数据
     */
    const onUpdateKehuXxxq = async (data: any | null) => {
        // 取消
        if (data == null) {
            router.back();
            return;
        }

        // 保存：校验
        if (!data["f_khmc"]) {
            eocore.show_info("请输入客户名称");
            return;
        }
        if (!eocore.check_len(data["f_lxr"])) {
            eocore.show_info("请输入联系人");
            return;
        }
        if (!eocore.check_len(data["f_lxfs"])) {
            eocore.show_info("请输入联系方式");
            return;
        }

        let ret = region.get_region_info(data["f_xzqh_s"]);
        data["f_xzsf"] = ret.province;
        data["f_xzds"] = ret.city;
        data["f_xzqx"] = ret.county;

        x_show_loading.value = true;
        const retProc = await eocore.proc("p_khgl_upd", {
            "v_khgl_id": data["f_khgl_id"],
            "v_xsy_id": data["f_xsy_id"],
            "v_khmc": data["f_khmc"],
            "v_jyzt": data["f_jyzt"],
            "v_qzyx": data["f_qzyx"],
            "v_khlb": data["f_khlb"],
            "v_hzdj": data["f_hzdj"],
            "v_khly": data["f_khly"],
            "v_gsgm": data["f_gsgm"],
            "v_jyfs": data["f_jyfs"],
            "v_sshy": data["f_sshy"],
            "v_fzr": data["f_fzr"],
            "v_gsdh": data["f_gsdh"],
            "v_lxr": data["f_lxr"],
            "v_lxfs": data["f_lxfs"],
            "v_xzsf": data["f_xzsf"],
            "v_xzds": data["f_xzds"],
            "v_xzqx": data["f_xzqx"],
            "v_gsdz": data["f_gsdz"],
            "v_gswz": data["f_gswz"],
            "v_jyfw": data["f_jyfw"],
            "v_zycp": data["f_zycp"],
            "v_jdsj": data["f_jdsj"],
            "v_gtsj": data["f_gtsj"],
            "v_cjsj": data["f_cjsj"],
            "v_cjje": data["f_cjje"],
            "v_ghbz": data["f_ghbz"],
            "v_beizhu": data["f_beizhu"]
        });
        const dataNew = eocore.check_net_object(retProc);
        x_show_loading.value = false;

        if (dataNew == undefined) return;

        // 同步更新本地数据
        Object.assign(x_kehu_data, dataNew);

        eocore.show_success("保存成功");
    };

</script>