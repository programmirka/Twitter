const { reject } = require("lodash");
const mysql = require("mysql");
// Učitava MySQL biblioteku, za konekciju sa MySQL bazom podataka.
const { ErrorTypes } = require("vue-router");

// U programiranju, statičke funkcije unutar objekta (ili klase)
// su funkcije koje pripadaju samom objektu ili klasi, a ne instancama
// te klase. To znači da statičke funkcije mogu biti pozvane direktno
// sa imenom klase, ne mogu se pozvati preko instanci klase.

// Ovo je posebno korisno kada želite funkcionalnost koja
// ne zavisi od stanja pojedinačne instance, ali je logično povezana
// sa klasom.

let _ = class DB {
  // static localStorage = [];

  static conn = mysql.createConnection({
    //connectujemo bazu na nas backend
    host: "localhost",
    user: "root",
    password: "Babinababa123!",
    database: "twitter_baza",
    multipleStatements: true,
  });

  static getTweets(limit, offset) {
    return new Promise((resolve, reject) => {
      console.log("U get Tweets u DB.js", limit, offset);
      if (!limit || offset === "undefined") {
        return reject(
          new Error("limit or offset not provided in the getTweets in db.js")
        );
      }
      this.conn.query(
        `SELECT tweet.*, user.usr_name, user.usr_handle, user.usr_profilePic,
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
        FROM like_tweet 
        INNER JOIN user ON like_tweet.usr_id = user.usr_id
        WHERE like_tweet.twt_id = tweet.twt_id AND user.usr_blocked = ?) AS twt_likes,
       (SELECT COUNT(*) 
        FROM comment 
		    INNER JOIN user ON comment.usr_id = user.usr_id
        WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = ? AND user.usr_blocked = ?) AS twt_comments 
        FROM twitter_baza.tweet
        INNER JOIN user ON user.usr_id = tweet.usr_id
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
        WHERE tweet.twt_deleted = ? AND user.usr_blocked = ?
        GROUP BY tweet.twt_id
        ORDER BY tweet.twt_created DESC
        LIMIT ? OFFSET ?`,
        [0, 0, 0, 0, 0, limit, offset],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }

  static getHomeTweets(limit, offset, id) {
    return new Promise((resolve, reject) => {
      console.log("U get HomeTweets u DB.js", limit, offset);
      if (!limit || !id || offset === "undefined") {
        return reject(
          new Error(
            "limit, id or offset not provided in the getHomeTweets in db.js"
          )
        );
      }
      this.conn.query(
        `SELECT tweet.*, user.usr_name, user.usr_handle, user.usr_profilePic,
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
        FROM like_tweet 
        INNER JOIN user ON like_tweet.usr_id = user.usr_id
        WHERE like_tweet.twt_id = tweet.twt_id AND user.usr_blocked = ?) AS twt_likes,
       (SELECT COUNT(*) 
        FROM comment 
		    INNER JOIN user ON comment.usr_id = user.usr_id
        WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = ? AND user.usr_blocked = ?) AS twt_comments 
        FROM twitter_baza.tweet
        INNER JOIN user ON user.usr_id = tweet.usr_id
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
       LEFT JOIN follower ON (follower.flw_follower = tweet.usr_id OR follower.flw_followee = tweet.usr_id)
        WHERE tweet.twt_deleted = ? AND user.usr_blocked = ? AND
        (follower.flw_follower = ?
        OR tweet.usr_id = ?)
        
        GROUP BY tweet.twt_id
        ORDER BY tweet.twt_created DESC
        LIMIT ? OFFSET ?`,
        [0, 0, 0, 0, 0, id, id, limit, offset],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }

  static getTotalHomeTweets(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("id not provided in getTotalHomeTweets"));
      }
      this.conn.query(
        `SELECT tweet.*, user.usr_name, user.usr_handle
        FROM twitter_baza.tweet
        INNER JOIN user ON user.usr_id = tweet.usr_id
        LEFT JOIN follower ON (follower.flw_follower = tweet.usr_id OR follower.flw_followee = tweet.usr_id)
        WHERE tweet.twt_deleted = ?  AND user.usr_blocked = ? AND 
        (follower.flw_follower = ?
        OR tweet.usr_id = ?)
        GROUP BY tweet.twt_id
       `,
        [0, 0, id, id],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results.length);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }

  static getTotalTweets() {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `SELECT tweet.*, user.usr_name, user.usr_handle
        
        FROM twitter_baza.tweet
        INNER JOIN user ON user.usr_id = tweet.usr_id
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
        WHERE tweet.twt_deleted = ?  AND user.usr_blocked = ?
        GROUP BY tweet.twt_id
        ORDER BY tweet.twt_created DESC`,
        [0, 0],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results.length);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }

  static getTweet(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("Id not provided"));
      }
      this.conn.query(
        `SELECT 
        tweet.*, 
        user.usr_name, 
        user.usr_handle, user.usr_profilePic,
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
        FROM like_tweet 
        INNER JOIN user ON like_tweet.usr_id = user.usr_id
        WHERE like_tweet.twt_id = tweet.twt_id AND user.usr_blocked = ?) AS twt_likes,
       (SELECT COUNT(*) 
        FROM comment 
		    INNER JOIN user ON comment.usr_id = user.usr_id
        WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = ? AND user.usr_blocked = ?) AS twt_comments 
        FROM twitter_baza.tweet
        INNER JOIN user ON user.usr_id = tweet.usr_id
        WHERE tweet.twt_id = ?
        GROUP BY tweet.twt_id;`,
        [0, 0, 0, id],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            console.log("results u db get tweet", results);
            resolve(results);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }

  static getProfileTweets(id, limit, offset) {
    return new Promise((resolve, reject) => {
      if (!id || !limit || offset === "undefined") {
        return reject(new Error("Id, limit or offset not provided"));
      }
      this.conn.query(
        `SELECT 
      tweet.*, 
      user.usr_name, 
      user.usr_handle,
      user.usr_profilePic,
      (SELECT COUNT(DISTINCT like_tweet.usr_id) 
      FROM like_tweet 
      INNER JOIN user ON like_tweet.usr_id = user.usr_id
      WHERE like_tweet.twt_id = tweet.twt_id AND user.usr_blocked = ?) AS twt_likes,
     (SELECT COUNT(*) 
      FROM comment 
      INNER JOIN user ON comment.usr_id = user.usr_id
      WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = ? AND user.usr_blocked = ?) AS twt_comments 
      
      FROM twitter_baza.tweet 
  
      INNER JOIN user ON user.usr_id = tweet.usr_id
      AND user.usr_id = ?
          
      LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
      LEFT JOIN comment ON comment.twt_id = tweet.twt_id

      WHERE tweet.twt_deleted = ?  AND user.usr_blocked = ?
  
      GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
      ORDER BY tweet.twt_created DESC
      LIMIT ? OFFSET ?;`,
        [0, 0, 0, id, 0, 0, limit, offset],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }

  static getTotalProfileTweets(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(
          new Error("id not provided in the getTotalProfileTweets")
        );
      }
      this.conn.query(
        `SELECT tweet.*, user.usr_name, user.usr_handle
        FROM twitter_baza.tweet
        INNER JOIN user ON user.usr_id = tweet.usr_id
        AND user.usr_id = ?
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
        WHERE tweet.twt_deleted = ?  AND user.usr_blocked = ?
        GROUP BY tweet.twt_id
        ORDER BY tweet.twt_created DESC`,
        [id, 0, 0],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results.length);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }

  static getComments(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("Id not provided"));
      }
      this.conn.query(
        `SELECT comment.com_id, user.usr_name, user.usr_handle, user.usr_profilePic,
        comment.usr_id, comment.twt_id, comment.com_content, comment.com_created, 
        comment.com_deleted, 
        ( SELECT COUNT(DISTINCT like_comment.usr_id)
        FROM twitter_baza.like_comment
        INNER JOIN user ON like_comment.usr_id = user.usr_id
        WHERE like_comment.com_id = comment.com_id AND user.usr_blocked = ?
        ) AS likes_number 
        FROM twitter_baza.comment 
        LEFT JOIN twitter_baza.like_comment ON (twitter_baza.like_comment.com_id = comment.com_id) 
        LEFT JOIN twitter_baza.user ON ( user.usr_id = comment.usr_id) 
        WHERE comment.twt_id = ? AND comment.com_deleted = ? AND user.usr_blocked = ?
        GROUP BY comment.com_id 
        ORDER BY comment.com_created 
        ASC`,
        [0, id, 0, 0], //TODO: moxda mora broj
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }

  static checkCommentLikes(com_id, usr_id) {
    return new Promise((resolve, reject) => {
      console.log("comment_id u checkCommentLikes", com_id);
      console.log("usr_id u CheckCommentLikes", usr_id);
      if (!com_id || !usr_id) {
        return reject(
          new Error("com_id or usr_id is not provided in checkCommentLikes")
        );
      }
      this.conn.query(
        ` SELECT * FROM twitter_baza.like_comment WHERE com_id = ? AND usr_id = ?
      `,
        [com_id, usr_id],
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

  static deleteComment(com_id, usr_id) {
    return new Promise((resolve, reject) => {
      console.log("comment_id", com_id);
      console.log("usr_id", usr_id);
      if (!com_id || !usr_id) {
        return reject(
          new Error("com_id or usr_id is not provided in deleteComment")
        );
      }
      this.conn.query(
        ` UPDATE twitter_baza.comment SET comment.com_deleted = ? WHERE com_id = ? AND usr_id = ?
      `,
        [1, com_id, usr_id],
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

  static deleteTweet(twt_id) {
    return new Promise((resolve, reject) => {
      if (!twt_id) {
        return reject(new Error("twt_id is not provided in the deleteTweet"));
      }

      this.conn.query(
        `UPDATE twitter_baza.tweet SET tweet.twt_deleted = ? WHERE tweet.twt_id = ?`,
        [1, twt_id],
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

  static checkComCreator(com_id) {
    return new Promise((resolve, reject) => {
      if (!com_id) {
        return reject(
          new Error("com_id is not provided in the checkComCreator")
        );
      }
      this.conn.query(
        `SELECT comment.usr_id FROM comment WHERE com_id = ?`,
        [com_id],
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

  static checkTweetCreator(tweet_id) {
    return new Promise((resolve, reject) => {
      if (!tweet_id) {
        return reject(
          new Error("tweet_id not provided in the checkTweetCreator")
        );
      }

      this.conn.query(
        `SELECT tweet.usr_id FROM tweet WHERE tweet.twt_id = ?`,
        [tweet_id],
        function (err, results, fileds) {
          if (err) {
            reject(err);
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

  static editComment(com_id, com_content) {
    return new Promise((resolve, reject) => {
      if (!com_id || !com_content) {
        return reject(
          new Error("com_id or com_content is not provided in the editComment")
        );
      }
      this.conn.query(
        `UPDATE comment SET com_content = ?,
       com_edited= now() WHERE comment.com_id = ?`,
        [com_content, com_id],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            console.log(results);
            resolve(results);
          } else resolve(null);
        }
      );
    });
  }

  static addTweet(content, id) {
    return new Promise((resolve, reject) => {
      if (!content || !id) {
        return reject(
          new Error("content or id are not provided in the addTweet in db")
        );
      }
      this.conn.query(
        `INSERT INTO twitter_baza.tweet SET tweet.usr_id = ?
      , tweet.twt_content = ?; SELECT last_insert_id()`,
        [id, content],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            console.log(results);
            resolve(results[1][0]["last_insert_id()"]);
          } else resolve(null);
        }
      );
    });
  }

  static addTag(tag_name) {
    return new Promise((resolve, reject) => {
      if (!tag_name) {
        return reject(
          new Error("tag name is not provided in the addTag in db")
        );
      }
      this.conn.query(
        `INSERT INTO twitter_baza.tag SET tag.tag_name = ?; 
        SELECT last_insert_id()`,
        [tag_name],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            console.log(results);
            resolve(results[1][0]["last_insert_id()"]);
          } else resolve(null);
        }
      );
    });
  }

  static deleteTagsfromTweetTag(twt_id, tagArray) {
    return new Promise((resolve, reject) => {
      if (!tagArray || !twt_id) {
        return reject(
          new Error("tagArray is not provided in the deleteTagsfromTweetTag")
        );
      }
      this.conn.query(
        `DELETE FROM twitter_baza.tweet_tag WHERE twt_id = ? AND tag_id IN (?)`,
        [twt_id, tagArray],
        function (err, results, fields) {
          if (err) {
            console.log("error je u queriju za deleteTagsfromTweetTag");
            console.log(this.sql);
            return reject(err);
          }
          if (results && results.length > 0) {
            console.log(results);
            resolve(results[1][0]["last_insert_id()"]);
          } else resolve(null);
        }
      );
    });
  }

  static getTagId(tag_name) {
    return new Promise((resolve, reject) => {
      if (!tag_name) {
        return reject(
          new Error("tag_name is not provided in the getTagId in db")
        );
      }
      this.conn.query(
        `SELECT tag.tag_id FROM twitter_baza.tag WHERE tag.tag_name = ?`,
        [tag_name],
        function (err, results) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            return resolve(results[0].tag_id);
          } else {
            return resolve(null);
          }
        }
      );
    });
  }

  static tagTweetConn(twt_id, tag_id) {
    return new Promise((resolve, reject) => {
      if (!twt_id || !tag_id) {
        return reject(
          new Error("twt_id or tag_id is not provided in the tagTweetConn")
        );
      }
      this.conn.query(
        `INSERT INTO tweet_tag SET tweet_tag.twt_id = ?, tweet_tag.tag_id = ?`,
        [twt_id, tag_id],
        function (err, results) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            return resolve(results[0]);
          } else {
            return resolve(null);
          }
        }
      );
    });
  }

  static checkTagTweetConn(twt_id, tag_id) {
    return new Promise((resolve, reject) => {
      if (!twt_id || !tag_id) {
        return reject(
          new Error("twt_id or tag_id is not provided in the checkTagTweetConn")
        );
      }
      this.conn.query(
        `SELECT * FROM tweet_tag WHERE tweet_tag.twt_id = ? AND tweet_tag.tag_id = ?`,
        [twt_id, tag_id],
        function (err, results) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            return resolve(results[0]);
          } else {
            return resolve(null);
          }
        }
      );
    });
  }

  static editTweet(twt_id, twt_content) {
    return new Promise((resolve, reject) => {
      if (!twt_id || !twt_content) {
        return reject(
          new Error("twt_id or twt_content is not provided in the editTweet")
        );
      }
      this.conn.query(
        `UPDATE tweet SET tweet.twt_content = ?, twt_edited = now() WHERE twt_id = ?`,
        [twt_content, twt_id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static getUser(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("Id not provided"));
      }
      this.conn.query(
        `SELECT 
        user.usr_id, 
        usr_name, 
        usr_handle, 
        usr_about, 
        usr_joined, 
        usr_birth, 
        usr_email,
        usr_pass,
        usr_profilePic,
        usr_admin, usr_blocked,
        (SELECT COUNT(DISTINCT flw_follower) FROM follower WHERE flw_followee = user.usr_id) AS followers,
        (SELECT COUNT(DISTINCT flw_followee) FROM follower WHERE flw_follower = user.usr_id) AS following 
        FROM twitter_baza.user
        WHERE user.usr_id = ?`,
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
        `SELECT usr_about, usr_admin, usr_birth, usr_blocked, usr_email, usr_handle, usr_id, usr_joined, usr_name, usr_profilePic FROM twitter_baza.user WHERE usr_email = ?`,
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

  static findByHandle(handle) {
    return new Promise((resolve, reject) => {
      if (!handle) {
        return reject(new Error("handle not provided"));
      }

      this.conn.query(
        `SELECT usr_about, usr_admin, usr_birth, usr_blocked, usr_email, usr_handle, usr_id, usr_joined, usr_name, usr_profilePic FROM twitter_baza.user WHERE usr_handle = ?`,
        [handle],
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

  static getUserKarma(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("id not provided"));
      }
      console.log("id jeeee", id);
      this.conn.query(
        `SELECT COUNT(like_tweet.usr_id) as total_likes
        FROM twitter_baza.tweet 
        INNER JOIN user ON (tweet.usr_id = user.usr_id)
        LEFT JOIN like_tweet ON (like_tweet.twt_id = tweet.twt_id)
        WHERE tweet.usr_id = ? AND tweet.twt_deleted = "0"
        `,
        [id],
        function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          if (results && results.length > 0) {
            console.log("broj karmaaaaaaaaaaaa", results);
            resolve(results[0]);
          } else {
            resolve(null); // Return null if user not found
          }
        }
      );
    });
  }

  static returnPassViaEmail(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        return reject(
          new Error("email is not provided in the returnPassViaEmail.")
        );
      }
      this.conn.query(
        "SELECT usr_pass FROM twitter_baza.user WHERE usr_email = ?",
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

  static addCommentLikes(com_id, usr_id) {
    return new Promise((resolve, reject) => {
      if (!com_id || !usr_id) {
        return reject(
          new Error("com_id or usr_id is not provided in addCommentLikes")
        );
      }
      this.conn.query(
        `INSERT INTO twitter_baza.like_comment SET com_id = ?, usr_id = ?
      `,
        [com_id, usr_id],
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
  static removeCommentLikes(com_id, usr_id) {
    return new Promise((resolve, reject) => {
      if (!com_id || !usr_id) {
        return reject(
          new Error("com_id or usr_id is not provided in removeCommentLikes")
        );
      }
      this.conn.query(
        `DELETE FROM twitter_baza.like_comment WHERE com_id = ? AND usr_id = ?
      `,
        [com_id, usr_id],
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

  static getTweetLikes(twt_id) {
    return new Promise((resolve, reject) => {
      if (!twt_id) {
        return reject(new Error("twt_id is not provided in the getTweetLikes"));
      }
      this.conn.query(
        `SELECT like_tweet.twt_id, COUNT(DISTINCT like_tweet.usr_id) 
      AS twt_likes FROM twitter_baza.like_tweet WHERE like_tweet.twt_id = ?`,
        [twt_id],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
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

  //return array of tag Ids that inlcude "tag" in the name

  static searchTagsByName(tag) {
    return new Promise((resolve, reject) => {
      if (!tag) {
        return reject(new Error("tag is not provided in the searchTagsByName"));
      }
      this.conn.query(
        `SELECT tag.tag_id FROM twitter_baza.tag
        WHERE tag.tag_name LIKE ?
       `,
        ["%" + tag + "%"],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static getTagIdsFromTweet(twt_id) {
    return new Promise((resolve, reject) => {
      if (!twt_id) {
        return reject(
          new Error("twt_id is not provided in the getTagIdsFromTweet")
        );
      }
      this.conn.query(
        `SELECT tag_id FROM twitter_baza.tweet_tag WHERE twt_id = ?`,
        [twt_id],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static checkUserAdmin(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("id not provided in the checkUserAdmin"));
      }

      this.conn.query(
        `SELECT * FROM twitter_baza.user WHERE user.usr_id = ? AND user.usr_admin = ?`,
        [id, "1"],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
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

  static getAllUsers() {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `SELECT usr_name, usr_id, usr_handle, 
        usr_email, usr_joined, usr_blocked, usr_admin 
        FROM twitter_baza.user `,

        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static getAllUsersWhrName(name) {
    return new Promise((resolve, reject) => {
      if (!name) {
        return reject(new Error("name not provided in the getAllUsersWhrName"));
      }
      this.conn.query(
        `SELECT usr_name, usr_id, usr_handle,  user.usr_profilePic,
        usr_email, usr_joined, usr_blocked, usr_admin 
        FROM twitter_baza.user WHERE user.usr_name LIKE ? `,
        [name + "%"],

        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
  static getAllUsersWhrHandle(handle) {
    return new Promise((resolve, reject) => {
      if (!handle) {
        return reject(
          new Error("handle not provided in the getAllUsersWhrHandle")
        );
      }
      this.conn.query(
        `SELECT usr_name, usr_id, usr_handle,  user.usr_profilePic,
        usr_email, usr_joined, usr_blocked, usr_admin 
        FROM twitter_baza.user WHERE user.usr_handle LIKE ? `,
        [handle + "%"],

        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static getAllUsersWhrEmail(email) {
    return new Promise((resolve, reject) => {
      if (!email) {
        return reject(
          new Error("email not provided in the getAllUsersWhrEmail")
        );
      }
      this.conn.query(
        `SELECT usr_name, usr_id, usr_handle,  user.usr_profilePic,
        usr_email, usr_joined, usr_blocked, usr_admin 
        FROM twitter_baza.user WHERE user.usr_email = ? `,
        [email],

        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
  static getAllUsersWhoBlocked() {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `SELECT usr_name, usr_id, usr_handle,  user.usr_profilePic,
        usr_email, usr_joined, usr_blocked, usr_admin 
        FROM twitter_baza.user WHERE user.usr_blocked = ? `,
        [1],

        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static getAllUsersWhoAdmin() {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `SELECT usr_name, usr_id, usr_handle,  user.usr_profilePic,
        usr_email, usr_joined, usr_blocked, usr_admin 
        FROM twitter_baza.user WHERE user.usr_admin = ? `,
        [1],

        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static switchAdmin(id, usr_admin) {
    return new Promise((resolve, reject) => {
      if (!id || !usr_admin) {
        return reject(
          new Error(
            "id or usr_admin are not provided in the switchAdmin in db.js"
          )
        );
      }

      this.conn.query(
        `UPDATE twitter_baza.user SET user.usr_admin = ? WHERE user.usr_id = ?`,
        [usr_admin, id],

        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
            console.log(this.sql);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static switchBlocked(id, usr_blocked) {
    return new Promise((resolve, reject) => {
      if (!id || !usr_blocked) {
        return reject(
          new Error(
            "id or usr_blocked are not provided in the switchAdmin in db.js"
          )
        );
      }

      this.conn.query(
        `UPDATE twitter_baza.user SET user.usr_blocked = ? WHERE user.usr_id = ?`,
        [usr_blocked, id],

        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
            console.log(this.sql);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static checkUserBlocked(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("id not provided in the checkUserBlocked"));
      }

      this.conn.query(
        `SELECT * FROM twitter_baza.user WHERE user.usr_id = ? AND user.usr_blocked = ?`,
        [id, "1"],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
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

  static tweetsByTagIds(tagIdsArray, limit, offset) {
    return new Promise((resolve, reject) => {
      if (!tagIdsArray) {
        return reject(
          new Error("tagIdsArray is not provided in the tweetsByTagIds")
        );
      }
      this.conn.query(
        `SELECT 
        tweet.*, 
        user.usr_name, 
        user.usr_handle,
        user.usr_profilePic,
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
        FROM like_tweet 
        INNER JOIN user ON like_tweet.usr_id = user.usr_id
        WHERE like_tweet.twt_id = tweet.twt_id AND user.usr_blocked = ?) AS twt_likes,
       (SELECT COUNT(*) 
        FROM comment 
		    INNER JOIN user ON comment.usr_id = user.usr_id
        WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = ? AND user.usr_blocked = ?) AS twt_comments 
        
        FROM twitter_baza.tweet 
    
        INNER JOIN user ON user.usr_id = tweet.usr_id
            
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
        LEFT JOIN tweet_tag ON tweet_tag.twt_id = tweet.twt_id
  
        WHERE tweet.twt_deleted = ? AND tweet_tag.tag_id IN (?) AND user.usr_blocked = ?
    
        GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
        ORDER BY tweet.twt_created DESC
        LIMIT ? OFFSET ?`,
        [0, 0, 0, 0, tagIdsArray, 0, limit, offset],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
  static getTotalTweetsByTagIds(tagIdsArray) {
    return new Promise((resolve, reject) => {
      if (!tagIdsArray) {
        return reject(
          new Error("tagIdsArray is not provided in the getTotalTweetsByTagIds")
        );
      }
      this.conn.query(
        `SELECT 
        tweet.*, 
        user.usr_name, 
        user.usr_handle
        
        FROM twitter_baza.tweet 
    
        INNER JOIN user ON user.usr_id = tweet.usr_id
            
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
        LEFT JOIN tweet_tag ON tweet_tag.twt_id = tweet.twt_id
  
        WHERE tweet.twt_deleted = ? AND tweet_tag.tag_id IN (?) AND user.usr_blocked = ?
    
        GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
        `,
        [0, tagIdsArray, 0],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results.length);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static tweetsByHandle(handle, limit, offset) {
    return new Promise((resolve, reject) => {
      if (!handle) {
        return reject(
          new Error("handle is not provided in the searchHandleByName")
        );
      }
      this.conn.query(
        `SELECT 
        tweet.*, 
        user.usr_name, 
        user.usr_handle,
        user.usr_profilePic,
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
        FROM like_tweet 
        INNER JOIN user ON like_tweet.usr_id = user.usr_id
        WHERE like_tweet.twt_id = tweet.twt_id AND user.usr_blocked = ?) AS twt_likes,
       (SELECT COUNT(*) 
        FROM comment 
		    INNER JOIN user ON comment.usr_id = user.usr_id
        WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = ? AND user.usr_blocked = ?) AS twt_comments 
        
        FROM twitter_baza.tweet 
    
        INNER JOIN user ON user.usr_id = tweet.usr_id
        AND user.usr_handle LIKE ?
            
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
  
        WHERE tweet.twt_deleted = ?  AND user.usr_blocked = ?
    
        GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
        ORDER BY tweet.twt_created DESC
        LIMIT ? OFFSET ?`,
        [0, 0, 0, handle + "%", 0, 0, limit, offset],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static getTotalTweetsByHandle(handle) {
    return new Promise((resolve, reject) => {
      if (!handle) {
        return reject(
          new Error("handle is not provided in the getTotalTweetsByHandle")
        );
      }
      this.conn.query(
        `SELECT 
        tweet.*, 
        user.usr_name, 
        user.usr_handle  
        FROM twitter_baza.tweet 
  
        INNER JOIN user ON user.usr_id = tweet.usr_id
        AND user.usr_handle LIKE ?
            
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
  
        WHERE tweet.twt_deleted = ?  AND user.usr_blocked = ?
    
        GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
      `,
        [handle + "%", 0, 0],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results.length);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static getTotalTweetsByString(term) {
    return new Promise((resolve, reject) => {
      if (!term) {
        return reject(
          new Error("term is not provided in the searchTweetContent")
        );
      }
      this.conn.query(
        `SELECT 
        tweet.*, 
        user.usr_name, 
        user.usr_handle
        
        
        FROM twitter_baza.tweet 
    
        INNER JOIN user ON user.usr_id = tweet.usr_id
            
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
  
        WHERE tweet.twt_deleted = ?  AND user.usr_blocked = ? AND twt_content LIKE ?
    
        GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
      `,
        [0, 0, "%" + term + "%"],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results.length);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static tweetsByTweetContentString(term, limit, offset) {
    return new Promise((resolve, reject) => {
      if (!term) {
        return reject(
          new Error("term is not provided in the searchTweetContent")
        );
      }
      this.conn.query(
        `SELECT 
        tweet.*, 
        user.usr_name, 
        user.usr_handle,
        user.usr_profilePic,
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
        FROM like_tweet 
        INNER JOIN user ON like_tweet.usr_id = user.usr_id
        WHERE like_tweet.twt_id = tweet.twt_id AND user.usr_blocked = ?) AS twt_likes,
       (SELECT COUNT(*) 
        FROM comment 
		    INNER JOIN user ON comment.usr_id = user.usr_id
        WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = ? AND user.usr_blocked = ?) AS twt_comments 
        
        FROM twitter_baza.tweet 
    
        INNER JOIN user ON user.usr_id = tweet.usr_id
            
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
  
        WHERE tweet.twt_deleted = ?  AND user.usr_blocked = ? AND twt_content LIKE ?
    
        GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
        ORDER BY tweet.twt_created DESC
        LIMIT ? OFFSET ?`,
        [0, 0, 0, 0, 0, "%" + term + "%", limit, offset],
        function (err, results, fileds) {
          if (err) {
            resolve(err);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static addComment(twt_id, com_content, usr_id) {
    return new Promise((resolve, reject) => {
      if (!twt_id || !com_content || !usr_id) {
        return reject(
          new Error(
            "twt_id, com_content or usr_id are nor provided at addComent"
          )
        );
      }
      this.conn.query(
        `INSERT INTO twitter_baza.comment SET twt_id = ?, com_content = ?, usr_id = ?`,
        [twt_id, com_content, usr_id],
        function (error, results, fileds) {
          if (error) {
            return reject(error);
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

  //three users for a follow component, with the most followers, descending
  static getFollowThreeUsers() {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `SELECT usr_id, usr_name, usr_handle, usr_profilePic, COUNT(follower.flw_follower) AS followers_number 
      FROM twitter_baza.user
      LEFT JOIN follower ON (user.usr_id = follower.flw_followee)
      WHERE user.usr_blocked = ?
      GROUP BY user.usr_id
      ORDER BY followers_number DESC
      LIMIT 3`,
        [0],
        function (error, results, fileds) {
          if (error) {
            return reject(error);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  //gets list of all followees except Auth user
  static followeeListForAuth(id) {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `SELECT usr_id, usr_name, usr_handle, usr_profilePic, COUNT(follower.flw_follower) AS followers_number 
        FROM twitter_baza.user
        LEFT JOIN follower ON (user.usr_id = follower.flw_followee)
        WHERE user.usr_id != ? AND user.usr_blocked = ?
        GROUP BY user.usr_id
        ORDER BY followers_number DESC
        LIMIT 500`,
        [id, 0],
        function (error, results, fileds) {
          if (error) {
            return reject(error);
          }
          if (results && results.length > 0) {
            resolve(results); //mozda bez 0
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static getTags() {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `SELECT tag.tag_id, tag.tag_name, 
        COUNT(tweet_tag.twt_id) AS tweets_number 
        FROM twitter_baza.tweet
        LEFT JOIN tweet_tag ON (tweet.twt_id = tweet_tag.twt_id)
        LEFT JOIN tag ON (tweet_tag.tag_id = tag.tag_id)
        LEFT JOIN user ON (tweet.usr_id = user.usr_id)
        WHERE tweet.twt_deleted = ? AND user.usr_blocked = ?
        GROUP BY tag.tag_id
        ORDER BY tweets_number DESC
	
        LIMIT 3
        `,
        [0, 0],
        function (error, results, fileds) {
          if (error) {
            return reject(error);
          }
          if (results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
  static uploadPic(id, pic) {
    return new Promise((resolve, reject) => {
      if (!id || !pic) {
        return reject(new Error("id or pic is not provided in the uploadPic"));
      }
      this.conn.query(
        `UPDATE user SET user.usr_profilePic = ? WHERE user.usr_id = ?`,
        [pic, id],
        function (error, results, fileds) {
          if (error) {
            return reject(error);
          }
          if (results && results.length > 0) {
            console.log("results u upload Pic", results);
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static oldProfilePic(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("id is not provided in the oldProfilePic"));
      }
      this.conn.query(
        `SELECT user.usr_profilePic FROM user WHERE user.usr_id = ?`,
        [id],
        function (error, results, fileds) {
          if (error) {
            return reject(error);
          }
          if (results && results.length > 0) {
            console.log("results u upload Pic", results[0].usr_profilePic);
            resolve(results[0].usr_profilePic);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
};

module.exports = _;
