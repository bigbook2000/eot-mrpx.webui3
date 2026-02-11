-- use framework

---- v_dept_id
---- 查询部门所有账户字典（基础信息）

-- sql
select eox_user.f_user_id,eox_user.f_login_id,eox_user.f_name,
	eox_user.f_dept_id,eox_dept.f_name as f_dept_id_s
	from eox_user, eox_dept
	where eox_user.f_dept_id = eox_dept.f_dept_id
    and eox_user._update_flag > 0
    and eox_dept._update_flag > 0


order by eox_user.f_dept_id,eox_user.f_name

-- end
