PROCEDURE "build_products" ( 
	        out ex_products table (PRODUCTID nvarchar(10),
                               CATEGORY nvarchar(20),
                               PRICE decimal(15,2) ) )
   LANGUAGE SQLSCRIPT
   SQL SECURITY INVOKER
   --DEFAULT SCHEMA <default_schema_name>
   READS SQL DATA AS
BEGIN
 
 declare lt_products table like :ex_products;

 lt_products = select PRODUCTID, CATEGORY, PRICE from "MD.Products";
 :ex_products.INSERT(:lt_products);
 :ex_products.INSERT(('ProductA', 'Software', '1999.99'), 1);
 :ex_products.INSERT(('ProductB', 'Software', '2999.99'), 2);
 :ex_products.INSERT(('ProductC', 'Software', '3999.99'), 3);

END
