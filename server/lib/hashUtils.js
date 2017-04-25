const crypto = require('crypto');

/************************************************************/
// Add any hashing utility functions below
/************************************************************/

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var generateSalt = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var hashPassword = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');

    return {
      salt: salt,
      passwordHash: value
    };
};

function saltHashPassword(userpassword) {
    var salt = generateSalt(16); /** Gives us salt of length 16 */
    return hashPassword(userpassword, salt);
}

module.exports.hashPassword = hashPassword;
module.exports.generateSalt = generateSalt;
module.exports.saltHashPassword = saltHashPassword;