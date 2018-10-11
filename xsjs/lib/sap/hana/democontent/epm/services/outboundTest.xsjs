$.import("sap.hana.democontent.epm.services", "messages");
var MESSAGES = $.sap.hana.democontent.epm.services.messages;

// enables outbound access to a defined HTTP destination defined in the image.xshttpdest file.
function searchImages() {
    var search = $.request.parameters.get("search");
    var index = $.request.parameters.get("index");
    if (index === undefined) {
        index = 0;
    }
    var dest = $.net.http.readDestination("sap.hana.democontent.epm.services", "images");

    var client = new $.net.http.Client();
    var req = new $.web.WebRequest($.net.http.GET, search);
    client.request(req, dest);

    var response = client.getResponse();

    var body = null;
    if (response.body) {
        body = response.body.asString();
    }
    $.response.status = response.status;

    if (response.status === $.net.http.INTERNAL_SERVER_ERROR) {
        $.response.contentType = "application/json";
        $.response.setBody("body");
    } else {
        $.response.contentType = "text/html";
        var searchDet = JSON.parse(body);
        var outBody =
            "First Result of " + encodeURIComponent(searchDet.search.hits) + "</br>" +
            "<img src=\"" + encodeURI(searchDet.results[index].image.full) + "\">";
        $.response.setBody(outBody);
    }
}

var aCmd = $.request.parameters.get("cmd");
switch (aCmd) {
    case "Images":
        searchImages();
        break;
    default:
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody(MESSAGES.getMessage("SEPM_ADMIN", "002", encodeURI(aCmd)));
}