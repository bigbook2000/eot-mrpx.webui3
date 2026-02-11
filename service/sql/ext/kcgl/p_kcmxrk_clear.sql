---- 清除采购明细，直接删除，不保留

-- sql
delete from tkcmxrk where
       f_rklb='#v_rklb' and f_rkd_id=#v_rkd_id and f_rkcp_id=#v_rkcp_id
-- end

-- sql
select '#v_rklb' as f_rklb, #v_rkd_id as f_rkd_id, #v_rkcp_id as f_rkcp_id
-- end