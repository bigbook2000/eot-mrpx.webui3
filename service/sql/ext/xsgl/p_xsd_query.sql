-- sql
select txsd.*,tkhgl.f_khmc as f_khgl_id_s
    from txsd,tkhgl where txsd._update_flag>0
    and txsd.f_khgl_id=tkhgl.f_khgl_id

-- add <> '' #v_xsdh
	and txsd.f_xsdh like '%#v_xsdh%'
-- end

-- add > 0 #v_xsy_id
	and txsd.f_xsy_id=#v_xsy_id
-- end

-- add > 0 #v_fhr_id
	and txsd.f_fhr_id=#v_fhr_id
-- end

-- add <> '' #v_khmc
	and txsd.f_khmc like '%#v_khmc%'
-- end

-- add <> '' #v_lxxx
	and (txsd.f_lxr like '%#v_lxxx%' or txsd.f_lxdh like '%#v_lxxx%')
-- end

-- add <> '' #v_cjsj1
	and txsd.f_cjsj>='#v_cjsj1'
-- end
-- add <> '' #v_cjsj2
	and txsd.f_cjsj<'#v_cjsj2'
-- end

-- add <> '' #v_fhsj1
	and txsd.f_fhsj>='#v_fhsj1'
-- end
-- add <> '' #v_fhsj2
	and txsd.f_fhsj<'#v_fhsj2'
-- end

-- add >= 0 #v_yxbz
	and txsd.f_yxbz=#v_yxbz
-- end

order by f_xsd_id desc

-- end