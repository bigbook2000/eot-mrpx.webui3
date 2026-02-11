
-- iff > 0 #v_cgd_id
    -- sql
	update tcgd set
	    f_gys_id=#v_gys_id,
	    f_cgy_id=#v_cgy_id,
        f_lxr='#v_lxr',
        f_lxdh='#v_lxdh',
        f_wlgs_id=#v_wlgs_id,
        f_wldh='#v_wldh',
        f_shr_id=#v_shr_id,
        f_fklb=#v_fklb,
        f_zje=#v_zje,
        f_sfje=#v_sfje,
        f_shsj='#v_shsj',
        f_yxbz=#v_yxbz,
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_cgd_id = #v_cgd_id;
	-- end
-- end

-- iff <= 0 #v_cgd_id
	-- inc #v_cgd_id
	insert into tcgd(
	    f_cgdh,
	    f_gys_id,
        f_cgy_id,
        f_cgjh_id,
        f_lxr,
        f_lxdh,
        f_wlgs_id,
        f_wldh,
        f_shr_id,
        f_fklb,
        f_zje,
        f_sfje,
        f_cjsj,
        f_shsj,
        f_yxbz,
        f_beizhu,
        f_flow_point_id,
        f_flow_process_id,
        _update_time,
		_update_flag)
        values (
        '#v_cgdh',
        #v_gys_id,
        #v_cgy_id,
        #v_cgjh_id,
        '#v_lxr',
        '#v_lxdh',
        #v_wlgs_id,
        '#v_wldh',
        #v_shr_id,
        #v_fklb,
        #v_zje,
        #v_sfje,
        ##now,
        '#v_shsj',
        #v_yxbz,
        '#v_beizhu',
        0,
        0,
        ##now,
        1);
	-- end
-- end

-- sql
select tcgd.*,tgys.f_gysmc as f_gys_id_s
    from tcgd,tgys where tcgd.f_cgd_id=#v_cgd_id
    and tcgd.f_gys_id=tgys.f_gys_id
-- end