/*eslint no-console: 0, no-unused-vars: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var WebSocketServer = require("ws").Server;
var express = require("express");

module.exports = function (server) {
	var app = express.Router();
	app.use((req, res) => {
		var output =
			`<H1>Node.js Web Socket Examples</H1></br>
			<a href="/exerciseChat">/exerciseChat</a> - Chat Application for Web Socket Example</br>`;
		res.type("text/html").status(200).send(output);
	});
	var wss = new WebSocketServer({
		//	server: server,
		noServer: true,
		path: "/node/chatServer"
	});

	server.on("upgrade", function upgrade(request, socket, head) {
		const url = require("url");		
		const pathname = url.parse(request.url).pathname;

		if (pathname === "/node/chatServer") {
			wss.handleUpgrade(request, socket, head, function done(ws) {
				wss.emit("connection", ws, request);
			});
		}
	});

	wss.broadcast = (data) => {
		wss.clients.forEach(function each(client) {
			try {
				client.send(data);
			} catch (e) {
				console.log("Broadcast Error: %s", e.toString());
			}
		});
		console.log("sent: %s", data);

	};

	wss.on("connection", (ws) => {
		console.log("Connected");
		ws.on("message", (message) => {
			console.log("received: %s", message);
			wss.broadcast(message);
		});
		ws.send(JSON.stringify({
			user: "XS",
			text: "Hello from Node.js XS Server"
		}));
	});

	return app;
};