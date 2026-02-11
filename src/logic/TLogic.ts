
import eocore from "@/inc/eocore";
import eolib from "@/inc/eolib";
import eodic from "@/inc/eodic";

import type {ctree_node, cfunc_boolean} from "@/inc/eotypes";    

import TGlobal from "@/logic/TGlobal"


/**
 * 应用公共模块
 */
export default {

	// 文件类型
	fileTypes: {
		"硬件_版本文件": "file_eotapp_bin",
		"系统_流程文件": "file_platform_flow",
		"应用_知识库": "file_logic_zsk",
	},
	
	codeTypes: {
		"采购入库": "CG",
		"采购退货": "CT",
		"生产加工": "SC",
		"销售退货": "XT",
		"盘库整理": "KZ",
		"销售订单": "XS",

		"库存明细": "KM",
		"库存拆分": "KF",
		"库存合并": "KH",
	} as Record<string, string>,
	codeTypeValues: {
	} as Record<string, string>,
	codeTypeArrays: [] as string[],

	flowTypes: {
		"采购入库": "采购入库",
		"销售订单": "销售订单",
	},

	flowPoints: {
		"采购入库": {
			"新建": "新建",
			"待审核": "待审核",
			"已审核": "已审核",
			"已核准": "已核准",
			"已发货": "已发货",
			"已入库": "已入库",
			"完成": "完成",
		},
		"销售订单": {
			"新建": "新建",
			"待审核": "待审核",
			"已审核": "已审核",
			"已核准": "已核准",
			"已生产": "已生产",
			"已发货": "已发货",
			"已收货": "已收货",
			"完成": "完成",
		},
	},

	/** 入库状态 */
	rkztList: {
		"正常": 0,
		"生产": 1,		
		"备件": 2,
		"样品": 3,
		"借用": 4,
		"演示": 5,
		"研发": 8,
		"损坏": 9,
	},

	/**
	 * 初始化
	 */
	init() {

		let codeDic: any[] = [];

		let i = 0;
		for (let key in this.codeTypes) {
		 	this.codeTypeValues[this.codeTypes[key]] = key;
			this.codeTypeArrays.push(this.codeTypes[key]);
			codeDic.push({
				value: i,
				label: key,
			});
			i++;
		}

		eodic.add_list("库存类别", codeDic, "value", "label");
	},
	

	/**
	 * 检查菜单权限
	 * @param {*} permit 
	 */
	checkPermit(permit: string): boolean {

		if (permit == "") return true;		
		return (TGlobal.permitString.indexOf("," + permit + ",") >= 0);
	},



	/**
	 * 逗号（,）分割的角色字符串
	 * @param {*} data 
	 */
    getRoleInfo(roleList: any[], role: string): any {

        let roleStr: string = "";
        let ss = role.split(',');

        let roleIds: number[] = [];

        if (ss == undefined) {
            return {
                "roleStr": "",
                "roleIds": roleIds,
            };
        } 
        
        for (let d1 of ss) {

            let rid = parseInt(d1);
            if (rid > 0) {

				let role = undefined;
				for (let d2 of roleList) {
					if (d2["f_role_id"] == rid) {
						role = d2;
					}
				}
                if (role != undefined) {
                    roleStr += role["f_name"] + ",";
                }
                roleIds.push(rid);
            }
        }
        //console.log(roleStr, roleIds)

        return {
            "roleStr": roleStr,
            "roleIds": roleIds,
        }
    },

	/**
	 * 获取用户id和name之间的关系
	 * @returns 
	 */
	async netLoad_UserDic(): Promise<any> {

		let ret = await eocore.post("/framework/user/dic", [{ }]);
		let list = eocore.check_net_array(ret);
		if (list == undefined) return [];

		let dic: any = {};
		for (let d of list) {
			dic["U" + d["f_user_id"]] = d["f_name"];
		}

		return dic;
	},
	/**
	 * 将列表数据中的用户id转换成name
	 * @param listData 
	 * @param userDic 
	 * @param fields 
	 */
	updateDicUserList(listData: any[], userDic: any, fields: string[]) {

		for (let d of listData) {
			for (let f of fields) {
				if (d[f] == undefined) {
					console.log("字段不存在：" + f);
					continue;
				}
				d[f + "_s"] = userDic["U" + d[f]];
				if (d[f + "_s"] == undefined) d[f + "_s"] = "";
			}
		}
	},
	updateDicUserData(data: any, userDic: any, fields: string[]) {

		for (let f of fields) {
			if (data[f] == undefined) {
				console.log("字段不存在：" + f);
				continue;
			}
			data[f + "_s"] = userDic["U" + data[f]];
			if (data[f + "_s"] == undefined) data[f + "_s"] = "";
		}
	},

	/**
	 * 获取一个序列ID
	 * @param table 
	 * @param idField 
	 * @param idValue 
	 * @returns 
	 */
	async netLoad_SeekID(table: string, idField: string, idValue: number): Promise<number> {

		let ret = await eocore.proc("p_seek_id", {
            "v_table": table,
            "v_id_field": idField,
            "v_id_value": idValue
        });
		let data = eocore.check_net_object(ret);
		if (data == undefined) return 0;

		return data["f_seek"];
	},

	async netLoad_RecordId(key: string): Promise<string> {

		let ret = await eocore.post("/project/common/record/id", [{
            "v_key": key
        }]);
		let data = eocore.check_net_object(ret);
		if (data == undefined) return "";

		return data["record_id"]
	},
	/**
	 * 获取特定格式的编号
	 * @param key 
	 * @param prefix 
	 * @returns 
	 */	
	async netLoad_RecordString(key: string, prefix: string, format:string, count:number): Promise<string> {

		let ret = await eocore.post("/project/common/record/string", [{
            "v_key": key,
			"v_prefix": prefix,
			"v_format": format,
			"v_count": count,
        }]);
		let data = eocore.check_net_object(ret);
		if (data == undefined) return "";

		return data["record_string"]
	},
	
	/**
	 * 库存编码
	 * @param cpdyId 
	 * @param cpbm 
	 * @returns 
	 */
	async netLoad_RecordString_kcbh(cpdyId: number, cpbm: string): Promise<string> { 

		let kcbh = "";
		const kcbhId = await this.netLoad_SeekID("tcpdy", "f_cpdy_id", cpdyId);
		kcbh = "000000" + kcbhId.toString();
		kcbh = kcbh.substring(kcbh.length - 6);
		kcbh = cpbm + kcbh;

		return kcbh;
	},
	/**
	 * 处理产品类别
	 * @returns 树结构
	 */
	async netload_Tree_cplb(all: boolean): Promise<any[]> {
            
        let ret = await eocore.proc("p_cpdl_list", { });        
        let listCpdl = eocore.check_net_array(ret);
        if (listCpdl == undefined) return [];

        ret = await eocore.proc("p_cpxl_list", {
            "v_cpdl_id": -1
        });
        let list = eocore.check_net_array(ret);
        if (list == undefined) return listCpdl;

		if (all) {
			listCpdl.unshift({
				"f_cpdl_id": 0,
				"f_dlmc": "-",
				"f_dlbm": "",
				"value": 0,
				"label": "-",
				"level": 1,
				"children": [{
					"f_cpdl_id": 0,
					"f_cpxl_id": 0,
					"f_xlmc": "-",
					"f_xlbm": "",
					"value": 0,
					"label": "-",
					"level": 2
				}]
			});
		}

		let cpdlData: any = undefined;
        let pid = -1;
        for (let d1 of list) {

            if (pid != d1["f_cpdl_id"]) {
				// 查找父节点
                for (let d2 of listCpdl) {
                    if (d1["f_cpdl_id"] == d2["f_cpdl_id"]) {

						// 用于树状处理
						d2["value"] = d2["f_cpdl_id"];
						d2["label"] = d2["f_dlmc"];
						d2["level"] = 1;

						pid = d2["f_cpdl_id"];
                        cpdlData = d2;

						if (all) {
                        	cpdlData.children = [{
								"f_cpdl_id": pid,
								"f_cpxl_id": 0,
								"f_xlmc": "-",
								"f_xlbm": "",
								"value": 0,
								"label": "-",
								"level": 2
							}];
						} else {
							cpdlData.children = [];
						}
                        break;
                    }
                }
            }
			
            if (cpdlData != undefined) {

				d1["value"] = d1["f_cpxl_id"];
				d1["label"] = d1["f_xlmc"];
				d1["level"] = 2;

                cpdlData.children.push(d1);
            }
        }

		console.log(listCpdl);
        return listCpdl;
    },

	/**
	 * 处理设备数据
	 * data["f_data"] 为json字符串
	 * fd["f_data"]和fd["f_chart"] 分别为表格和图表系数转换
	 * @param data 
	 */
	formatDeviceData(fieldList: any[], data: any) {

		data.dataList = {};
		data.chartList = {};

		try {

			let ds = data["f_data"];
			if (ds == undefined) return;

			// f_data为json字符串
			if (typeof(ds) != "string") return;
				
			let dlist = JSON.parse(ds);				
			//console.log(dlist);

			for (let fd of fieldList) {
				let dn = fd["f_dname"];
				let dp = fd["f_precision"];
				let sdd = fd["f_data"];
				let sdc = fd["f_chart"];

				let d = dlist[dn];
				if (d != undefined) {

					let dv1 = parseFloat(d.toString());
					let dv2 = dv1;

					if (sdd.length > 0) {
						sdd = sdd.replace(/\X/g, dv1);
						dv1 = eval(sdd);
					}
					if (sdc.length > 0) {
						sdc = sdc.replace(/\X/g, dv2);
						dv2 = eval(sdc);
					}

					data.dataList[dn] = dv1.toFixed(dp);
					data.chartList[dn] = dv2.toFixed(dp);
				}					
			}

			//console.log(data);
			
		} catch (ex) {
			console.log(ex);
		}
	},

	/**
	 * 服务器文件路径
	 * @param fileSign 
	 * @param fileExt 
	 */
	getStaticFileUrl(fileSign: string, fileExt: string): string {

		let fs = "/" + fileSign.substring(0, 1) + "/" + fileSign + fileExt;
        return eocore.base_url + "/" + TGlobal.fileStatic + fs;
	},

	getXSaveDataUrl(fileId: number): string {
        return eocore.base_url + "/framework/hdata/xsave/get?sign=" + 
			eocore.get_sign() + "&id=" + fileId;
	},	

	async getVersionFiles(typeId: number): Promise<any[]> {

        let ret;
        let list1, list2;

        ret = await eocore.proc("np_dversion_list", {
            v_dtype_id: typeId
        });
        list1 = eocore.check_net_array(ret);
        if (list1 == undefined) {
            return [];
        }

        let keyids = "";
        for (let d1 of list1) {
            keyids += "," + d1["f_dversion_id"];
        }
        if (keyids.length > 0) keyids = keyids.substring(1);

        ret = await eocore.post("/common/file/list", [{
            "f_type": this.fileTypes["硬件_版本文件"],
            "f_keyids": keyids
        }]);
        list2 = eocore.check_net_array(ret);

        if (list2 != undefined) {
            for (let d1 of list1) {				
                for (let d2 of list2) {
                    if (d1["f_dversion_id"] == d2["f_keyid"]) {
						d2["f_note_s"] = d2["f_note"];
						d2["f_note"] = d1["f_note"];
                        Object.assign(d1, d1, d2);
                    }
                }
            }
        }

		return list1;
	},

	/**
	 * 获取指定版本id列表对应的名称
	 * @param list 包含dversion_id的对象的数组
	 * @returns 
	 */
	async getVersionNames(list: any[]): Promise<void> {

		let ids = "";
		for (let d1 of list) {

			d1["f_dtype"] = "";
			d1["f_dversion"] = "";

			if (d1["f_dversion_id"] > 0) ids += d1["f_dversion_id"] + ",";
		}

		if (ids.length <= 0) return;

		ids = ids.substring(0, ids.length - 1);
		// 获取版本信息
		let ret = await eocore.proc("np_dversion_list", {        
			"v_dversion_ids" : ids 
		});
		let listVersion = eocore.check_net_array(ret);
		if (listVersion != null) {

			for (let d1 of list) {
				for (let d2 of listVersion) {

					//console.log(d1, d2);
					if (d1["f_dversion_id"] == d2["f_dversion_id"]) {
						d1["f_dtype"] = d2["f_dtype"];
						d1["f_dversion"] = d2["f_dversion"];
						break;
					}
				}
			}
		}
	},

	/**
	 * 处理配置数据，转换成json
	 * @param data 
	 */
	configDataEncode(data: string): string {
		data = data.replace(/[\r\n]/g, "");

		let key, val;
		let obj: any = {};
		let ss = data.split(";");
		for (let s of ss) {

			let ts = s.split("=");
			if (ts.length >= 2) {

				key = ts[0].trim();
				val = ts[1].trim();
				obj[key] = val;
			}
		}
		return JSON.stringify(obj);
	},
	/**
	 * JSON转换成212格式
	 * @param data 
	 * @returns 
	 */
	configDataDecode(data: string): string {

		let str = "";
		try {
		
			let obj: any = JSON.parse(data);
			for (let key in obj) {
				str += key + "=" + obj[key] + ";\r\n";
			}
		} catch (ex) {
			console.log(ex);
		}
		
		return str;
	},

	/**
	 * 
	 * @param d 由于开关值统一为浮点数，避免浮点数问题+0.1
	 * @returns 
	 */
	getDeviceSwitchString(d: any): string {

		let dv = parseInt(d);
		let ss = ["关",  "开"];
		return ss[dv % ss.length];
	},

	/**
	 * 加载因子类别
	 * @param nodeList 
	 * @param data 
	 * @returns 
	 */
    loadTree_yzlb(nodeList: ctree_node[], data: any) {

        if (eocore.check_empty(data.children)) return;

        for (let d of data.children) {
            let nodeNew: ctree_node = {
                id: d["id"],
                label: d["name"],
                data: d,
                children: []
            }
            nodeList.push(nodeNew);
            this.loadTree_yzlb(nodeNew.children, d);
        }
    },

	/**
	 * 设置字段可编辑
	 * @param editFields 字段开关
	 * @param fieldArray 字段数组
	 * @returns 
	 */
	checkEditFields(editFields: any, fieldArray: string[]): any {
		
		if (fieldArray == undefined) return editFields;

		if (fieldArray.length > 0 && fieldArray[0] == "*") {
			for (let f in editFields) {
				editFields[f] = true;
			}
		} else {
			for (let f in editFields) {
				editFields[f] = false;
			}
			for (let s of fieldArray) {
				editFields[s] = true;
			}
		}

		//console.log(editFields);
		return editFields;
	},

	/**
	 * 入库
	 * @param kgyId 库管员
	 * @param rklb 入库类别
	 * @param data 
	 * @returns 
	 */
	async netLoad_kcmxrk_upd(kgyId: number, rklb: string, data: any): Promise<any> {

		const kcbh = await this.netLoad_RecordString_kcbh(data["f_cpdy_id"], data["f_cpbm"]);

		// 先创建入库明细
        let ret = await eocore.proc(
			"p_kcmxrk_upd", {
				"v_kcmxrk_id": 0,
				"v_kcbh": kcbh,
				"v_kcbz": 1, // 0表示未进入库存，1表示已经进入库存
				"v_cpdy_id": data["f_cpdy_id"],
				"v_rklb": rklb,
				"v_rkd_id": 0, // 直接盘库新增
				"v_rkcp_id": 0,
				"v_kgy_id": kgyId,
				"v_cpsl": data["f_cpsl"],
				"v_cpdj": data["f_cpdj"],
				"v_cpzj": data["f_cpzj"],
				"v_hwck": data["f_hwck"],
				"v_beizhu": data["f_beizhu"]
		});

		const rkmxData = eocore.check_net_object(ret);
		if (rkmxData == undefined) return undefined;

		// 再创建库存明细
		ret = await eocore.proc(
			"p_kcmx_upd", {
				"v_kcbh": kcbh,
				"v_kcmxrk_id": rkmxData["f_kcmxrk_id"],
				"v_cpdy_id": data["f_cpdy_id"],
				"v_jyzt": 0,
				"v_hwck": data["f_hwck"],
				"v_cpdj": data["f_cpdj"],
				"v_cpsl": data["f_cpsl"],
				"v_yxbz": 1,
				"v_kgy_id": kgyId,
				"v_beizhu": data["f_beizhu"]
		});
		return eocore.check_net_object(ret);
	},
	
}