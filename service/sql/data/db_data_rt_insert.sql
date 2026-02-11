-- use data

---- 如果data实时数据表未匹配设备表，则添加一条记录
---- 这样避免每次检查实时数据表是否存在记录
---- 每次收到数据仅调用update操作

-- var
select f_device_id as t_device_id from n_data_rt where f_device_id=#v_device_id
-- end

-- iff 0 <= #t_device_id
insert into n_data_rt(f_device_id, f_status, f_dtime, f_st, f_qn, f_datatime, f_data, f_dflag,
    A1,A2,A3,A4,A5,
    A6,A7,A8,A9,A10,
    A11,A12,A13,A14,A15,
    A16,A17,A18,A19,A20)
    values(#v_device_id, 0, ##now, 0, '1970-01-01 00:00:00', '1970-01-01 00:00:00', '', 0,
    null,null,null,null,null,
    null,null,null,null,null,
    null,null,null,null,null,
    null,null,null,null,null)
-- end