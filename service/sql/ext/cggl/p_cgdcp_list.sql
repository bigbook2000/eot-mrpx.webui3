-- sql

select tcgdcp.*,tcpdy.*
    from tcgdcp,tcpdy where tcgdcp._update_flag>0
    and tcgdcp.f_cgd_id=#v_cgd_id
    and tcgdcp.f_cpdy_id=tcpdy.f_cpdy_id

-- end