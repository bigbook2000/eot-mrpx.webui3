---- 生产对应的部件

-- iff > 0 #v_scbj_id
    -- sql
	update tscbj set
	    f_sccp_id=#v_sccp_id,
	    f_cpbj_id=#v_cpbj_id,
        f_kcmxrk_id=#v_kcmxrk_id,
        f_scbz=#v_scbz,
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_scbj_id = #v_scbj_id
	-- end
-- end

-- iff <= 0 #v_scbj_id
	-- inc #v_scbj_id
	insert into tscbj(
	    f_sccp_id,
        f_cpbj_id,
        f_kcmxrk_id,
        f_scbz,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        #v_sccp_id,
        #v_cpbj_id,
        #v_kcmxrk_id,
        #v_scbz,
        '#v_beizhu',
        ##now,
        1);
	-- end
-- end


-- sql
select tscbj.*,tkcmxrk.* from tscbj,tkcmxrk
    where tscbj.f_scbj_id=#v_scbj_id
    and tscbj.f_kcmxrk_id=tkcmxrk.f_kcmxrk_id
-- end