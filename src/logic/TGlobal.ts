
/**
 * 应用全局对象
 */
class TGlobal {

    /** 全局性标识 */
    appId: number = 0;
    appData: any = {};

    userData: any = {
        f_user_id: 0,
        f_dept_id: 1,
        f_name: "未登录",

        // 角色列表
        role_list: []
    };

    settingList: any = {};

    /** 菜单列表 */
    menuList: any[] = [];
    /** 菜单映射，双列表 */
    menuMap: any = {};

    permitString: string = "";

    /** 顶级部门 */
    topDeptId: number = 1;

    /** 服务器文件路径 */
    fileStatic: string = "file";
}


export default new TGlobal();