
---- rkcpmx_id 唯一
-- set = 0 #t_kcmx_id
-- end
-- var
select f_kcmx_id as t_kcmx_id from tkcmx where f_kcmxrk_id=#v_kcmxrk_id
-- end

-- iff > 0 #t_kcmx_id
    -- sql
	update tkcmx set
	    f_hwck=#v_hwck,
        f_cpdj=#v_cpdj,
        f_cpsl=#v_cpsl,
        f_pksj=##now,
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_kcmx_id = #t_kcmx_id;
	-- end
-- end

-- iff <= 0 #t_kcmx_id
	-- inc #t_kcmx_id
	insert into tkcmx(
	    f_kcbh,
	    f_kcmxrk_id,
	    f_kcmxck_id,
        f_cpdy_id,
	    f_jyzt,
	    f_jyyg_id,
        f_hwck,
        f_rksj,
        f_pksj,
        f_cpdj,
        f_cpsl,
        f_kcbz,
        f_kgy_id,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        '#v_kcbh',
        #v_kcmxrk_id,
        0,
        #v_cpdy_id,
        0,
        0,
        #v_hwck,
        ##now,
        ##now,
        #v_cpdj,
        #v_cpsl,
        1,
        #v_kgy_id,
        '#v_beizhu',
        ##now,
        1);
	-- end

    ---- 将入库标识为1
    -- sql
	update tkcmxrk set f_rkbz=1 where f_kcmxrk_id = #v_kcmxrk_id;
	-- end
-- end

---- 更新产品数量
-- set = 0 #t_cpsl #t_cpzj
-- end
-- var
select sum(f_cpsl) as t_cpsl,
    sum(f_cpsl*f_cpdj) as t_cpzj
    from tkcmx where f_cpdy_id=#v_cpdy_id
-- end

-- sql
update tcpdy set f_kcsl=#t_cpsl,f_kczj=#t_cpzj where f_cpdy_id=#v_cpdy_id
-- end

-- sql
select tcpdy.*,tkcmx.*,
    tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc
    from tkcmx,tcpdy,tcpdl,tcpxl
    where f_kcmx_id=#t_kcmx_id
    and tkcmx.f_cpdy_id=tcpdy.f_cpdy_id
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id
-- end