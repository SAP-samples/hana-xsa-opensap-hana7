/*eslint no-console: 0, no-unused-vars: 0, no-shadow:0, quotes: 0*/
//create a new $.util.SAXParser object

//parse XML from String
var xmlDocument = new $.require("xmldoc").XmlDocument;

var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
          '<!-- this is a note -->\n'+
           '<note noteName="NoteName">'+
               '<to>To</to>'+
               '<from>From</from>'+
               '<heading>Note heading</heading>'+
               '<body>Note body</body>'+
           '</note>';
var body = "";           
var note = new xmlDocument(xml);
note.eachChild(function(item){
   body += item.val + '</br>';	
});

$.response.status = $.net.http.OK; 
$.response.contentType = "text/html";
$.response.setBody(body); 