/**
 * Create and export config variables
 */

var enviroments = {};

// Staging {default} enviroment
enviroments.staging = {
	"httpPort": 3000,
	"httpsPort": 3001,
	envName: "staging",
};

// Production enviroment
enviroments.production = {
	"httpPort": 5000,
	"httpsPort": 5001,
	envName: "production",
};

// Determine which env was passed as a comand-line argument
var currentEnv =
	typeof process.env.NODE_ENV === "string"
		? process.env.NODE_ENV.toLowerCase()
		: "";

// Check that the curen env is one ow the env above if not default to staging
var envToExport =
	typeof enviroments[currentEnv] === "object"
		? enviroments[currentEnv]
		: enviroments.staging;

// Export the module
module.exports = envToExport;