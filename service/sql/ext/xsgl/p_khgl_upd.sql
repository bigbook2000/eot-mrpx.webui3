-- acl _xsgl.khgl.upd

-- iff > 0 #v_khgl_id
    -- sql
	update tkhgl set
	    f_khmc='#v_khmc',
	    f_jyzt=#v_jyzt,
	    f_qzyx=#v_qzyx,
	    f_khlb=#v_khlb,
	    f_hzdj=#v_hzdj,
	    f_khly=#v_khly,
	    f_gsgm=#v_gsgm,
	    f_jyfs=#v_jyfs,
	    f_sshy=#v_sshy,
        f_fzr='#v_fzr',
        f_gsdh='#v_gsdh',
        f_xzsf='#v_xzsf',
        f_xzds='#v_xzds',
        f_xzqx='#v_xzqx',
        f_gsdz='#v_gsdz',
        f_gswz='#v_gswz',
        f_jyfw='#v_jyfw',
        f_zycp='#v_zycp',
        f_cjje=#v_cjje,
        f_ghbz=#v_ghbz,
        f_beizhu='#v_beizhu',
        _update_time=##now
		where f_khgl_id = #v_khgl_id;
	-- end
-- end

-- iff <= 0 #v_khgl_id
	-- inc #v_khgl_id
	insert into tkhgl(
	    f_xsy_id,
	    f_khmc,
	    f_jyzt,
        f_qzyx,
        f_khlb,
        f_hzdj,
        f_khly,
        f_gsgm,
        f_jyfs,
        f_sshy,
        f_fzr,
        f_gsdh,
        f_xzsf,
        f_xzds,
        f_xzqx,
        f_gsdz,
        f_gswz,
        f_jyfw,
        f_zycp,
        f_jdsj,
        f_gtsj,
        f_cjsj,
        f_cjje,
        f_ghbz,
        f_lxxx,
        f_beizhu,
        _update_time,
		_update_flag)
        values (
        #v_xsy_id,
        '#v_khmc',
        #v_jyzt,
        #v_qzyx,
        #v_khlb,
        #v_hzdj,
        #v_khly,
        #v_gsgm,
        #v_jyfs,
        #v_sshy,
        '#v_fzr',
        '#v_gsdh',
        '#v_xzsf',
        '#v_xzds',
        '#v_xzqx',
        '#v_gsdz',
        '#v_gswz',
        '#v_jyfw',
        '#v_zycp',
        '#v_jdsj',
        '#v_gtsj',
        '#v_cjsj',
        #v_cjje,
        #v_ghbz,
        '',
        '#v_beizhu',
        ##now,
        1);
	-- end
-- end


-- sql
select tkhgl.* from tkhgl where tkhgl.f_khgl_id=#v_khgl_id
-- end