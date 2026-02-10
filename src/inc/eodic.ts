import eocore from "./eocore"
import eolib from "./eolib"

import type { cdic_item } from "@/inc/eotypes";

/**
 * 字典全局性模块
 */
class eodic {

    version: number = 0;

    /** 字典map表 */
    dic_map: Map<string, cdic_item[]> = new Map<string, cdic_item[]>();


    /**
     * 将列表转换成字典
     * @param list 
     */
    list_2_dic(list: any[], valueField: string, labelField: string, showAll?: boolean) {

        let dics: cdic_item[] = [];

        if (showAll) {
            dics.push({
                value: -1,
                label: "-",
                level: 0
            })
        }
        for (let d of list) {
            dics.push({
                value: d[valueField],
                label: d[labelField],
                level: 0
            })
        }

        return dics;
    }

    /**
     * 手动增加一个字典
     * @param dicName 字典名称
     * @param list 字典列表
     * @param valueField 键值字段名
     * @param labelField 显示字段名
     */
    add_list(dicName: string, 
        list: Array<any>, 
        valueField: string, labelField: string) {

        let dicList = this.list_2_dic(list, valueField, labelField);
        this.dic_map.set(dicName, dicList);

        //console.log("******** ********", "add_list", dicName, dicList, this.dic_map);
    }

	/**
     * 克隆一个新的的字典列表，带空值 -1 的字典列表
     * @param list cdic_item[]
     * @returns cdic_item[]
     */
    clone_list_all(list: cdic_item[]): cdic_item[] {

		let listNew: cdic_item[] = [];
		listNew.push({
            value: -1,
            label: "-",
            level: 0
        });
        
        for (let d of list) {
            listNew.push({
                value: d.value,
                label: d.label,
                level: d.level
			});
        }

		return listNew;
	}

	/**
     * 克隆一个新的的字典列表
     * @param list cdic_item[]
     * @returns cdic_item[]
     */
    clone_list(list: cdic_item[]): cdic_item[] {

		let listNew: cdic_item[] = [];
        for (let d of list) {
            listNew.push({
                value: d.value,
                label: d.label,
                level: d.level
			});
        }

		return listNew;
	}

    /**
     * 复制字典列表
     * @param dicName 
     * @param all 
     * @returns 
     */
    get_dic_list(dicName: string, all?: boolean): cdic_item[] {

        let dicList = this.dic_map.get(dicName);
        if (dicList == undefined) {
            console.log("******** ********", "dic not found", dicName);
            return [];
        }
        let listNew: cdic_item[] = [];

        if (all) {
            listNew.push({
                value: -1,
                label: "-",
                level: 0
            });
        }

        for (let d of dicList) {
            listNew.push({
				value: d.value,
				label: d.label,
                level: d.level
			});
        }
		return listNew;
    }


	/**
     * 返回字典名称
     * @param dicName 
     * @param value 
     * @returns 
     */
    get_dic_label(dicName: string, value: any): string {

		let dicList = this.dic_map.get(dicName);
        if (dicList != undefined && dicList.length != undefined && dicList.length > 0) {
            for (let d of dicList) {
                if (d.value == value) return d.label;
            }
        }

        console.log("******** ********", "get_dic_label: not found", dicName, value, this.dic_map);
		return '';
	}
    get_dic_list_label(dicList: cdic_item[], value: any): string {

        if (dicList != undefined && dicList.length != undefined && dicList.length > 0) {
            for (let d of dicList) {
                if (d.value == value) return d.label;
            }
        }

        console.log("******** ********", "get_dic_list_label: not found", value, dicList);
		return '';
	}

    /**
     * 返回字典值
     * @param dicName 
     * @param label 
     * @returns 
     */
    get_dic_value(dicName: string, label: string): number {

        let dicList = this.dic_map.get(dicName);
        if (dicList != undefined && dicList.length != undefined && dicList.length > 0) {
            for (let d of dicList) {
                if (d.label == label) return d.value;
            }
        }

        console.log("******** ********", "get_dic_item: not found", dicName, label, this.dic_map);
        return -1;
    }
    get_dic_list_value(dicList: cdic_item[], label: string): number {

        if (dicList != undefined && dicList.length != undefined && dicList.length > 0) {
            for (let d of dicList) {
                if (d.label == label) return d.value;
            }
        }

        console.log("******** ********", "get_dic_item: not found", label, dicList);
        return -1;
    }

    /**
     * 获取第一个字典
     * @param dicName 
     * @returns 
     */
    get_first(dicName: string): cdic_item {

        let dicList = this.dic_map.get(dicName);
        if (dicList != undefined && dicList.length != undefined && dicList.length > 0) {
            return dicList[0];
        }

        console.log("******** ********", "get_first: is empty", dicName, this.dic_map);
        return {
            level: 0,
            label: "",
            value: -1
        };
    }

    
    /**
     * 获取字典默认第一个项
     * @param dicName 
     * @param label 
     * @returns 
     */
    get_dic_item(dicName: string, label: string): cdic_item {

        let dicList = this.dic_map.get(dicName);
        if (dicList != undefined && dicList.length != undefined && dicList.length > 0) {
            for (let d of dicList) {
                if (d.label == label) return d;
            }
        }

        console.log("******** ********", "get_dic_item: not found", dicName, label, this.dic_map);
        return {
            level: 0,   
            label: "",
            value: -1
        };
    }

    /**
     * 读取字典
     */
    async net_load_dic(dicVersion: any) {

        try {

            this.version = eocore.to_int(dicVersion);
            let ret = await eocore.json("/dic/dic" + this.version + ".json");
            
            let list: any[] = ret["data"];
            let tree: any[] = [];

            // 列表转换成树状结构
            eolib.order_2_tree(list, tree, "f_dic_id", "f_dic_pid");

            // 将树变成map表
            // this.dic_map.clear();
            for (let node of tree) {

                let childList: cdic_item[] = [];
                for (let child of node.children) {
                    childList.push({
                        level: 0,
                        label: child["f_label"],

                        // 转换类型
                        value: parseInt(child["f_value"]),
                    })
                }
                this.dic_map.set(node["f_label"], childList);
            };

            console.log(this.dic_map);
            
        } catch (ex: any) {
            console.log(ex);
        }
    }
}

export default new eodic();