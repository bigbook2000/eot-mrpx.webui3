---- 生产任务

-- iff > 0 #v_sccp_id
    -- sql
	update tsccp set
	    f_cpdy_id=#v_cpdy_id,
	    f_scy_id=#v_scy_id,
        f_jhsj='#v_jhsj',
        f_jhsl=#v_jhsl,
        f_dqsl=#v_dqsl,
        f_wcsj='#v_wcsj',
        f_yxdj=#v_yxdj,
        f_yxbz=#v_yxbz,
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_sccp_id = #v_sccp_id;
	-- end
-- end

-- iff <= 0 #v_sccp_id
	-- inc #v_sccp_id
	insert into tsccp(
	    f_cpdy_id,
        f_scy_id,
        f_jhsj,
        f_jhsl,
        f_dqsl,
        f_wcsj,
        f_cjsj,
        f_yxdj,
        f_yxbz,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        #v_cpdy_id,
        #v_scy_id,
        '#v_jhsj',
        #v_jhsl,
        #v_dqsl,
        '#v_wcsj',
        ##now,
        #v_yxdj,
        #v_yxbz,
        '#v_beizhu',
        ##now,
        1);
	-- end
-- end


-- sql
select tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc,
    tcpdy.*,
    tsccp.*
    from tcpdy,tcpdl,tcpxl,tsccp
    where tsccp.f_sccp_id=#v_sccp_id
    and tcpdy.f_cpdy_id=tsccp.f_cpdy_id
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id
-- end