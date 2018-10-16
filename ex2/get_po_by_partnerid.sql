PROCEDURE "get_po_by_partnerid" ( in im_partnerid nvarchar(10),
                      out ex_po table ( partnerid nvarchar(10), 
                                        purchaseorderid nvarchar(10),
                                        productid nvarchar(20),
                                        currency nvarchar(5), 
                                        grossamount decimal(15,2), 
                                        quantity decimal(13,3) ) ) 
       LANGUAGE SQLSCRIPT 
       SQL SECURITY INVOKER
       READS SQL DATA AS 
BEGIN 

  ex_po = select header."PARTNER.PARTNERID" as partnerid, 
                 item."HEADER.PURCHASEORDERID" as purchaseorderid,
                 item."PRODUCT.PRODUCTID" as productid, item.currency,  
                 item.grossamount, item.quantity
                   from "PO.Header" as header inner join "PO.Item" as item
                        on header.PURCHASEORDERID = item."HEADER.PURCHASEORDERID" 
                                 where header."PARTNER.PARTNERID" = :im_partnerid;

END;
