-- use data

---- 加载HJ212参数因子

-- sql
select n_sensor_group.f_code,n_sensor_field.*
    from n_sensor_group,n_sensor_field
    where n_sensor_group.f_sensor_group_id=n_sensor_field.f_sensor_group_id
    and n_sensor_group._update_flag>0
    and n_sensor_field._update_flag>0
-- end