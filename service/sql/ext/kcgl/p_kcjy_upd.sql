---- 每个货物编号只有一个当前借用标识0

---- 转换标识
-- sql
update tkcjy set f_jybz=1 where f_kcmxrk_id=#v_kcmxrk_id
-- end

-- inc #t_kcjy_id
	insert into tkcjy(
        f_kcmxrk_id,
        f_cpdy_id,
        f_yg_id,
        f_kgy_id,
        f_jysj,
        f_ghsj,
        f_jyzt,
        f_jybz,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        #v_kcmxrk_id,
        #v_cpdy_id,
        #v_yg_id,
        #v_kgy_id,
        ##now,
        '1970-01-01 00:00:00',
        #v_jyzt,
        0,
        '#v_beizhu',
        ##now,
        1);
-- end

---- 更改库存状态
-- sql
update tkcmx set f_jyzt=#v_jyzt,f_jyyg_id=#v_yg_id where f_kcmxrk_id=#v_kcmxrk_id
-- end

-- sql
select * from tkcjy where f_kcjy_id=#t_kcjy_id
-- end