const mysql = require("mysql");

// conn.connect((err)=>{
//     if(err) throw err;
//     console.log("DB Connected!")
// })  u index.js

let _ = class DB {
  // static localStorage = [];

  static conn = mysql.createConnection({
    //connectujemo bazu na nas backend
    host: "localhost",
    user: "root",
    password: "Babinababa123!",
    database: "twitter_baza",
  });

  static registerUser(user) {
    if (user) {
      this.conn.query(
        "INSERT INTO user SET usr_id = ?, usr_email = ?, usr_pass = ?, usr_name = ?, usr_birth = ?, usr_handle = ?",
        [
          user.id,
          user.email,
          user.security.passwordHash,
          user.name,
          user.birth,
          user.handle,
        ],
        function (err, results, fields) {
          if (err) throw err;
          //console.log("DB register user", results);
        }
      );
    }
    return false;
  }

  static findUserById(id) {
    return new Promise((resolve, reject) => {
      console.log("U promisu", id);
      if (!id) {
        return reject(new Error("Id not provided"));
      }

      this.conn.query(
        `SELECT * FROM twitter_baza.user WHERE usr_id = ?`,
        [id],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }

          if (results && results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        return reject(new Error("Email not provided"));
      }

      this.conn.query(
        `SELECT * FROM twitter_baza.user WHERE usr_email = ?`,
        [email],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }

          if (results && results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }
};

module.exports = _;
