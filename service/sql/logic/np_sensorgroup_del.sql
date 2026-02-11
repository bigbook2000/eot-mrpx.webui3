
-- sql
update n_sensor_group set _update_flag=-1 where f_sensor_group_id=#v_sensor_group_id;
-- end

-- sql
select 0 AS _d, '' AS _s, #v_sensor_group_id AS f_sensor_group_id;
-- end