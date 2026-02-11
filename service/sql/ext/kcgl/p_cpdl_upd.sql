
-- iff > 0 #v_cpdl_id
    -- sql
	update tcpdl set
	    f_dlbm='#v_dlbm',
        f_dlmc='#v_dlmc',
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_cpdl_id = #v_cpdl_id;
	-- end
-- end

-- iff <= 0 #v_cpdl_id
	-- inc #v_cpdl_id
	insert into tcpdl(
	    f_dlbm,
        f_dlmc,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        '#v_dlbm',
        '#v_dlmc',
        '#v_beizhu',
        ##now,
        1);
	-- end
-- end

-- sql
select * from tcpdl where f_cpdl_id=#v_cpdl_id
-- end