---- 库存借用查询，存在历史记录，使用入库单

-- sql
select tcpdy.*,tkcjy.*,tkcmxrk.*,
    tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc
    from tkcjy,tkcmxrk,tcpdy,tcpdl,tcpxl
    where tkcjy._update_flag>0
    and tkcjy.f_kcmxrk_id=tkcmxrk.f_kcmxrk_id
    and tkcmxrk.f_cpdy_id=tcpdy.f_cpdy_id
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id

-- add <> '' #v_kcbh
	and tkcmxrk.f_kcbh like '%#v_kcbh%'
-- end

-- add <> '' #v_cpmc
	and tcpdy.f_cpmc like '%#v_cpmc%'
-- end

-- add >= 0 #v_jyzt
	and tkcjy.f_jyzt=#v_jyzt
-- end

-- add > 0 #v_yg_id
	and tkcjy.f_yg_id=#v_yg_id
-- end

-- add <> '' #v_kssj
	and tkcjy.f_jysj>='#v_kssj'
-- end
-- add <> '' #v_jssj
	and tkcjy.f_jysj<'#v_jssj'
-- end

#v_order_by

-- end