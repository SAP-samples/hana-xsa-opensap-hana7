$.response.contentType = "application/json";
var output = {
    entry: {}
};

var conn = $.db.getConnection();
// get keys from MapKeys table
var pstmt = conn.prepareStatement('select TOP 1 "KEYID","APP_ID","APP_CODE",' + '"EXT1","EXT2" from "Core.MapKeys"');
var rs = pstmt.executeQuery();

if (!rs.next()) {
    $.response.setBody(JSON.stringify(output));
    $.response.status = $.net.http.OK;
} else {
    do {
        // add the keys retreived from database to response
        output.entry.APP_ID = rs.getString(2);
        output.entry.APP_CODE = rs.getString(3);
    } while (rs.next());

    $.response.setBody(JSON.stringify(output));
    $.response.status = $.net.http.OK;
}

rs.close();
pstmt.close();
conn.close();