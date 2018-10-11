function performMultiply() {
    var body = "";
    var num1 = $.request.parameters.get("num1");
    var num2 = $.request.parameters.get("num2");
    var answer;

    answer = num1 * num2;

    body = answer.toString();

    $.response.setBody(body);
    $.response.status = $.net.http.OK;
    
}

var aCmd = $.request.parameters.get("cmd");
switch (aCmd) {
    case "multiply":
        performMultiply();
        break;
    default:
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody("Invalid Command");
}