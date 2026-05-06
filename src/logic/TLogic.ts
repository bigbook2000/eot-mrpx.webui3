
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

		"业务_供应商资料": "file_logic_gys_wdzl",
	},
	
	codeTypes: [
		"采购入库",
		"采购退货",
		"销售出库",
		"销售退货",		

		"生产入库",
		"生产出库",

		"整理入库",
		"整理出库",
		
		"库存拆分",
		"库存合并",
	],

	flowTypes: {
		"采购入库": "采购入库",
		"销售出库": "销售出库",
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
		"销售出库": {
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

	/** 库存状态 */
	kcbzCodes: {
		"临时": 0,
		"正常": 1,
		"历史": -1
	},

	/** 公海状态 */
	ghbzCodes: {
		"公海": 0,
		"私有": 1
	},

	/** 用户字典 */
	userDic: {} as any,	
	/** 物流公司字典 */
	wlgsList: [] as any[],

	/**
	 * 初始化
	 */
	async init() {

		let codeDic: any[] = [];

		let i = 0;
		for (let d of this.codeTypes) {
			codeDic.push({
				value: i,
				label: d,
			});
			i++;
		}

		eodic.add_list("库存类别", codeDic, "value", "label");
	},
	

	/**
	 * 检查权限
	 * @param {*} permit 
	 */
	checkPermit(permit: string): boolean {

		if (permit == "") return true;		
		return (TGlobal.permitString.indexOf("," + permit + ",") >= 0);
	},

	/**
	 * 检查角色
	 * @param roleList 
	 * @returns 
	 */
	checkRoleList(roleList: any[]): boolean {

		//console.log("checkRoleList", roleList, TGlobal.userData["role_list"]);
		if (roleList.length == 0) {
			return true;
		}

		let list = TGlobal.userData["role_list"];
		for (let d1 of roleList) {			
			for (let d2 of list) {
				if (d1 == d2) {
					return true;
				}
			}
		}

		return false;
	},
	checkRoleString(roleStr: string): boolean {
		let list = roleStr.split(",");
		return this.checkRoleList(list);
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
	 * 加载菜单列表
	 */
	async netLoad_menu_list(): Promise<void> {

		let ret = await eocore.post("/framework/menu/list", [{
		}]);

		let array = eocore.check_net_array(ret);
		if (array == undefined) array = new Array();

		for (let d of array) {
			// 兼容
			d.path = d["f_path"];
			d.role_list = d["f_role"].split(",").filter((item: any) => item != "");
			TGlobal.menuMap[d.path] = d;
		}
			
		TGlobal.menuList = array;
	},   	

	/**
	 * 获取用户id和name之间的关系
	 * @returns 
	 */
	async netLoad_UserDic(): Promise<any> {

		let ret = await eocore.post("/framework/user/dic", [{ }]);
		let list = eocore.check_net_array(ret);
		if (list == undefined) return {};

		let dic: any = {};
		for (let d of list) {
			dic["U" + d["f_user_id"]] = d["f_name"];
		}
		this.userDic = dic;

		return dic;
	},
	/**
	 * 将列表数据中的用户id转换成name
	 * @param listData 
	 * @param fields 
	 */
	updateDicUserList(listData: any[], fields: string[]) {

		for (let d of listData) {
			for (let f of fields) {
				if (d[f] == undefined) {
					console.log("字段不存在：" + f);
					continue;
				}
				d[f + "_s"] = this.userDic["U" + d[f]];
				if (d[f + "_s"] == undefined) d[f + "_s"] = "";
			}
		}
	},
	updateDicUserData(data: any, fields: string[]) {

		for (let f of fields) {
			if (data[f] == undefined) {
				console.log("字段不存在：" + f);
				continue;
			}
			data[f + "_s"] = this.userDic["U" + data[f]];
			if (data[f + "_s"] == undefined) data[f + "_s"] = "";
		}
	},

	async netLoad_Wlgs_list(): Promise<any[]> {
		let ret = await eocore.proc("p_wlgs_list", {
            "v_wlgs_ids": ""
        })
        let list = eocore.check_net_array(ret);
        if (list != undefined) {
            this.wlgsList = list;
        }
		return this.wlgsList;
	},

	getLabel_wlgs(wlgsId: number): string {
		for (let d of this.wlgsList) {
			if (d["f_wlgs_id"] == wlgsId) {
				return d["f_gsmc"];
			}
		}
		return "";
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
	 * 安全计算数学表达式
	 * 支持的运算符: +, -, *, /, (), 以及 Math 对象的方法
	 * @param expression 数学表达式，X 会被替换为实际值
	 * @param value X 的值
	 * @returns 计算结果
	 */
	safeEvalExpression(expression: string, value: number): number {
		try {
			// 替换 X 为实际值
			let expr = expression.replace(/\X/g, value.toString());
			
			// 只允许安全的数学字符
			// 允许: 数字, 小数点, 运算符, 括号, 空格, Math对象方法
			if (!/^[0-9+\-*/().\s]+$/.test(expr) && !expr.includes('Math')) {
				console.warn('包含不安全字符的表达式:', expression);
				return value;
			}
			
			// 使用 Function 构造器替代 eval，更安全
			// 只暴露 Math 对象
			const calcFunc = new Function('Math', 'return ' + expr);
			const result = calcFunc(Math);
			
			if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
				console.warn('表达式计算结果无效:', expression, '结果:', result);
				return value;
			}
			
			return result;
		} catch (error) {
			console.warn('表达式计算失败:', expression, error);
			return value;
		}
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
						dv1 = this.safeEvalExpression(sdd, dv1);
					}
					if (sdc.length > 0) {
						dv2 = this.safeEvalExpression(sdc, dv2);
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

        ret = await eocore.post("/framework/hdata/file/list", [{
            "v_type": this.fileTypes["硬件_版本文件"],
            "v_keyids": keyids,
            "v_index": -1
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
	 * 更新库存
	 * @param f_kcmx_id 
	 * @param f_kcmx_pid 关联库存明细
	 * @param f_cpdy_id （新增）
	 * @param f_kcbh 批号（新增）
	 * @param f_rklb （新增）
	 * @param f_rkid （新增）
	 * @param f_hwck 仓库
	 * @param f_kcdj 单价
	 * @param f_kcsl 数量
	 * @param f_kgy_id 库管员
	 * @param f_beizhu 备注
	 * @param f_kcbz 库存标识
	 * @returns 
	 */
	async netLoad_kcmx_upd(
		f_kcmx_id: number,
		f_kcmx_pid: number,
		f_cpdy_id: number,
		f_kcbh: string,
		f_rklb: string,
		f_rkid: number,
		f_hwck: number,
		f_kcdj: number,
		f_kcsl: number,
		f_kgy_id: number,
		f_beizhu: string,
		f_kcbz: number
	): Promise<any|undefined> {

		const ret = await eocore.proc(    
			"p_kcmx_upd", {
				"v_kcmx_id": f_kcmx_id,
				"v_kcmx_pid": f_kcmx_pid,
				"v_cpdy_id": f_cpdy_id,
				"v_kcbh": f_kcbh,
				"v_rklb": f_rklb,
				"v_rkid": f_rkid,
				"v_hwck": f_hwck,
				"v_kcdj": f_kcdj,
				"v_kcsl": f_kcsl,
				"v_kgy_id": f_kgy_id,
				"v_beizhu": f_beizhu,
				"v_kcbz": f_kcbz
		});
        return eocore.check_net_object(ret);
	},

	/**
	 * 出库
	 * @param f_kcmx_id 
	 * @param f_kcmx_pid 关联库存明细
	 * @param f_cpdy_id 
	 * @param f_cklb 
	 * @param f_ckid 
	 * @param f_kgy_id 库管员
	 * @returns 
	 */
	async netLoad_kcmx_ck2(
		f_kcmx_id: number,
		f_kcmx_pid: number,
		f_cpdy_id: number,
		f_cklb: string,
		f_ckid: number,
		f_kgy_id: number
	): Promise<any|undefined> {

		const ret = await eocore.proc(    
			"p_kcmx_ck", {
				"v_kcmx_id": f_kcmx_id,
				"v_kcmx_pid": f_kcmx_pid,								
				"v_cpdy_id": f_cpdy_id,
				"v_cklb": f_cklb,
				"v_ckid": f_ckid,
				"v_kgy_id": f_kgy_id
		});		
        return eocore.check_net_object(ret);
	},	

	/**
	 * 拆分库存明细
	 * @param kgyId 
	 * @param data 
	 * @param kcsl2 拆分出的数量
	 */
	async netLoad_kcmx_cf(kgyId: number, data: any, kcsl2: number): Promise<any|undefined> {

		const kcsl = data["f_kcsl"];
		const kcsl1 = kcsl - kcsl2;

		const kcmxId = data["f_kcmx_id"];

		// 修改原有的
        let dataNew1 = await this.netLoad_kcmx_upd(
			kcmxId,
			kcmxId,
			data["f_cpdy_id"],
			data["f_kcbh"],
			"库存拆分", // 忽略
			0, // 忽略
			data["f_hwck"],
			data["f_kcdj"],
			kcsl1,
			kgyId,
			data["f_beizhu"],
			data["f_kcbz"]
		);
        if (dataNew1 == undefined) return undefined;

		// 增加新的
		let kcbh2 = await this.netLoad_RecordString_kcbh(data["f_cpdy_id"], data["f_cpbm"]);
        let dataNew2 = await this.netLoad_kcmx_upd(
			0,
			kcmxId, // 关联
			data["f_cpdy_id"],
			kcbh2,
			"库存拆分",
			0,
			data["f_hwck"],
			data["f_kcdj"],
			kcsl2,
			kgyId,
			data["f_beizhu"],
			this.kcbzCodes["正常"]
		);
        if (dataNew2 == undefined) return undefined;

		return { 
			data: data,
			dataNew1: dataNew1, 
			dataNew2: dataNew2 
		};
	},

	/**
	 * 库存合并，合并之后原有关联关系会断开
	 * @param kgyId 
	 * @param list 
	 * @returns 
	 */
	async netLoad_kcmx_hb(kgyId: number, list: any[]): Promise<any|undefined> {

		const data0 = list[0];

		let kczj = 0.0;
        let kcsl = 0;

        // 合并库存，需要产品定义一致
        let cpdyId = data0["f_cpdy_id"];
        for (let d of list) {

            kczj += d["f_kcdj"] * d["f_kcsl"];
            kcsl += d["f_kcsl"];

            if (cpdyId != d["f_cpdy_id"]) {
                eocore.show_info("请选择产品定义一致的库存进行合并");
                return undefined;
            }
        }

        if (kcsl <= 0) {
            eocore.show_info("库存数量必须大于零");
            return undefined;
        }

		let dataNew: any;
        let i;
		const kcmxId = data0["f_kcmx_id"];

		// 修改第一个
        const dataAdd = await this.netLoad_kcmx_upd(
            kcmxId,
            kcmxId, // 关联
            data0["f_cpdy_id"],
            data0["f_kcbh"],
            "库存合并",
            0,
            data0["f_hwck"],
            kczj / kcsl,
            kcsl,
            kgyId,
            data0["f_beizhu"],
            data0["f_kcbz"]
        );
		if (dataAdd == undefined) return undefined;

		// 其他的都出库
        for (i=1; i<list.length; i++) {
            const d = list[i];
            dataNew = await this.netLoad_kcmx_upd(
				d["f_kcmx_id"],
				kcmxId, // 关联
				d["f_cpdy_id"],
				d["f_kcbh"],
				"库存合并",
				0,
				d["f_hwck"],
				d["f_kcdj"],
				d["f_kcsl"],
				kgyId,
				d["f_beizhu"],
				this.kcbzCodes["历史"]
			);
            if (dataNew == undefined) return undefined;
        }

        return dataAdd;
	}
}