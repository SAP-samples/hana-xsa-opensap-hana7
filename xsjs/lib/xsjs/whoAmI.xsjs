/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
var connection = $.hdb.getConnection();

var query = `SELECT CURRENT_USER 
					FROM "DUMMY"`;
var rs = connection.executeQuery(query);
var currentUser = rs[0].CURRENT_USER;

query = `SELECT SESSION_CONTEXT('APPLICATIONUSER') "APPLICATION_USER" 
                FROM "DUMMY"`;
rs = connection.executeQuery(query);
var applicationUser = rs[0].APPLICATION_USER;

var greeting =
	`XS Layer Session User: ${$.session.getUsername()}
    </br>Database Current User: ${currentUser} 
    </br> Database Application User: ${applicationUser}
    </br>Welcome to HANA `;

$.response.contentType = "text/html; charset=utf-8";
$.response.setBody(greeting);