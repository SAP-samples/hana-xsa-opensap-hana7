/*eslint-env node, es6 */
"use strict";
module.exports = {
   asyncDemo: (wss) => {
	 	wss.broadcast("Start");
		setTimeout(() => {
			wss.broadcast("Wait Timer Over");
		}, 3000);
		wss.broadcast("End");
  }
};