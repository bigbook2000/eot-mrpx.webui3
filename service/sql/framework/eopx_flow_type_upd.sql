-- use framework

-- iff > 0 #v_flow_type_id

	-- sql
	update eox_flow_type set
		f_name='#v_name',
		f_table='#v_table',
		f_field='#v_field',
		f_text='#v_text',
		f_status=#v_status,
		_update_time = ##now
		where f_flow_type_id = #v_flow_type_id
	-- end

-- end

-- iff <= 0 #v_flow_type_id

	---- 自增变量
	-- inc #v_flow_type_id
	insert into eox_flow_type(
		f_name,
		f_table,
		f_field,
		f_text,
		f_status,
		_update_time,
		_update_flag)
        values (
		'#v_name',
		'#v_table',
		'#v_field',
		'#v_text',
		#v_status,
		##now,
		1)
	-- end

-- end

-- sql
select eox_flow_type.* from eox_flow_type where f_flow_type_id = #v_flow_type_id
-- end

