-- use framework

-- iff > 0 #v_flow_process_id

	-- sql
	update eox_flow_process set
	    f_user_id = #v_user_id,
	    f_flow_type_id = #v_flow_type_id,
	    f_flow_point_pid = #v_flow_point_pid,
	    f_flow_point_id = #v_flow_point_id,
	    f_data_id = #v_data_id,
	    f_op_time = ##now,
	    f_op_flag = #v_op_flag,
	    f_text = '#v_text',
		_update_time = ##now
		where f_flow_process_id = #v_flow_process_id
	-- end

-- end

-- iff <= 0 #v_flow_process_id

	---- 自增变量
	-- inc #v_flow_process_id
	insert into eox_flow_process(
	    f_user_id,
        f_flow_type_id,
        f_flow_point_pid,
        f_flow_point_id,
        f_data_id,
        f_op_time,
        f_op_flag,
        f_text,
		_update_time,
		_update_flag)
        values (
        #v_user_id,
        #v_flow_type_id,
        #v_flow_point_pid,
        #v_flow_point_id,
        #v_data_id,
        ##now,
        #v_op_flag,
		'#v_text',
		##now,
		1)
	-- end

-- end

-- sql
select eox_flow_process.* from eox_flow_process where f_flow_process_id = #v_flow_process_id
-- end

