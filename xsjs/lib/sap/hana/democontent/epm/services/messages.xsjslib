function escape(v1) {
    var v2 = v1.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    console.log("v1 "+v1);
    var v2 = encodeURI(v1);
    console.log("v2 "+v2);
    return v2;
}

function getMessage(messageClass, messageNumber, p1, p2, p3, p4) {
    var messageText = '';
    var lang = $.session.language.substring(0, 2).toLowerCase();

    var conn = $.db.getConnection();
    var query = 'SELECT "DESCRIPTION" FROM "Util.Messages" ' +
        'WHERE "MESSAGECLASS" = ? AND "MESSAGENUMBER" = ? AND "LANGUAGE" = ? ';
    var pstmt = conn.prepareStatement(query);
    pstmt.setString(1, messageClass);
    pstmt.setString(2, messageNumber);
    pstmt.setString(3, lang);
    var rs = pstmt.executeQuery();

    while (rs.next()) {
        messageText = rs.getNString(1);
    }

    if (messageText === '') {
        lang = 'en';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, messageClass);
        pstmt.setString(2, messageNumber);
        pstmt.setString(3, lang);
        rs = pstmt.executeQuery();
        while (rs.next()) {
            messageText = rs.getNString(1);
        }
    }

    rs.close();
    pstmt.close();

    if (p1) {
        messageText = messageText.replace("&1", escape(p1.toString()));
    }
    if (p2) {
        messageText = messageText.replace("&2", escape(p2.toString()));
    }
    if (p3) {
        messageText = messageText.replace("&3", escape(p3.toString()));
    }
    if (p4) {
        messageText = messageText.replace("&4", escape(p4.toString()));
    }
    return messageText;
}