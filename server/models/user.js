const utils = require('../lib/hashUtils');
const Model = require('./model');

// Write you user database model methods here

class User extends Model {
  constructor() {
    super('users');
  }

  create(username, password) {
    // let shasum = crypto.createHash('sha1');
    // shasum.update(link.url);
    // link.code = shasum.digest('hex').slice(0, 5);

    var passwordData = utils.saltHashPassword(password);
    // passwordData: {
    //   salt:salt,
    //   passwordHash:value
    // }

    var options = {
      username: username,
      password: passwordData.passwordHash,
      salt: passwordData.salt
    };

    return super.create.call(this, options);
  }

  checkPassword(password, hashPassword, salt){
    var comparePassword = utils.hashPassword(password, salt);
    return comparePassword.passwordHash === hashPassword;
  }
}

module.exports = new User();