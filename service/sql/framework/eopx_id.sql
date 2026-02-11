-- use framework

-- sql
update eox_id set f_id_value=f_id_value+1 where f_key='#v_key'
-- end

-- sql
select f_id_value from eox_id where f_key='#v_key'
-- end