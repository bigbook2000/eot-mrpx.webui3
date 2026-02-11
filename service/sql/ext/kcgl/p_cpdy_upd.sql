-- acl _kcgl.cpdy.upd

-- iff > 0 #v_cpdy_id
    -- sql
	update tcpdy set
	    f_cpxl_id = #v_cpxl_id,
	    f_cpmc='#v_cpmc',
        f_cpgg='#v_cpgg',
        f_cpcc='#v_cpcc',
        f_cpdw='#v_cpdw',
        f_bzsl=#v_bzsl,
        f_cpjg=#v_cpjg,
        f_cpms='#v_cpms',
        f_cpzt=#v_cpzt,
        _update_time=##now
		where f_cpdy_id = #v_cpdy_id;
	-- end
-- end

-- iff <= 0 #v_cpdy_id
	-- inc #v_cpdy_id
	insert into tcpdy(
	    f_cpxl_id,
	    f_cpbm,
	    f_cpmc,
        f_cpgg,
        f_cpcc,
        f_cpdw,
        f_bzsl,
        f_cpjg,
        f_cpms,
        f_cpzt,
        f_cjsj,
        f_kcsl,
        f_kczj,
        f_seek,
        _update_time,
		_update_flag)
        values (
        #v_cpxl_id,
        '#v_cpbm',
        '#v_cpmc',
        '#v_cpgg',
        '#v_cpcc',
        '#v_cpdw',
        #v_bzsl,
        #v_cpjg,
        '#v_cpms',
        #v_cpzt,
        ##now,
        0.0,
        0.0,
        100,
        ##now,
        1);
	-- end
-- end

---- 更新产品数量
-- var
select sum(f_cpsl) as t_cpsl,sum(f_cpsl*f_cpdj) as t_cpzj
    from tkcmx where f_cpdy_id=#v_cpdy_id and f_kcbz>0 and _update_flag>0
-- end

-- iff > 0 #t_cpsl
    -- sql
    update tcpdy set f_kcsl=#t_cpsl,f_kczj=#t_cpzj where f_cpdy_id=#v_cpdy_id
    -- end
-- end
-- iff <= 0 #t_cpsl
    -- sql
    update tcpdy set f_kcsl=0.0,f_kczj=0.0 where f_cpdy_id=#v_cpdy_id
    -- end
-- end

-- sql
select tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc,
    tcpdy.*
    from tcpdy,tcpdl,tcpxl
    where tcpdy.f_cpdy_id=#v_cpdy_id
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id
-- end