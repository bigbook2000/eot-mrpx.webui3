-- use framework

---- 根据id字符串查找权限列表

-- sql
SELECT * FROM eox_permit WHERE _update_flag>0

-- add <> '' #v_permit_ids
	and f_permit_id IN (#v_permit_ids)
-- end

order by f_name
-- end