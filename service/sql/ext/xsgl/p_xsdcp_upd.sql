
-- iff > 0 #v_xsdcp_id
    -- sql
	update txsdcp set
	    f_cpdy_id=#v_cpdy_id,
	    f_xssl=#v_xssl,
	    f_xsdj=#v_xsdj,
	    f_xszj=#v_xszj,
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_xsdcp_id = #v_xsdcp_id;
	-- end
-- end

-- iff <= 0 #v_xsdcp_id
	-- inc #v_xsdcp_id
	insert into txsdcp(
	    f_xsd_id,
        f_cpdy_id,
        f_xssl,
        f_xsdj,
        f_xszj,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        #v_xsd_id,
        #v_cpdy_id,
        #v_xssl,
        #v_xsdj,
        #v_xszj,
        '#v_beizhu',
        ##now,
        1);
	-- end
-- end

-- sql
select txsdcp.*,tcpdy.*
    from txsdcp,tcpdy where txsdcp.f_xsdcp_id=#v_xsdcp_id
    and txsdcp.f_cpdy_id=tcpdy.f_cpdy_id

-- end