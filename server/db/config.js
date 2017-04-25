const Promise = require('bluebird');

module.exports = (db) => {
  if (!db.queryAsync) {
    db = Promise.promisifyAll(db);
  }

  // Create links table
  // NOTE: DOES CODE NEED TO BE UNIQUE?
  return db.queryAsync(`
    CREATE TABLE IF NOT EXISTS links (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      url VARCHAR(255) NOT NULL,
      baseUrl VARCHAR(255) NOT NULL,
      code VARCHAR(5) NOT NULL,
      title VARCHAR(255) NOT NULL,
      visits INT NOT NULL DEFAULT 0,
      timestamp TIMESTAMP
    );`)
    .then(() => {
      // Create clicks table
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS clicks (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          linkId INT NOT NULL,
          timestamp TIMESTAMP
        );`);
    })
    .then(() => {
      // Create user table
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(128) NOT NULL,
          salt VARCHAR(16),
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP          
        );`);
    })
    .then(() => {
      // Create sessions table
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          user_id INT,
          hash VARCHAR(150) UNIQUE       
        );`);
    })
  /************************************************************/
  /*          Add additional schema queries here              */
  /************************************************************/

    .error(err => {
      console.log(err);
    });
};
