-- use data

-- sql

insert into n_data_rt_cache(f_device_id, f_status, f_dtime,
    f_st, f_qn, f_datatime, f_data, f_dflag,
    A1,A2,A3,A4,A5,
    A6,A7,A8,A9,A10,
    A11,A12,A13,A14,A15,
    A16,A17,A18,A19,A20) values

    -- add for ',' #v_pack
    (#v_device_id, 1 , ##now,
    '#v_st', '#v_qn', '#v_datatime', '#v_data_json', 0,
    #v1,#v2,#v3,#v4,#v5,
    #v6,#v7,#v8,#v9,#v10,
    #v11,#v12,#v13,#v14,#v15,
    #v16,#v17,#v18,#v19,#v20)
    -- end

-- end
