/**
 * These are request handlers
 */

// Dependancies
const _data = require("./data");
const helpers = require("./helpers");

// Define a handlers
let handlers = {};

// User handler
handlers.users = function (data, callback) {
	let acceptableMethods = ["post", "put", "get", "delete"];
	console.log(data);
	if (acceptableMethods.indexOf(data.method.toLowerCase()) > -1) {
		handlers._users[data.method.toLowerCase()](data, callback);
	} else {
		callback(405, { Error: "U handlerima!" });
	}
};

// Container for the user submethods
handlers._users = {};

// Users - POST
// Req data: firstName, lastName, password, phone, tosAgreement
// Optional data: none
handlers._users.post = function (data, callback) {
	const firstName =
		typeof data.payload.firstName == "string" && data.payload.firstName.trim().length > 0
			? data.payload.firstName.trim()
			: false;
	const lastName =
		typeof data.payload.lastName == "string" && data.payload.lastName.trim().length > 0
			? data.payload.lastName.trim()
			: false;
	const password =
		typeof data.payload.password == "string" && data.payload.password.trim().length > 0
			? data.payload.password.trim()
			: false;
	const phone =
		typeof data.payload.phone == "string" && data.payload.phone.trim().length > 0
			? data.payload.phone.trim()
			: false;
	const tosAgreement = typeof data.payload.tosAgreement == "boolean" && data.payload.tosAgreement;

	if (firstName && lastName && password && phone && tosAgreement) {
		// Here we use our previous made library Data
		// Our logic is based on to send SMS to users in this application, so we will create number.json
		// files inside of a .data folder. So we need to check if there allready exist file with some number

		_data.read("users", phone, (err, data) => {
			if (err) {
				// Hash the password
				let hashedPass = helpers.hash(password);

				if (hashedPass) {
					// Create the user object
					let userObj = {
						firstName: firstName,
						lastName: lastName,
						phone: phone,
						hashedPass: hashedPass,
						tosAgrement: true,
					};

					// Store the user
					_data.create("users", phone, userObj, (err) => {
						if (!err) {
							callback(200);
						} else {
							console.log(err);
							callback(500, { Error: "Could not create user!" });
						}
					});
				} else {
					callback(500, { Error: "Could not hash the user!" });
				}
			} else {
				callback(400, { "Error: ": "A user with that phone exist!" });
			}
		});
	} else {
		callback(400, { "Error: ": "Required fields not completed!" });
	}
};

// Users - PUT

// Ping handler
handlers.ping = function (data, callback) {
	callback(200);
};

// 404 handler
handlers.notFound = function (data, callback) {
	callback(404, { Error: "not found!" });
};

module.exports = handlers;
