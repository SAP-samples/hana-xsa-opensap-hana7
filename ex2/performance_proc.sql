do ( )
Begin

  CALL "performance_proc" (
     IM_PRODUCT_FILTER_STRING => 'CATEGORY = ''Notebooks''', T1 => ?,  T2 => ? );

  select * from M_ACTIVE_PROCEDURES 
     where procedure_connection_id = current_connection;
       
end;
