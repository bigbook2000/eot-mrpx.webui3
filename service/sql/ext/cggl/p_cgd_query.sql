-- sql
select tcgd.*,tgys.f_gysmc as f_gys_id_s
    from tcgd,tgys where tcgd._update_flag>0
    and tcgd.f_gys_id=tgys.f_gys_id

-- add <> '' #v_cgdh
	and tcgd.f_cgdh like '%#v_cgdh%'
-- end

-- add > 0 #v_cgy_id
	and tcgd.f_cgy_id=#v_cgy_id
-- end

-- add > 0 #v_shr_id
	and tcgd.f_shr_id=#v_shr_id
-- end

-- add <> '' #v_gysmc
	and tgys.f_gysmc like '%#v_gysmc%'
-- end

-- add <> '' #v_lxr
	and tcgd.f_lxr like '%#v_lxr%'
-- end

-- add <> '' #v_lxdh
	and tgys.f_lxdh like '%#v_lxdh%'
-- end

-- add > 0 #v_wlgs_id
	and tcgd.f_wlgs_id=#v_wlgs_id
-- end

-- add <> '' #v_wldh
	and tgys.f_wldh like '%#v_wldh%'
-- end

-- add >= 0 #v_sfje1
	and tcgd.f_sfje>=#v_sfje1
-- end
-- add >= 0 #v_sfje2
	and tcgd.f_sfje<#v_sfje2
-- end

-- add <> '' #v_cjsj1
	and tcgd.f_cjsj>='#v_cjsj1'
-- end
-- add <> '' #v_cjsj2
	and tcgd.f_cjsj<'#v_cjsj2'
-- end

-- add <> '' #v_shsj1
	and tcgd.f_shsj>='#v_shsj1'
-- end
-- add <> '' #v_shsj2
	and tcgrk.f_shsj<'#v_shsj2'
-- end

-- add >= 0 #v_yxbz
	and tcgd.f_yxbz=#v_yxbz
-- end

order by f_cgd_id desc

-- end