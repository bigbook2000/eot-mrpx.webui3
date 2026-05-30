import { ref } from "vue"

import type { cfunc_boolean, cfunc_data } from "@/inc/eotypes";
import { type cflow_point } from "@/inc/eoflow";

import eocore from '@/inc/eocore';
import eolib from '@/inc/eolib';
import TGlobal from '@/logic/TGlobal'
import TLogic from '@/logic/TLogic'

import eoflow from "@/inc/eoflow";

export function useTflowButton(
    emit: any
) {

    let v_flow: any = undefined;

    // 按钮状态
    const x_flow_new = ref(false); // 新建
    const x_flow_edit = ref(false); // 编辑
    const x_flow_cancel = ref(false); // 作废
    const x_flow_back = ref(false); // 退回
    const x_flow_status = ref(false);
    const x_flow_status_text = ref("");

    let m_flow_point: cflow_point | undefined = undefined;

    const init_flow = (flow: any) => {
        v_flow = flow;

        x_flow_new.value = false;
        x_flow_edit.value = false;
        x_flow_cancel.value = false;
        x_flow_back.value = false;
        x_flow_status.value = false;

        const point = v_flow?.get_first_point();
        if (point != undefined) {
            x_flow_new.value = TLogic.checkRoleString(point.role);
        }
    }

    const get_point = () => {
        return m_flow_point;
    }
    const get_point_name = () => {
        return m_flow_point?.name || "";
    }

    const set_flow_back = (pointName: string) => {
        if (m_flow_point == undefined) return;
        if (v_flow == undefined) return;

        // 第一个节点不用退回
        if (m_flow_point.order == 1) return;
        x_flow_back.value = v_flow.check_point_order(m_flow_point.flow_point_id, pointName) || false;
        //console.log("set_flow_back", m_flow_point, pointName, x_flow_back.value);
    }
    const set_flow_edit = (pointName: string[]) => {
        if (m_flow_point == undefined) return;
        x_flow_edit.value = pointName.includes(m_flow_point.name);
        console.log("set_flow_edit", m_flow_point, pointName, x_flow_edit.value);
    }

    /**
     * 根据数据更新流程按钮状态
     * @param data 
     */
    const update_flow_status = (data: any): boolean => {

        let flowPointId = 0;
        if (data != undefined) {
            flowPointId = data["f_flow_point_id"];
        }

        // 需要作废权限
        //x_flow_cancel.value = ret.first;

        // 默认禁止编辑，回退
        x_flow_edit.value = false;
        x_flow_cancel.value = false;
        x_flow_back.value = false;
        x_flow_status.value = false;

        if (flowPointId <= 0) return false;

        m_flow_point = v_flow?.get_point_by_id(flowPointId);
        if (m_flow_point == undefined) return false;

        // 最后一个节点不处理
        if (m_flow_point.is_last) return false;

        // 要求用户一致
        if (m_flow_point.user != "") {
            if (data[m_flow_point.user] != TGlobal.userData["f_user_id"]) return false;
        }

        // 检查权限
        const role = TGlobal.userData["f_role"];
        const pointRole = m_flow_point.role;

        //console.log("update_flow_status", m_flow_point, role);
        x_flow_status.value = eolib.list_any_list(role, pointRole);
        x_flow_status_text.value = m_flow_point.title;

        if (!x_flow_status.value) return false;

        return true;
    };

    /**
     * 显示流程操作对话框
     * @param data0 订单数据
     */
    const show_flow_dialog = (data0: any, callback: cfunc_data) => {

        v_flow?.process_add_dialog(async (cancel: boolean, data: any, cb: cfunc_boolean) => {

            if (cancel) {
                cb(true); return;
            }

            data0["f_flow_point_id"] = data["f_flow_point_id"];
            data0["f_flow_point_id_s"] = data["f_flow_point_id_s"];

            //console.log("show_flow_dialog", data0, data);

            // 更新流程按钮
            // update_flow_status(data0);

            callback(data0);

            cb(true);
        });
    }

    const onButtonClick_Flow_Add = () => {
        const point = v_flow?.get_first_point();
        if (point == undefined) {
            eocore.show_info("无流程节点");
            return;
        }
        emit("on-new", point, {});
    }
    const onButtonClick_Flow_Upd = () => {
        if (m_flow_point == undefined) {
            eocore.show_info("请选择流程节点");
            return;
        }
        emit("on-edit", m_flow_point, {});
    }
    const onButtonClick_Flow_Get = () => {
        if (m_flow_point == undefined) {
            eocore.show_info("请选择流程节点");
            return;
        }
        emit("on-get", m_flow_point, {});
    }

    const onButtonClick_Flow_Cancel = () => {
        if (m_flow_point == undefined) {
            eocore.show_info("请选择流程节点");
            return;
        }
        emit("on-cancel", m_flow_point, {});
    }
    const onButtonClick_Flow_Back = () => {
        if (m_flow_point == undefined) {
            eocore.show_info("请选择流程节点");
            return;
        }
        emit("on-back", m_flow_point, {});
    }
    const onButtonClick_Flow = () => {
        if (m_flow_point == undefined) {
            eocore.show_info("请选择流程节点");
            return;
        }
        emit("on-flow", m_flow_point, {});
    }

    return {
        x_flow_new,
        x_flow_edit,
        x_flow_cancel,
        x_flow_back,
        x_flow_status,
        x_flow_status_text,

        init_flow,
        get_point,
        get_point_name,
        set_flow_back,
        set_flow_edit,
        update_flow_status,
        show_flow_dialog,

        onButtonClick_Flow_Add,
        onButtonClick_Flow_Upd,
        onButtonClick_Flow_Get,
        onButtonClick_Flow_Cancel,
        onButtonClick_Flow_Back,
        onButtonClick_Flow,
    }
}
