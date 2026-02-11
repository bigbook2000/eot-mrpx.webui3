
-- iff > 0 #v_gys_id
    -- sql
	update tgys set
	    f_hzdj=#v_hzdj,
	    f_gysmc='#v_gysmc',
	    f_gsgm=#v_gsgm,
	    f_jyfs=#v_jyfs,
        f_kysj='#v_kysj',
        f_lxr='#v_lxr',
        f_lxdh='#v_lxdh',
        f_lxdz='#v_lxdz',
        f_jyfw='#v_jyfw',
        f_zycp='#v_zycp',
        f_gswz='#v_gswz',
        f_jyzt=#v_jyzt,
        f_gysbz='#v_gysbz',
        _update_time=##now
		where f_gys_id = #v_gys_id;
	-- end
-- end

-- iff <= 0 #v_gys_id
	-- inc #v_gys_id
	insert into tgys(
	    f_hzdj,
        f_gysmc,
        f_gsgm,
        f_jyfs,
        f_kysj,
        f_lxr,
        f_lxdh,
        f_lxdz,
        f_jyfw,
        f_zycp,
        f_gswz,
        f_jyzt,
        f_gysbz,
        _update_time,
		_update_flag)
        values (
        #v_hzdj,
        '#v_gysmc',
        #v_gsgm,
        #v_jyfs,
        '#v_kysj',
        '#v_lxr',
        '#v_lxdh',
        '#v_lxdz',
        '#v_jyfw',
        '#v_zycp',
        '#v_gswz',
        #v_jyzt,
        '#v_gysbz',
        ##now,
        1);
	-- end
-- end

-- sql
select tgys.* from tgys where f_gys_id=#v_gys_id
-- end