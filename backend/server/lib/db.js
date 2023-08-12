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
  static updateUserName(name, id) {
    return new Promise((resolve, reject) => {
      if (!name || !id) {
        return reject(new Error("name not provided"));
      }

      this.conn.query(
        `UPDATE twitter_baza.user SET usr_name = ? WHERE usr_id = ?`,
        [name, id],
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
  static updateUserPassword(Password, id) {
    return new Promise((resolve, reject) => {
      if (!Password || !id) {
        return reject(new Error("Password or id not provided"));
      }

      this.conn.query(
        `UPDATE twitter_baza.user SET usr_pass = ? WHERE usr_id = ?`,
        [Password, id],
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
  static updateUserBirthday(Birthday, id) {
    return new Promise((resolve, reject) => {
      if (!Birthday || !id) {
        return reject(new Error("Birthday or id not provided"));
      }

      this.conn.query(
        `UPDATE twitter_baza.user SET usr_birth = ? WHERE usr_id = ?`,
        [Birthday, id],
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
  static updateUserHandle(Handle, id) {
    return new Promise((resolve, reject) => {
      if (!Handle || !id) {
        return reject(new Error("Handle or id not provided"));
      }

      this.conn.query(
        `UPDATE twitter_baza.user SET usr_handle = ? WHERE usr_id = ?`,
        [Handle, id],
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
  static updateUserAbout(About, id) {
    return new Promise((resolve, reject) => {
      if (!About || !id) {
        return reject(new Error("About or id not provided"));
      }

      this.conn.query(
        `UPDATE twitter_baza.user SET usr_about = ? WHERE usr_id = ?`,
        [About, id],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }

          if (results && results.length > 0) {
            resolve(results[0]);
            console.log("User about changed", resolve);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }

  static follow(follower_id, followee_id) {
    return new Promise((resolve, reject) => {
      if (!followee_id || !follower_id) {
        return reject(new Error("Follower_id or Followee_id not provided"));
      }
      this.conn.query(
        `INSERT INTO twitter_baza.follower SET flw_followee = ?, flw_follower = ?`,
        [followee_id, follower_id],
        function (err, results, fileds) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results[0]);
            console.log("Follow finished", resolve);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }
  static unfollow(follower_id, followee_id) {
    return new Promise((resolve, reject) => {
      if (!followee_id || !follower_id) {
        return reject(new Error("Follower_id or Followee_id not provided"));
      }
      this.conn.query(
        `DELETE FROM twitter_baza.follower WHERE flw_followee = ? AND flw_follower = ?`,
        [followee_id, follower_id],
        function (err, results, fileds) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results[0]);
            console.log("Unfollow finished", resolve);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }
  static findFollowers(follower_id, followee_id) {
    return new Promise((resolve, reject) => {
      if (!followee_id || !follower_id) {
        return reject(new Error("Follower_id or Followee_id not provided"));
      }
      this.conn.query(
        `SELECT * FROM twitter_baza.follower WHERE flw_followee = ? AND flw_follower = ?`,
        [followee_id, follower_id],
        function (err, results, fileds) {
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

  static addTweetLikes(twt_id, usr_id) {
    return new Promise((resolve, reject) => {
      if (!twt_id || !usr_id) {
        return reject(
          new Error("twt_id or usr_id is not provided in addTweetLikes")
        );
      }
      this.conn.query(
        `INSERT INTO twitter_baza.like_tweet SET twt_id = ?, usr_id = ?
      `,
        [twt_id, usr_id],
        function (err, results, fileds) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
  static removeTweetLikes(twt_id, usr_id) {
    return new Promise((resolve, reject) => {
      if (!twt_id || !usr_id) {
        return reject(
          new Error("twt_id or usr_id is not provided in removeTweetLikes")
        );
      }
      this.conn.query(
        `DELETE FROM twitter_baza.like_tweet WHERE twt_id = ? AND usr_id = ?
      `,
        [twt_id, usr_id],
        function (err, results, fileds) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static checkTweetLikes(twt_id, usr_id) {
    return new Promise((resolve, reject) => {
      if (!twt_id || !usr_id) {
        return reject(
          new Error("twt_id or usr_id is not provided in checkTweetLikes")
        );
      }
      this.conn.query(
        ` SELECT * FROM twitter_baza.like_tweet WHERE twt_id = ? AND usr_id = ?
      `,
        [twt_id, usr_id],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
};

module.exports = _;
