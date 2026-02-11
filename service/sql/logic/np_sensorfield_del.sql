
-- sql
update n_sensor_field set _update_flag=-1 where f_sensor_field_id=#v_sensor_field_id;
-- end

-- sql
select 0 AS _d, '' AS _s, #v_sensor_field_id AS f_sensor_field_id;
-- end