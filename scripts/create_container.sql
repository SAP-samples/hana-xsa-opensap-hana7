CALL _SYS_DI.CREATE_CONTAINER('&2', _SYS_DI.T_NO_PARAMETERS, ?, ?, ?);

DO
BEGIN
  DECLARE userName NVARCHAR(100); 
  DECLARE userDT NVARCHAR(100); 
  DECLARE userRT NVARCHAR(100);   
  declare return_code int;
  declare request_id bigint;
  declare MESSAGES _SYS_DI.TT_MESSAGES;
  declare PRIVILEGES _SYS_DI.TT_API_PRIVILEGES;
  declare SCHEMA_PRIV _SYS_DI.TT_SCHEMA_PRIVILEGES;

  no_params = SELECT * FROM _SYS_DI.T_NO_PARAMETERS;

  SELECT SYSUUID INTO userName FROM DUMMY; 
  SELECT '&2' || '_' || :userName || '_DT' into userDT FROM DUMMY;
  SELECT '&2' || '_' || :userName || '_RT' into userRT FROM DUMMY;  
  EXEC 'CREATE USER ' || :userDT || ' PASSWORD "&1" NO FORCE_FIRST_PASSWORD_CHANGE';
  EXEC 'CREATE USER ' || :userRT || ' PASSWORD "&1" NO FORCE_FIRST_PASSWORD_CHANGE';

  COMMIT;

--Grant Container Admin to Development User(s)
PRIVILEGES = SELECT PRIVILEGE_NAME, OBJECT_NAME, PRINCIPAL_SCHEMA_NAME, (SELECT :userDT FROM DUMMY) AS PRINCIPAL_NAME FROM _SYS_DI.T_DEFAULT_CONTAINER_ADMIN_PRIVILEGES;
CALL _SYS_DI.GRANT_CONTAINER_API_PRIVILEGES('&2', :PRIVILEGES, :no_params, :return_code, :request_id, :MESSAGES); 
select * from :MESSAGES;

--Grant Container User to Development User(s)
SCHEMA_PRIV = SELECT 'SELECT' AS PRIVILEGE_NAME, '' AS PRINCIPAL_SCHEMA_NAME, :userRT AS PRINCIPAL_NAME FROM DUMMY;  
CALL _SYS_DI.GRANT_CONTAINER_SCHEMA_PRIVILEGES('&2', :SCHEMA_PRIV, :no_params, :return_code, :request_id, :MESSAGES);
select * from :MESSAGES;

--Configure Default Libraries for Container
  default = SELECT * FROM _SYS_DI.T_DEFAULT_LIBRARIES;
  CALL _SYS_DI.CONFIGURE_LIBRARIES('&2', :default, :no_params, :return_code, :request_id, :MESSAGES);
  SELECT :userDT as "Object Owner", :userRT as "Application User" from DUMMY;
END;