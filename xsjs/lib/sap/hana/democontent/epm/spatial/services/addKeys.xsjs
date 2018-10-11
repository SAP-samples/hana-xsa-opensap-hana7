var body = $.request.body.asString();

var entry = JSON.parse(body);

var responseBody = '';

var conn = $.db.getConnection();
var pstmt = conn.prepareStatement(
    'insert into "Core.MapKeys" values(?,?,?,?,?)');
pstmt.setString(1, "1");
pstmt.setString(2, entry.APP_ID);
pstmt.setString(3, entry.APP_CODE);
pstmt.setString(4, "");
pstmt.setString(5, "");

var rs = pstmt.execute();

pstmt.close();

conn.commit();
conn.close();

$.response.status = $.net.http.CREATED;
$.response.setBody(responseBody);