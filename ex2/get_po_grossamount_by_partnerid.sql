PROCEDURE "get_po_grossamount_by_partnerid" (
	        out ex_po_by_partnerid table ( partnerid nvarchar(10), 
                                           purchaseorderid nvarchar(10),
                                           productid nvarchar(20),
                                           currency nvarchar(5), 
                                           grossamount decimal(15,2), 
                                           quantity decimal(13,3) ) ) 
   LANGUAGE SQLSCRIPT
   SQL SECURITY INVOKER
   READS SQL DATA AS
BEGIN

 declare lv_rc int;
 declare lv_partnerid nvarchar(10);

 lt_bp = select partnerid from "MD.BusinessPartner"; 

 FOR lv_rc in 1..record_count(:lt_bp) DO
     lv_partnerid = :lt_bp.partnerid[:lv_rc];
     CALL "get_po_by_partnerid"(
		IM_PARTNERID => lv_partnerid,
		EX_PO => lt_po 
    );
    ex_po_by_partnerid = select * from :lt_po 
                          UNION ALL select * from :ex_po_by_partnerid;
 END FOR;

END
