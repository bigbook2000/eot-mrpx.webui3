-- use data

---- 清除所有状态

-- sql
update n_data_rt set f_status=#v_status where f_device_id>0
-- end