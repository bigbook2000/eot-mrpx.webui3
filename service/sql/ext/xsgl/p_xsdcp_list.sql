-- sql

select txsdcp.*,tcpdy.*
    from txsdcp,tcpdy where txsdcp._update_flag>0
    and txsdcp.f_xsd_id=#v_xsd_id
    and txsdcp.f_cpdy_id=tcpdy.f_cpdy_id

-- end