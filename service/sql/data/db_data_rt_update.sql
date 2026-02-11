-- use data

---- 使用双表来更新实时数据
---- 实时数据在大规模物联网平台中使用最为广泛，
---- 零碎的update操作造成锁竞争，先将数据插入到只写缓存表中cache
---- 然后定时从缓存批量更新到只读表中
---- 该操作为单线程，可不用考虑线程安全问题



---- 三条语句放在一个set执行

-- sql

---- 第一步翻标记
update n_data_rt_cache set f_dflag=1 where f_data_rt_id>0;
---- 转移数据
update n_data_rt inner join n_data_rt_cache on (n_data_rt.f_device_id = n_data_rt_cache.f_device_id)
    set n_data_rt.f_status = n_data_rt_cache.f_status,
    n_data_rt.f_dtime=n_data_rt_cache.f_dtime,
    n_data_rt.f_st=n_data_rt_cache.f_st,
    n_data_rt.f_qn=n_data_rt_cache.f_qn,
    n_data_rt.f_datatime=n_data_rt_cache.f_datatime,
    n_data_rt.f_data=n_data_rt_cache.f_data,
    n_data_rt.A1=n_data_rt_cache.A1,
    n_data_rt.A2=n_data_rt_cache.A2,
    n_data_rt.A3=n_data_rt_cache.A3,
    n_data_rt.A4=n_data_rt_cache.A4,
    n_data_rt.A5=n_data_rt_cache.A5,
    n_data_rt.A6=n_data_rt_cache.A6,
    n_data_rt.A7=n_data_rt_cache.A7,
    n_data_rt.A8=n_data_rt_cache.A8,
    n_data_rt.A9=n_data_rt_cache.A9,
    n_data_rt.A10=n_data_rt_cache.A10,
    n_data_rt.A11=n_data_rt_cache.A11,
    n_data_rt.A12=n_data_rt_cache.A12,
    n_data_rt.A13=n_data_rt_cache.A13,
    n_data_rt.A14=n_data_rt_cache.A14,
    n_data_rt.A15=n_data_rt_cache.A15,
    n_data_rt.A16=n_data_rt_cache.A16,
    n_data_rt.A17=n_data_rt_cache.A17,
    n_data_rt.A18=n_data_rt_cache.A18,
    n_data_rt.A19=n_data_rt_cache.A19,
    n_data_rt.A20=n_data_rt_cache.A20 
    where n_data_rt_cache.f_dflag = 1;
---- 清空表
delete from n_data_rt_cache where n_data_rt_cache.f_dflag = 1;

-- end