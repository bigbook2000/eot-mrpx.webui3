
-- iff > 0 #v_wlgs_id
    -- sql
	update twlgs set
	    f_gsmc='#v_gsmc',
	    f_hzdj=#v_hzdj,
        f_lxr='#v_lxr',
        f_lxdh='#v_lxdh',
        f_gsdz='#v_gsdz',
        f_wldh='#v_wldh',
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_wlgs_id = #v_wlgs_id;
	-- end
-- end

-- iff <= 0 #v_wlgs_id
	-- inc #v_wlgs_id
	insert into twlgs(
	    f_gsmc,
	    f_hzdj,
        f_lxr,
        f_lxdh,
        f_gsdz,
        f_wldh,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        '#v_gsmc',
        #v_hzdj,
        '#v_lxr',
        '#v_lxdh',
        '#v_gsdz',
        '#v_wldh',
        '#v_beizhu',
        ##now,
        1);
	-- end
-- end

-- sql
select twlgs.* from twlgs where f_wlgs_id=#v_wlgs_id
-- end