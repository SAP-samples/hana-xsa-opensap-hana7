function po_create_before_exit(param) {
    $.trace.error("Start of Exit");
    var after = param.afterTableName;
    var pStmt = null;
    var poid = '';
   
    try {
        pStmt = param.connection
        		 .prepareStatement('select "purchaseOrderSeqId".NEXTVAL from "DUMMY"');
                 //  .prepareStatement('SELECT max(PURCHASEORDERID + 1) from "PO.Header"');
        var rs = pStmt.executeQuery();
        while (rs.next()) {
           	poid = rs.getString(1);
        }
        $.trace.error(poid);
        pStmt.close();

        pStmt = param.connection.prepareStatement("update\"" + after + "\"set PURCHASEORDERID = ?");
        pStmt.setString(1, poid.toString());
        pStmt.execute();
        pStmt.close();
    } catch (e) {
    	$.trace.error(e.message);
        pStmt.close();
    }

}