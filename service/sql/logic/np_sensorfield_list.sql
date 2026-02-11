---- 获取数据存储清单
    
-- sql
select n_sensor_group.f_code,
    n_sensor_group.f_name as f_sensor_group_id_s,
    n_sensor_field.*
    from n_sensor_group,n_sensor_field
    where n_sensor_group.f_sensor_group_id=n_sensor_field.f_sensor_group_id
    and n_sensor_field._update_flag>0

-- add <> '' #v_sensor_group_id
	and n_sensor_field.f_sensor_group_id = '#v_sensor_group_id'
-- end

order by n_sensor_field.f_index

-- end