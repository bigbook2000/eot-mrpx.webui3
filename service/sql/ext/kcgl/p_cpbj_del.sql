-- acl _kcgl.cpdy.upd

---- 产品零部件
-- sql
delete from tcpbj where f_cpbj_id=#v_cpbj_id
-- end

-- sql
select 0 as _d, '' as _s, #v_cpbj_id as f_cpbj_id
-- end