<template>
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Add">添加</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="default" class="eo_w80p" @click="onButtonClick_Del">删除</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Upd">修改</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load">刷新</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="eo_col_f">
                <vtable ref="v_table_menu" 
                    name="菜单"
                    id-field="f_menu_id" 
                    @item="onTableItem_menu"
                    @loading="onTableLoading_menu">
                    <el-table-column prop="f_status" label="状态" width="80" />
                    <el-table-column prop="f_name" label="名称" width="160" />
                    <el-table-column prop="f_menu_pid_s" label="上级" width="160" />
                    <el-table-column prop="f_level" label="层级" width="80" />
                    <el-table-column prop="f_order" label="顺序" width="80" />
                    <el-table-column prop="f_role_s" label="角色" width="300" />
                    <el-table-column prop="f_type" label="类型" width="100" />
                    <el-table-column prop="f_path" label="路径" width="180" />
                    <el-table-column prop="f_icon" label="图标" width="160" />                    
                    <el-table-column />
                </vtable>
            </div>
        </div>
        <menu_info ref="v_menu_info" @close="onDialogClose_menuinfo"/>
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

    import TGlobal from "@/logic/TGlobal"
    import TLogic from "@/logic/TLogic"

    import type { cform_options, cdic_item, cfunc_boolean } from "@/inc/eotypes";
    import vtable from "@/components/web/vtable.vue"
    import vformd from "@/components/web/vformd.vue"
    
    import menu_info from "@/views/platform/menu_info.vue"

    const v_menu_info = ref<InstanceType<typeof menu_info>>();

    type t_table = InstanceType<typeof vtable>;
    const v_table_menu = ref<t_table>();
    
    var x_show_loading = ref(false);

    let m_role_list: any[];

    onMounted(async () => {
        
        let ret: any = await eocore.post("/framework/role/list", [{}]);
        let list = eocore.check_net_array(ret);
        if (list != undefined) m_role_list = list;

        v_table_menu.value!.load_list_net("/framework/menu/query", {
            "v_status": -1
        });
    });

    const updateMenuPidList = (): cdic_item[] => {        
        let list = v_table_menu.value!.get_list();
        let dicList = eodic.list_2_dic(list, "f_menu_id", "f_name");

        // 添加一个默认的顶级菜单，编号1
        // 下拉选择项使用 value-label字段
        dicList.unshift({
            value: 1,
            label: "-",
            level: 0
        });
        return dicList;
    }

    const onTableLoading_menu = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableItem_menu = (data: any) => {
        let rd = TLogic.getRoleInfo(m_role_list, data["f_role"]);
        data["f_role_s"] = rd["roleStr"];
        data["f_role_d"] = rd["roleIds"];
    }

    const onButtonClick_Load = () => {
        v_table_menu.value!.load_list_net("/framework/menu/query", {
            "v_status": -1
        });
    }

    const onButtonClick_Add = () => {

        v_menu_info.value?.show_dialog({
            "f_menu_id": 0,
            "f_menu_pid": 1,
            "f_name": "",            
            "f_level": 0,
            "f_order": 1,
            "f_type": "menu",
            "f_path": "",
            "f_role": "",
            "f_icon": "",
            "f_status": 1
        });
        v_menu_info.value?.update_list("f_menu_pid", updateMenuPidList());
    }

    const onButtonClick_Upd = () => {
        
        let data = v_table_menu.value!.get_select_data();
        //console.log(data);

        v_menu_info.value?.show_dialog(data);
        v_menu_info.value?.update_list("f_menu_pid", updateMenuPidList());
    }

    const onButtonClick_Del = () => {
        v_table_menu.value!.remove_data_net_select("/framework/menu/del", (data) => {
            return {
                "f_menu_id": data["f_menu_id"]
            }
        });
    }

    const onDialogClose_menuinfo = async (cancel: boolean, data: any, cb: cfunc_boolean): Promise<void> => {

        if (cancel) {
            cb(true); return;
        }

        if (!eocore.check_len(data["f_name"])) {
            eocore.show_error("名称不能输入为空");
            cb(false); return;
        }

        // 菜单分为2级
        if (data["f_menu_pid"] == 1)
            data["f_level"] = 1;
        else
            data["f_level"] = 2;

        await v_table_menu.value!.update_data_net(
            "/framework/menu/upd", data, -1, data["f_menu_id"]<=0, true);
        //console.log(cancel, data, data.f_menu_id);
        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>