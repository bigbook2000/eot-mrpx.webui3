-- sql

---- 查询部件父节点 bjsl为0

select tcpdl.f_cpdl_id,tcpdl.f_dlbm,tcpdl.f_dlmc,
    tcpxl.f_cpxl_id,tcpxl.f_xlbm,tcpxl.f_xlmc,
    tcpbj.f_cpbj_id,tcpbj.f_cpdy_pid,tcpbj.f_bjsl,
    tcpdy.*
    from tcpbj,tcpdy,tcpdl,tcpxl
    where tcpdy._update_flag>0
    and tcpdy.f_cpxl_id=tcpxl.f_cpxl_id
    and tcpdl.f_cpdl_id=tcpxl.f_cpdl_id
    and tcpbj.f_cpdy_id=tcpdy.f_cpdy_id
    order by tcpdy.f_cpbm,tcpdy.f_cpmc

-- end