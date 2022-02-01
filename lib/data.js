/**
 * Library for storing and editing data
 */

const fs = require("fs");
const path = require("path");

// Container for the module
let lib = {};

// Define base dir for data
lib.baseDir = path.join(__dirname, "/../.data/");
console.log(lib.baseDir )

// Write data to a file
lib.create = function (dir, filename, data, callback) {
	// Open file for writing
	fs.open(lib.baseDir + dir + "/" + filename + ".json", "wx", function (err, fileDescriptor) {
		if (!err && fileDescriptor) {
			// Convert to string
			const stringData = JSON.stringify(data);

			// Write to file and close it
			fs.writeFile(fileDescriptor, stringData, function (err) {
				if (!err) {
					fs.close(fileDescriptor, function (err) {
						if (!err) {
							callback(false);
						} else {
							callback("Error closing file!");
						}
					});
				} else {
					callback("Error writing!");
				}
			});
		} else {
			callback("Could not create new file it may allrety exist!");
		}
	});
};

// Read data from a file
lib.read = function (dir, filename, callback) {
	fs.readFile(lib.baseDir + dir + "/" + filename + ".json", "utf8", function (err, data) {
		callback(err, data);
	});
};

// Update data
lib.update = function (dir, filename, data, callback) {
	// Open the file for writing
	fs.open(lib.baseDir + dir + "/" + filename + ".json", "r+", function (err, fileDescriptor) {
		if (!err && fileDescriptor) {
			// Convert data to string
			const stringData = JSON.stringify(data);

			// Truncate the file
			fs.ftruncate(fileDescriptor, function (err) {
				if (!err) {
					// Write to file and close it
					fs.writeFile(fileDescriptor, stringData, function (err) {
						if (!err) {
							fs.close(fileDescriptor, function (err) {
								if (!err) {
									callback(false);
								} else {
									callback("Error closing file!");
								}
							});
						} else {
							callback("Error updating file!");
						}
					});
				} else {
					callback("Error truncating file!");
				}
			});
		} else {
		}
	});
};

lib.delete = function (dir, filename, callback) {
	// Unlinking = remove from fs
	fs.unlink(lib.baseDir + dir + "/" + filename + ".json", function (err) {
		if (!err) {
			callback(false);
		} else {
			callback("Error deleting file");
		}
	});
};

// Export
module.exports = lib;
