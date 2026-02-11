
-- iff > 0 #v_cgdcp_id
    -- sql
	update tcgdcp set
        f_cgd_id=#v_cgd_id,
	    f_cpdy_id=#v_cpdy_id,
	    f_wlgs_id=#v_wlgs_id,
        f_wldh='#v_wldh',
	    f_cgsl=#v_cgsl,
	    f_cgdj=#v_cgdj,
	    f_cgzj=#v_cgzj,
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_cgdcp_id = #v_cgdcp_id;
	-- end
-- end

-- iff <= 0 #v_cgdcp_id
	-- inc #v_cgdcp_id
	insert into tcgdcp(
	    f_cgd_id,
        f_cpdy_id,
        f_wlgs_id,
        f_wldh,
        f_cgsl,
        f_cgdj,
        f_cgzj,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        #v_cgd_id,
        #v_cpdy_id,
        #v_wlgs_id,
        '#v_wldh',
        #v_cgsl,
        #v_cgdj,
        #v_cgzj,
        '#v_beizhu',
        ##now,
        1);
	-- end
-- end

-- sql
select tcgdcp.*,tcpdy.*
    from tcgdcp,tcpdy where tcgdcp.f_cgdcp_id=#v_cgdcp_id
    and tcgdcp.f_cpdy_id=tcpdy.f_cpdy_id

-- end