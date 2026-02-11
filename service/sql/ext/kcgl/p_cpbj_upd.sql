-- acl _kcgl.cpdy.upd

---- 产品零部件
-- var
select f_cpbj_id as v_cpbj_id from tcpbj
    where f_cpdy_id=#v_cpdy_id and f_cpdy_pid=#v_cpdy_pid
-- end

-- iff > 0 #v_cpbj_id
    -- sql
	update tcpbj set
	    f_cpdy_id=#v_cpdy_id,
        f_cpdy_pid=#v_cpdy_pid,
        f_bjsl=#v_bjsl,
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_cpbj_id = #v_cpbj_id;
	-- end
-- end

-- iff <= 0 #v_cpbj_id
	-- inc #v_cpbj_id
	insert into tcpbj(
	    f_cpdy_id,
        f_cpdy_pid,
        f_bjsl,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        #v_cpdy_id,
        #v_cpdy_pid,
        #v_bjsl,
        '#v_beizhu',
        ##now,
        1);
	-- end
-- end


---- 零部件父节点添加自己

-- set = 0 #t_cpbj_pid
-- end

-- var
select f_cpbj_id as t_cpbj_pid from tcpbj
    where f_cpdy_id=#v_cpdy_pid and f_cpdy_pid=#v_cpdy_pid
-- end

-- iff <= 0 #t_cpbj_pid
    -- sql
    insert into tcpbj(
	    f_cpdy_id,
        f_cpdy_pid,
        f_bjsl,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        #v_cpdy_pid,
        #v_cpdy_pid,
        0,
        '',
        ##now,
        1);
    -- end
-- end


-- sql
select tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc,
    tcpbj.f_cpbj_id,tcpbj.f_cpdy_pid,tcpbj.f_bjsl,
    tcpdy.*
    from tcpbj,tcpdy,tcpdl,tcpxl
    where tcpbj.f_cpbj_id=#v_cpbj_id
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id
    and tcpbj.f_cpdy_id=tcpdy.f_cpdy_id
-- end