
-- iff > 0 #v_sensor_field_id
    -- sql
	update n_sensor_field set
        f_sensor_group_id = '#v_sensor_group_id',
		f_name = '#v_name',
		f_index = #v_index,
        f_note = '#v_note',
		_update_time = ##now
		where f_sensor_field_id = #v_sensor_field_id;
	-- end
-- end
    
-- iff <= 0 #v_sensor_field_id
	-- inc #v_sensor_field_id
	insert into n_sensor_field(
        f_sensor_group_id,
		f_name,
		f_index,
        f_note,
		_update_time,
		_update_flag)
        values (
        #v_sensor_group_id,
		'#v_name',
		#v_index,
        '#v_note',
		##now,
		1);
	-- end
-- end

-- sql
select n_sensor_group.f_code,
    n_sensor_group.f_name as f_sensor_group_id_s,
    n_sensor_field.*
    from n_sensor_group,n_sensor_field
    where f_sensor_field_id=#v_sensor_field_id;
-- end