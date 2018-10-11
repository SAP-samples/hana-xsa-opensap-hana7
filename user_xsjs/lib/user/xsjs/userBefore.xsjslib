/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
 */

function create_before_exit(param) {

    var after = param.afterTableName;
    var pStmt = null;
    //Get Input New Record Values

//Before Exit no longer viable due to Identity Column. You need an Insert Override exit for Indentity Columns
    try {

 /*       pStmt = param.connection
            .prepareStatement("select \"userSeqId\".NEXTVAL from dummy");
        var rs = pStmt.executeQuery();
      var PersNo = "";
        while (rs.next()) {
            PersNo = rs.getString(1);
        }
        pStmt.close();
        pStmt = param.connection.prepareStatement("update\"" + after + "\"set \"UserId\" = ?");
        pStmt.setString(1, PersNo);
        pStmt.execute();
        pStmt.close();*/

    } catch (e) {
        pStmt.close();
    }

}