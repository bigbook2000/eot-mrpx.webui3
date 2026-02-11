
-- iff > 0 #v_cpxl_id
    -- sql
	update tcpxl set
	    f_cpdl_id = #v_cpdl_id,
	    f_xlbm='#v_xlbm',
        f_xlmc='#v_xlmc',
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_cpxl_id = #v_cpxl_id;
	-- end
-- end

-- iff <= 0 #v_cpxl_id
	-- inc #v_cpxl_id
	insert into tcpxl(
	    f_cpdl_id,
	    f_xlbm,
        f_xlmc,
        f_seek,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        #v_cpdl_id,
        '#v_xlbm',
        '#v_xlmc',
        100,
        '#v_beizhu',
        ##now,
        1);
	-- end
-- end

-- sql
select * from tcpxl where f_cpxl_id=#v_cpxl_id
-- end