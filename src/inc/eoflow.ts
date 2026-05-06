import eocore from "./eocore";


/** 流程节点 */
export interface cflow_point {
    /** 节点id */
    flow_point_id: number, 
    /** 流程类型id */
    flow_type_id: number, 
    /** 节点名称 */
    name: string, 
    /** 节点角色 */
    role: string, 
    /** 节点用户 */
    user: string, 
    /** 节点顺序 */
    order: number, 
    /** 节点标题 */
    title: string, 
    /** 节点描述 */
    text: string,

    is_first: boolean,
    is_last: boolean,
}

/** 流程类型 */
export interface cflow_type {
    /** 流程类型id */
    flow_type_id: number, 
    /** 流程类型名称  */
    name: string, 
    /** 数据表  */
    table: string, 
    /** 数据字段  */
    field: string, 
    /** 描述  */
    text: string,
    /** 状态 */ 
    status: number,

    /** 流程节点列表 */
    points: Array<cflow_point>
}

export default {

    // 流程标记
    OP_FLAG_NORMAL: 0,
    OP_FLAG_GOBACK: 1,
    OP_FLAG_RETRACT: 2, // 收回

    flow_type_list: [] as cflow_type[],

    /**
     * 登录之后之后加载
     * @returns 
     */
    async net_load_flow_List(): Promise<cflow_type[]|undefined> {

        // 读取类型
        let ret = await eocore.post("/framework/flow/type/list", [{}]);
        let list = eocore.check_net_array(ret);
        if (list == undefined) {
            return undefined;
        }
        for (let d of list) {
            this.flow_type_list.push({
                flow_type_id: d["f_flow_type_id"],
                name: d["f_name"],
                table: d["f_table"],
                field: d["f_field"],
                text: d["f_text"],
                status: d["f_status"],
                points: []
            });
        }

        ret = await eocore.post("/framework/flow/point/list", [{
            v_flow_type_id: 0
        }]);
        list = eocore.check_net_array(ret);
        if (list == undefined) return undefined;

        let lastTypeId = 0;
        let typeId;
        let typeData = undefined;
        for (let d of list) {

            typeId = d["f_flow_type_id"]
            if (lastTypeId != typeId) {
                
                typeData = this.get_type_by_id(typeId);
                if (typeData != undefined) {
                    // 挂载节点列表
                    typeData.points = [];
                    lastTypeId = typeId;
                }
            }

            typeData?.points.push({
                flow_point_id: d["f_flow_point_id"],
                flow_type_id: d["f_flow_type_id"],
                name: d["f_name"],
                role: d["f_role"],
                user: d["f_user"],
                order: d["f_order"],
                title: d["f_title"],
                text: d["f_text"],
                is_first: false,
                is_last: false,
            });
        }

        for (let d of this.flow_type_list) {
            if (d.points.length > 0) {
                d.points[0].is_first = true;
                d.points[d.points.length - 1].is_last = true;
            }
        }

        console.log(this.flow_type_list);
        return this.flow_type_list;
    },
 
    
    /**
     * 根据id获取流程类型
     * @param {*} typeId 
     * @returns 
     */
    get_type_by_id(typeId: number): cflow_type|undefined {

        for (let d of this.flow_type_list) {
            if (d.flow_type_id == typeId) return d;
        }

        console.log("******** ********", "eoflow::get_type_by_id: undefined", typeId);
        return undefined;
    },
    get_type_by_name(typeName: string): cflow_type|undefined {

        for (let d of this.flow_type_list) {
            if (d.name == typeName) return d;
        }

        console.log("******** ********", "eoflow::get_type_by_name: undefined", typeName);
        return undefined;
    },

}