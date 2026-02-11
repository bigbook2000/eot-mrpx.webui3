
---- 查询指定入库单号的入库明细

-- sql

select tkcmxrk.*,tcpdy.*
    from tkcmxrk,tcpdy where tkcmxrk._update_flag>0
    and tkcmxrk.f_rkd_id=#v_rkd_id
    and tkcmxrk.f_rklb='#v_rklb'
    and tkcmxrk.f_cpdy_id=tcpdy.f_cpdy_id

-- end