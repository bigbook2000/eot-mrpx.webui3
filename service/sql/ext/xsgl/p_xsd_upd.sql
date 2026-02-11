
-- iff > 0 #v_xsd_id
    -- sql
	update txsd set
	    f_khgl_id=#v_khgl_id,
        f_lxr='#v_lxr',
        f_lxdh='#v_lxdh',
        f_fklb=#v_fklb,
        f_xsje=#v_xsje,
        f_ssje=#v_ssje,
        f_fhy_id=#v_fhy_id,
        f_fhsj='#v_fhsj',
        f_yxbz=#v_yxbz,
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_xsd_id = #v_xsd_id;
	-- end
-- end

-- iff <= 0 #v_xsd_id
	-- inc #v_xsd_id
	insert into txsd(
	    f_xsdh,
	    f_xsy_id,
        f_khgl_id,
        f_xsjh_id,
        f_lxr,
        f_lxdh,
        f_fklb,
        f_xsje,
        f_ssje,
        f_fhy_id,
        f_fhsj,
        f_cjsj,
        f_yxbz,
        f_beizhu,
        f_flow_point_id,
        f_flow_process_id,
        _update_time,
		_update_flag)
        values (
        '#v_xsdh',
        #v_xsy_id,
        #v_khgl_id,
        #v_xsjh_id,
        '#v_lxr',
        '#v_lxdh',
        #v_fklb,
        #v_xsje,
        #v_ssje,
        #v_fhy_id,
        '1970-01-01 00:00:00',
        ##now,
        #v_yxbz,
        '#v_beizhu',
        0,
        0,
        ##now,
        1);
	-- end
-- end

-- sql
select txsd.*,tkhgl.f_khmc as f_khgl_id_s
    from txsd,tkhgl where txsd.f_xsd_id=#v_xsd_id
    and txsd.f_khgl_id=tkhgl.f_khgl_id
-- end