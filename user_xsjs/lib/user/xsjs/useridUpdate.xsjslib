/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
 */

function my_create_after_exit(param) {
    var after = param.afterTableName;
    //Get Input New Record Values
    var pStmt, persNo, perFName, perLName, perEmail;
    pStmt = persNo = perFName = perLName = perEmail = null;
    try {

        // pStmt = param.connection
        //     .prepareStatement('select "userSeqId".NEXTVAL from dummy');
        // var rs = pStmt.executeQuery();
        // var PersNo = '';
        // while (rs.next()) {
        //     PersNo = rs.getString(1);
        // }
        // pStmt.close();
        // pStmt = param.connection.prepareStatement("update\"" + after + "\"set \"UserId\" = ?");
        // pStmt.setString(1, PersNo);
        // pStmt.execute();
        // pStmt.close();

        // pStmt = param.connection.prepareStatement('select * from "' + after + '"');
        // rs = pStmt.executeQuery();
        // while (rs.next()) {
        //     persNo = rs.getString(1);
        //     perFName = rs.getString(2);
        //     perLName = rs.getString(3);
        //     perEmail = rs.getString(4);
        // }

        pStmt = param.connection
            .prepareStatement("insert into \"UserData.User\"  (\"FirstName\", \"LastName\", \"Email\") values(?,?,?)");
        //pStmt.setString(1, persNo);
        pStmt.setString(1, perFName);
        pStmt.setString(2, perLName);
        pStmt.setString(3, perEmail);
//      pStmt.setString(4, "");        
        pStmt.executeUpdate();
        pStmt.close();

    } catch (e) {
        pStmt.close();
    }

}