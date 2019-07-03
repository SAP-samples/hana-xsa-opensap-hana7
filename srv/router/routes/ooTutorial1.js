/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, no-inner-declarations:0 */
/*eslint-env node, es6 */
module.exports = class {
	constructor(id) {
		this.id = id;
	}
	myFirstMethod(import1) {
		if (import1 === 20) {
			let error = {};
			error.message = "Something Bad Happend";
			error.value = import1;
			throw error;
		}
		return import1;
	}
};