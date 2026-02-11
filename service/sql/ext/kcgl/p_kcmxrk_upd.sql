---- 入库明细

-- iff > 0 #v_kcmxrk_id
    -- sql
	update tkcmxrk set
        f_kcbh='#v_kcbh',
	    f_cpdy_id=#v_cpdy_id,
	    f_rklb='#v_rklb',
	    f_rkd_id=#v_rkd_id,
	    f_rkcp_id=#v_rkcp_id,
	    f_kgy_id=#v_kgy_id,
	    f_cpsl=#v_cpsl,
	    f_cpdj=#v_cpdj,
	    f_cpzj=#v_cpzj,
        f_hwck=#v_hwck,
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_kcmxrk_id = #v_kcmxrk_id;
	-- end
-- end

---- 插入库存标识为0，调用p_kcmx_upd时标识为1

-- iff <= 0 #v_kcmxrk_id
	-- inc #v_kcmxrk_id
	insert into tkcmxrk(
	    f_kcbh,
	    f_cpdy_id,
        f_rklb,
        f_rkd_id,
        f_rkcp_id,
        f_kgy_id,
        f_cpsl,
        f_cpdj,
        f_cpzj,
        f_hwck,
        f_rksj,
	    f_rkbz,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        '#v_kcbh',
        #v_cpdy_id,
        '#v_rklb',
        #v_rkd_id,
        #v_rkcp_id,
        #v_kgy_id,
        #v_cpsl,
        #v_cpdj,
        #v_cpzj,
        #v_hwck,
        ##now,
        0,
        '#v_beizhu',
        ##now,
        1);
	-- end
-- end

-- sql
select tkcmxrk.*,tcpdy.*
    from tkcmxrk,tcpdy where f_kcmxrk_id=#v_kcmxrk_id
    and tkcmxrk.f_cpdy_id=tcpdy.f_cpdy_id

-- end