-- use framework

---- 仅仅更新父节点

-- sql
UPDATE eox_dept SET f_dept_pid = #v_dept_pid,
	f_level = #v_level, _update_time = ##now
	WHERE f_dept_id = #v_dept_id;
-- end

-- sql
SELECT #v_dept_id AS f_dept_id, #v_dept_pid AS f_dept_pid; 
-- end