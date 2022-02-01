/**
 * These are request handlers
 */

// Dependancies
const _data = require('./data');

// Define a handlers
let handlers = {};

// User handler
handlers.users = function (data, callback) {
	let acceptableMethods = ["post", "put", "get", "delete"];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405)
	}
};

// Container for the user submethods
handlers._users = {};

// Ping handler
handlers.ping = function (data, callback) {
	callback(200);
};

// 404 handler
handlers.notFound = function (data, callback) {
	callback(404);
};

module.exports = handlers;
