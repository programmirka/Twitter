const mysql = require("mysql");
const { ErrorTypes } = require("vue-router");

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
    multipleStatements: true,
  });

  static getTweets() {
    return new Promise((resolve, reject) => {
      this.conn.query(
        `SELECT tweet.*, user.usr_name, user.usr_handle,
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
        FROM like_tweet 
        WHERE like_tweet.twt_id = tweet.twt_id) AS twt_likes,
       (SELECT COUNT(*) 
        FROM comment 
        WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = "0") AS twt_comments 
        FROM twitter_baza.tweet
        INNER JOIN user ON user.usr_id = tweet.usr_id
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
        WHERE tweet.twt_deleted = ?
        GROUP BY tweet.twt_id
        ORDER BY tweet.twt_created DESC`,
        [0, 0],
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

  static getTweet(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("Id not provided"));
      }
      this.conn.query(
        `SELECT 
        tweet.*, 
        user.usr_name, 
        user.usr_handle,
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
         FROM like_tweet 
         WHERE like_tweet.twt_id = tweet.twt_id) AS twt_likes,
        (SELECT COUNT(*) 
         FROM comment 
         WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = "0") AS twt_comments 
        FROM twitter_baza.tweet
        INNER JOIN user ON user.usr_id = tweet.usr_id
        WHERE tweet.twt_id = ?
        GROUP BY tweet.twt_id;`,
        [id],
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

  static getProfileTweets(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("Id not provided"));
      }
      this.conn.query(
        `SELECT 
      tweet.*, 
      user.usr_name, 
      user.usr_handle,
      (SELECT COUNT(DISTINCT like_tweet.usr_id) 
         FROM like_tweet 
         WHERE like_tweet.twt_id = tweet.twt_id) AS twt_likes,
      (SELECT COUNT(*) 
        FROM comment 
        WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = "0") AS twt_comments 
      
      FROM twitter_baza.tweet 
  
      INNER JOIN user ON user.usr_id = tweet.usr_id
      AND user.usr_id = ?
          
      LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
      LEFT JOIN comment ON comment.twt_id = tweet.twt_id

      WHERE tweet.twt_deleted = "0"
  
      GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
      ORDER BY tweet.twt_created DESC;`,
        [id],
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

  static getComments(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new Error("Id not provided"));
      }
      this.conn.query(
        `SELECT comment.com_id, user.usr_name, user.usr_handle, 
        comment.usr_id, comment.twt_id, comment.com_content, comment.com_created, 
        comment.com_deleted, 
        COUNT(like_comment.usr_id) as likes_number 
        FROM twitter_baza.comment 
        LEFT JOIN twitter_baza.like_comment ON (twitter_baza.like_comment.com_id = comment.com_id) 
        LEFT JOIN twitter_baza.user ON ( user.usr_id = comment.usr_id) 
        WHERE comment.twt_id = ? AND comment.com_deleted = ?
        GROUP BY comment.com_id 
        ORDER BY comment.com_created 
        DESC`,
        [id, 0], //TODO: moxda mora broj
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
       com_created = now() WHERE comment.com_id = ?`,
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
        `UPDATE tweet SET tweet.twt_content = ?, twt_created = now() WHERE twt_id = ?`,
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
        WHERE tag.tag_name LIKE ?`,
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

  static tweetsByTagIds(tagIdsArray) {
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
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
           FROM like_tweet 
           WHERE like_tweet.twt_id = tweet.twt_id) AS twt_likes,
        (SELECT COUNT(*) 
          FROM comment 
          WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = "0") AS twt_comments 
        
        FROM twitter_baza.tweet 
    
        INNER JOIN user ON user.usr_id = tweet.usr_id
            
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
        LEFT JOIN tweet_tag ON tweet_tag.twt_id = tweet.twt_id
  
        WHERE tweet.twt_deleted = "0" AND tweet_tag.tag_id IN (?)
    
        GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
        ORDER BY tweet.twt_created DESC;`,
        [tagIdsArray],
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

  static tweetsByHandle(handle) {
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
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
           FROM like_tweet 
           WHERE like_tweet.twt_id = tweet.twt_id) AS twt_likes,
        (SELECT COUNT(*) 
          FROM comment 
          WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = "0") AS twt_comments 
        
        FROM twitter_baza.tweet 
    
        INNER JOIN user ON user.usr_id = tweet.usr_id
        AND user.usr_handle LIKE ?
            
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
  
        WHERE tweet.twt_deleted = "0" 
    
        GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
        ORDER BY tweet.twt_created DESC;`,
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
  static tweetsByTweetContentString(term) {
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
        (SELECT COUNT(DISTINCT like_tweet.usr_id) 
           FROM like_tweet 
           WHERE like_tweet.twt_id = tweet.twt_id) AS twt_likes,
        (SELECT COUNT(*) 
          FROM comment 
          WHERE comment.twt_id = tweet.twt_id AND comment.com_deleted = "0") AS twt_comments 
        
        FROM twitter_baza.tweet 
    
        INNER JOIN user ON user.usr_id = tweet.usr_id
            
        LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
        LEFT JOIN comment ON comment.twt_id = tweet.twt_id
  
        WHERE tweet.twt_deleted = "0" AND twt_content LIKE ?
    
        GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
        ORDER BY tweet.twt_created DESC;`,
        ["%" + term + "%"],
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
        `SELECT usr_id, usr_name, usr_handle, COUNT(follower.flw_follower) AS followers_number 
      FROM twitter_baza.user
      LEFT JOIN follower ON (user.usr_id = follower.flw_followee)
      GROUP BY user.usr_id
      ORDER BY followers_number DESC
      LIMIT 3`,
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
        `SELECT usr_id, usr_name, usr_handle, COUNT(follower.flw_follower) AS followers_number 
        FROM twitter_baza.user
        LEFT JOIN follower ON (user.usr_id = follower.flw_followee)
        WHERE user.usr_id != ?
        GROUP BY user.usr_id
        ORDER BY followers_number DESC
        LIMIT 500`,
        [id],
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
        `SELECT tag.tag_id, tag.tag_name, COUNT(tweet_tag.twt_id) AS tweets_number 
        FROM twitter_baza.tag
        LEFT JOIN tweet_tag ON (tag.tag_id = tweet_tag.tag_id)
        GROUP BY tag.tag_id
        ORDER BY tweets_number DESC
        LIMIT 3`,
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
};

module.exports = _;
