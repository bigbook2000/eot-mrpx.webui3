
-- sql
update n_sensor_view set _update_flag=-1 where f_sensor_view_id=#v_sensor_view_id;
-- end

-- sql
select 0 AS _d, '' AS _s, #v_sensor_view_id AS f_sensor_view_id;
-- end