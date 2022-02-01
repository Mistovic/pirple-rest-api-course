/**
 * Heleprs for variuos tasks
 */

// Dependencies
const crypto = require("crypto");
const config = require("../config");

// Container for all helpers
let helpers = {};

// Hashing helper
helpers.hash = (str) => {
	if (typeof str == "string" && str.length > 0) {
		// Determin how to hash
		let hash = crypto.createHmac("sha256", config.hashingSecret).update(str).digest("hex");
		return hash;
	} else {
		return false;
	}
};

// Parse a JSON string to an object in all cases
helpers.parseToJson = (str) => {
	console.log("Parse to JSON: ",str)
	try {
		let obj = JSON.parse(str);
		return obj;
	} catch (e) {
		return {};
	}
};

// Export
module.exports = helpers;
