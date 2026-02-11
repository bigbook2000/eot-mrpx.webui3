-- use framework

---- 关联

-- sql
update eox_file set f_keyid=#v_keyid where f_file_id=#v_file_id
-- end

-- sql
select 0 as _d, '' as _s, #v_keyid as f_keyid, #v_file_id as f_file_id
-- end