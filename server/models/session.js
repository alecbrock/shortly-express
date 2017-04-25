const utils = require('../lib/hashUtils');
const Model = require('./model');

// Write you session database model methods here
class Session extends Model {
  constructor() {
    super('sessions');
  }
  create(req, res) {
    var sessionHash = utils.hashPassword(Math.random().toString(), '');
    // passwordData: {
    //   salt:salt,
    //   passwordHash:value
    // }
    var options = {
      hash: sessionHash.passwordHash,
      'user_agent': req.headers['user-agent'] || null,
    };
    return super.create.call(this, options);
  }
}

module.exports = new Session();
