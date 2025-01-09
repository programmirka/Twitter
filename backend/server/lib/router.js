const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const DB = require("./db");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const { async } = require("validate.js");

let _ = express.Router();

const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      timestamp: Date.now(),
      msg: "Access denied",
      code: 403,
    });
  }
};

//kako ne bismo pisali kod za proveru autentifikacije za svaki pojedinacno slucaj,
//pisemo ga izdvojeno i pozivamo za request-ove za koje je ona potrebna

//post /register
_.post("/register", async (req, res) => {
  try {
    const { name, email, password, rePassword, handle, birth } = req.body;
    console.log(name, email, password, rePassword, handle, birth);

    let user = new User();

    //email i handle moraju biti unique

    let emailCheck = await DB.findByEmail(email); //ako nema bice null, a ako ima vraca rez
    console.log(
      " =================== Provera da li email postoji: ",
      emailCheck
    );

    let msg = false; //msg se javlja samo ako imamo neku gresku

    msg = user.setEmail(email);
    if (msg || emailCheck)
      return res.status(400).json({
        error: {
          code: 400,
          type: "email",
          message: msg,
        },
      });

    msg = user.setName(name);
    if (msg) {
      return res.status(400).json({
        error: {
          code: 400,
          type: "first name",
          message: msg,
        },
      });
    }

    console.log(JSON.stringify(DB.findUserById(1)));

    if (password === rePassword) {
      msg = await user.setPassword(password);
      if (msg)
        return res.status(400).json({
          error: {
            code: 400,
            type: "password",
            message: msg,
          },
        });
    }

    user.setBirth(birth);
    user.setHandle(handle);

    user.save();

    res.status(200).json({
      user: user,
    });

    //res.redirect("/tweets");
  } catch (e) {
    res.status(500).json({
      timestamp: Date.now(),
      msg: "Failed to register",
      code: 500,
    });
    throw new Error(e);
  }
});

_.post("/login", (req, res, next) => {
  //next middleware
  console.log(`1. Loggin handler ${JSON.stringify(req.body)}`);
  passport.authenticate(
    "local", //ref. to local strategy we named local, placed in index.js
    (err, user) => {
      console.log(`3. Passport authenticate cb ${JSON.stringify(user)} `);

      if (err) {
        //(e.g., database connection error, server error)
        return res.status(401).json({
          timestamp: Date.now(),
          msg: "Access denied. Username or password is incorrect",
          code: 401, //unauthorized access
        });
      }
      if (!user) {
        //(e.g., incorrect username or password),
        return res.status(401).json({
          timestamp: Date.now(),
          msg: "Unauthorised user",
          code: 401,
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({
          user: user,
        });
      });
    }
  )(req, res, next);
});

//edit profile: primer request-a za kojki user mora biti autentifikovan,
_.get("/profile/:id", requireAuth, async (req, res) => {
  try {
    // console.group('\n GET /user -request details:');
    //     // console.log('---------------------- \n')
    // console.log("req.user", req.user);
    //     // console.log('req.body', req.body)
    //     // console.log('req.params', req.params)
    //     // console.log('req.headers', req.headers)
    //     console.log('req.isAuthenticated', req.isAuthenticated())
    var id = req.params.id;

    const user = await DB.findUserById(req.user.id);

    if (!user)
      return res.status(404).json({
        timestamp: Date.now(),
        msg: "User not found",
        code: 404,
      });

    console.log("u profile/id: ======", user.usr_id, id);

    if (user.usr_id === id) {
      let results = await DB.getUser(id);
      console.log("u profile results", results);

      res.status(200).json({
        data: results,
      });
    }
  } catch (err) {
    console.error(new Error(err.message));
    res.status(500).json({
      timestamp: Date.now(),
      msg: "Failed to get user, internal server error",
      code: 500,
    });
  }
});

///
_.put("/profile/:id", requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Body requesta", req.body);
    const userFront = req.body;
    var name = userFront.name;
    var handle = userFront.handle;
    var about = userFront.about;
    var birthday = userFront.birthday;
    console.log("Birthday Front", birthday);
    var password = userFront.password;
    var rePassword = userFront.rePassword;

    // const userDB = await DB.findUserById(req.user.id);

    let userOld = await DB.findUserById(id);

    let userNew = new User();

    //proveravamo validaciju svih podataka i da li se razlikuje od onog u bazi

    // if (!userDB)
    //   return res.status(404).json({
    //     timestamp: Date.now(),
    //     msg: "User not found",
    //     code: 404,
    //   });

    let msg = false; //msg se javlja samo ako imamo neku gresku
    //ako ime iz reqesta nije isto kao sadasnje ime iz DB
    //nastvaljamo validaciju i ako prodje validaciju userNew za update dobija name

    //TODO: napravi u db.js query za update user-a

    if (userOld.usr_name !== name) {
      msg = userNew.setName(name);
      if (msg) {
        return res.status(400).json({
          error: {
            code: 400,
            type: "first name",
            message: msg,
          },
        });
      }
      await userNew.updateName(id);
    }
    if (password.length > 0) {
      if (password === rePassword) {
        var userNewPassHashed = await bcrypt.hash(password, 10);

        if (userOld.usr_pass !== userNewPassHashed) {
          msg = await userNew.setPassword(password);
          if (msg)
            return res.status(400).json({
              error: {
                code: 400,
                type: "password",
                message: msg,
              },
            });
          await userNew.updatePassword(id);
        }
      }
    }

    if (userOld.usr_about !== about) {
      console.log("User old about", userOld.usr_about);
      msg = userNew.setAbout(about);
      if (msg) {
        return res.status(400).json({
          error: {
            code: 400,
            type: "about",
            message: msg,
          },
        });
      }
      await userNew.updateAbout(id);
    }

    if (userOld.usr_handle !== handle) {
      msg = userNew.setHandle(handle);
      if (msg) {
        return res.status(400).json({
          error: {
            code: 400,
            type: "handle",
            message: msg,
          },
        });
      }
      await userNew.updateHandle(id);
    }

    function month(dateString) {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      return month;
    }
    function year(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      return year;
    }
    function day(dateString) {
      const date = new Date(dateString);
      const day = date.getDate();
      return day;
    }

    var Month = month(userOld.usr_birth);
    var Year = year(userOld.usr_birth);
    var Day = day(userOld.usr_birth);

    let userOldBirthday = Year + "-" + Month + "-" + Day;

    if (userOldBirthday !== birthday) {
      console.log("User old birth", userOldBirthday);
      console.log("User new Birth", birthday);
      userNew.setBirth(birthday);
      await userNew.updateBirthday(id);
    }

    res.status(200).json({
      message: "Successfully updated!",
    });
  } catch (err) {
    console.error(new Error(err.message));
    res.status(500).json({
      timestamp: Date.now(),
      msg: "Failed to get user, internal server error",
      code: 500,
    });
  }
});

_.post("/follow", requireAuth, async (req, res) => {
  try {
    const { follower_id, followee_id } = req.body;
    console.log("Follower and followee ids", follower_id, followee_id);

    //provera da li se ti useri vec prate pa onda, ako se prate ide unfollow
    if (await DB.findFollowers(follower_id, followee_id)) {
      await DB.unfollow(follower_id, followee_id);
      console.log("Unfollow");
      res.status(200).json({
        message: "Successfull unfollow",
        data: "unfollow",
      });
    } else {
      await DB.follow(follower_id, followee_id);
      console.log("Follow");
      res.status(200).json({
        message: "Successfull follow",
        data: "follow",
      });
    }

    // res.status(200).json({
    //   message: "Successfull follow/unfollow",
    // });
  } catch (err) {
    console.error(new Error(err.message));
  }
});

//check if followers(because of the follow / unfollow btn on the profile)
_.put("/follow", requireAuth, async (req, res) => {
  try {
    const { follower_id, followee_id } = req.body;
    console.log(
      "GET Follow: Follower and followee ids",
      follower_id,
      followee_id
    );

    let result = null;

    if (await DB.findFollowers(follower_id, followee_id)) {
      res.status(200).json({
        data: "followers",
      });
    } else {
      res.status(200).json({
        data: "notFollowers",
      });
    }
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.post("/like", requireAuth, async (req, res) => {
  try {
    const { twt_id, usr_id } = req.body;
    console.log(twt_id, usr_id);
    if (await DB.checkTweetLikes(twt_id, usr_id)) {
      await DB.removeTweetLikes(twt_id, usr_id);
      res.status(200).json({
        message: "Like has been removed from tweet",
        data: "dislike",
      });
    } else {
      await DB.addTweetLikes(twt_id, usr_id);
      res.status(200).json({
        message: "Like has been added to the tweet",
        data: "like",
      });
    }
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.post("/comment_like", requireAuth, async (req, res) => {
  try {
    const { com_id, usr_id } = req.body;
    console.log("u post comment like u router-u", com_id, usr_id);
    if (await DB.checkCommentLikes(com_id, usr_id)) {
      await DB.removeCommentLikes(com_id, usr_id);
      res.status(200).json({
        message: "Like has been removed from tweet",
        data: "dislike",
      });
    } else {
      await DB.addCommentLikes(com_id, usr_id);
      res.status(200).json({
        message: "Like has been added to the tweet",
        data: "like",
      });
    }
  } catch (err) {
    console.error(new Error(err.message));
  }
});

//drugi get like-ova je za ulogovanog gde je razlika sto u isto vreme proverava
//i da li ulogovana osaba vec lajkuje dati tweet
//ukoliko lajkuje saljemo u res.json neku potvrdu tipa data za br lajkova a messsage
// da kaze da li lajkuje vec ili ne(u odnosu na to ikonica je puna ili prazna)

//kada kliknemo probacu sa plus plus ili minus minus
//a ako to ne radi onda sa novim upitom u bazu

_.post("/comment", requireAuth, async (req, res) => {
  try {
    const { twt_id, com_content, usr_id } = req.body;
    console.log("comment req body", twt_id, com_content, usr_id);
    let results = await DB.addComment(twt_id, com_content, usr_id);
    res.status(200).json({
      message: "Successfully added comment",
      data: results,
    });
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.post("/tweet", requireAuth, async (req, res) => {
  try {
    const { twt_content } = req.body;

    const regex = /(?:^|\s)(#\w+)/g;
    let match;
    const tags = [];

    while ((match = regex.exec(twt_content)) !== null) {
      // Remove the # from the hashtag and add it to the array
      tags.push(match[1].slice(1));
    }

    let twt_id = await DB.addTweet(twt_content, req.user.id);

    var tag_ids = [];
    if (tags.length) {
      for (var i = 0; i < tags.length; i++) {
        if (tags[i].length) {
          var tagExistanceCheck = await DB.getTagId(tags[i]);
          if (tagExistanceCheck) {
            tag_ids.push(tagExistanceCheck);
            continue;
          }
        }
        tag_ids.push(await DB.addTag(tags[i]));
      }
    } else {
      res.status(200).json({
        message: "Successfully added tweet",
      });
    }

    if (tag_ids.length) {
      for (var i = 0; i < tag_ids.length; i++) {
        console.log("checking if twt_id and tag id exist", twt_id, tag_ids[i]);
        if (await DB.checkTagTweetConn(twt_id, tag_ids[i])) {
          //avoiding duplication
          continue;
        } else {
          await DB.tagTweetConn(twt_id, tag_ids[i]);
        }
      }
      res.status(200).json({
        message: "Successfully added tweet and tags",
      });
    }
  } catch (err) {
    console.error(new Error(err.message));
  }
});

//com_id, usr_id( da je jednak req.user.id) - zapravo menjam bazu, ne brisem stavljam da je
//komentar obrisan mna true
_.delete("/comment/:id", requireAuth, async (req, res) => {
  try {
    //delete nema body kao i GET
    var com_id = req.params.id;

    var com_creator = await DB.checkComCreator(com_id);
    let results = null;

    let admin = await DB.checkUserAdmin(req.user.id);

    if (req.user.id === com_creator.usr_id || admin) {
      results = await DB.deleteComment(com_id, com_creator.usr_id);
    } else {
      return res.status(401).json({
        timestamp: Date.now(),
        msg: "Unauthorised user",
        code: 401,
      });
    }
    res.status(200).json({
      message: "Successfully deleted comment",
      data: results,
    });
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.get("/tweets/home", requireAuth, async function (req, res) {
  //request handler f-ja,  argumenti i telo(body) f-je
  var limit = parseInt(req.query._limit) || 10;
  var page = parseInt(req.query._page) || 1;
  console.log("limit and page", limit, page);
  var offset = (page - 1) * limit;
  console.log("offset", offset);
  var totalTweets = null;

  console.log("limit", limit, "page", page);

  var results = null;

  results = await DB.getHomeTweets(limit, offset, req.user.id);
  totalTweets = await DB.getTotalHomeTweets(req.user.id);
  console.log("totalTweets:", totalTweets);

  if (results) {
    for (var i = 0; i < results.length; i++) {
      if (await DB.checkTweetLikes(results[i].twt_id, req.user.id)) {
        results[i].twt_liked = true;
      } else {
        results[i].twt_liked = false;
      }
    }
  }

  res.setHeader("x-total-count", totalTweets);

  res.status(200).json({
    data: results,
  });
});

_.delete("/tweet/:id", requireAuth, async (req, res) => {
  try {
    var tweet_id = req.params.id;
    var results = null;

    var tweet_creator = await DB.checkTweetCreator(tweet_id);

    let admin = await DB.checkUserAdmin(req.user.id);
    console.log("admin **************", admin);

    if (tweet_creator.usr_id === req.user.id || admin) {
      results = await DB.deleteTweet(tweet_id);
    } else {
      return res.status(401).json({
        timestamp: Date.now(),
        msg: "Unauthorised user",
        code: 401,
      });
    }

    res.status(200).json({
      message: "Successfully deleted comment",
      data: results,
    });
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.put("/tweet", requireAuth, async (req, res) => {
  try {
    var { twt_id, twt_content } = req.body;
    var results = null;

    console.log("twt_id u tweet put u router-u", twt_id);

    var tweet_creator = await DB.checkTweetCreator(twt_id);

    if (tweet_creator.usr_id === req.user.id) {
      var tag_ids_old_raw = await DB.getTagIdsFromTweet(twt_id);
      var tag_ids_old = []; //tag ids before the tweet was edited

      if (tag_ids_old_raw) {
        for (var i = 0; i < tag_ids_old_raw.length; i++) {
          tag_ids_old.push(tag_ids_old_raw[i].tag_id);
        }
      }
      console.log("Da li ispise?");

      const regex = /(?:^|\s)(#\w+)/g;
      let match;
      const tags = []; //all tags from edited tweet in strings

      while ((match = regex.exec(twt_content)) !== null) {
        // Remove the # from the hashtag and add it to the array
        tags.push(match[1].slice(1));
      }

      var tag_ids_new = []; // all tags from edited tweet in ids

      console.log("Da li ispise? 2");
      if (tags) {
        console.log("Da li ispise? 3");
        for (var i = 0; i < tags.length; i++) {
          if (tags[i].length) {
            var tagExistanceCheck = await DB.getTagId(tags[i]);
            if (tagExistanceCheck) {
              // if tag exists ad id of that tag
              tag_ids_new.push(tagExistanceCheck);
              continue;
            }
          }
          tag_ids_new.push(await DB.addTag(tags[i]));
          //if tag doesn't exist add id of newly added tag
        }

        console.log("tag_ids_old", tag_ids_old);
        console.log("tag_ids_new", tag_ids_new);

        if (tag_ids_old) {
          //tag ids before the tweet was edited
          var filtered_tags_old = tag_ids_old.filter((oldTag) => {
            return !tag_ids_new.some((newTag) => oldTag === newTag);
          });

          //filtered_tags_old - old tags that don't exist anymore after edit
          //checking if some of old tags are deleted to remove them from
          //tweet_tag table

          if (filtered_tags_old.length) {
            await DB.deleteTagsfromTweetTag(twt_id, filtered_tags_old);
          }
        }

        if (tag_ids_new) {
          // all tags from new edited tweet in ids
          var filtered_tags_new = tag_ids_new.filter((newTag) => {
            return !tag_ids_old.some((oldTag) => oldTag === newTag);
            //filtered_tags_new - new tags that didn't exist before edit
          });

          if (filtered_tags_new.length) {
            for (var i = 0; i < filtered_tags_new.length; i++) {
              console.log(
                "checking if twt_id and tag id exist",
                twt_id,
                filtered_tags_new
              );
              if (await DB.checkTagTweetConn(twt_id, filtered_tags_new[i])) {
                continue;
                //avoiding duplication, e.g. when during edit someone enters same tag more times
              } else {
                await DB.tagTweetConn(twt_id, filtered_tags_new[i]);
                // in case the connection doesn't exist already, add connection
                //in tweet_tag table
              }
            }
          }
        }

        results = await DB.editTweet(twt_id, twt_content);

        //plus treba da proverim u trenutnom tweet-u koje tagove vec imamo pre promene
        //      stari tagIds =    (DB.getTagIdFromTweet(twt_id))
        //tagove koji su dodati da dodamo i povezemo i one koji su izbrisani da izbrisemo
        //
        // niz novih id-jeva dobijamo tako sto prvo
        //niz starih poredimo:
        // - polako izbacujemo ono sto ima i u njemu i u novom
        // - ono sto ostane u staroj je izbrisano znaci treba da ibacimo iz tabele tweet_tag
        // - ono sto nema u staroj a ima u novoj listi:
        //                      -  dodajemo u tag tabelu ako vec ne postoji
        //                      - i svakako dodajemo u tweet_tag tabelu
      } else {
        return res.status(401).json({
          timestamp: Date.now(),
          msg: "Unauthorized user",
          code: 401,
        });
      }

      res.status(200).json({
        message: "Successfully deleted comment",
        data: results,
      });
    }
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.put("/comment", requireAuth, async (req, res) => {
  try {
    var { com_id, com_content } = req.body;

    var com_creator = await DB.checkComCreator(com_id);
    let results = null;

    //menjam com_content i com_created
    if (req.user.id === com_creator.usr_id) {
      results = await DB.editComment(com_id, com_content);
    } else {
      return res.status(401).json({
        timestamp: Date.now(),
        msg: "Unauthorised user",
        code: 401,
      });
    }
    res.status(200).json({
      message: "Successfully deleted comment",
      data: results,
    });
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.get("/search/:term", requireAuth, async (req, res) => {
  try {
    var search_term = req.params.term;
    var limit = parseInt(req.query._limit) || 10;
    var page = parseInt(req.query._page) || 1;
    var offset = (page - 1) * limit;
    var totalTweets = null;
    var term = null;

    console.log("search_term untrimmed:", search_term);
    //check if I need to trim the term
    let results = [];
    if (search_term.length) {
      if (search_term.indexOf("#") === 0) {
        //znaci da je tag
        term = search_term.slice(1);
        console.log(limit, offset);
        var tagIdsArrayRaw = await DB.searchTagsByName(term);
        var tagIdsArray = [];
        if (tagIdsArrayRaw) {
          for (var i = 0; i < tagIdsArrayRaw.length; i++) {
            tagIdsArray.push(tagIdsArrayRaw[i].tag_id);
          }
        }
        console.log("TagIds Array", tagIdsArray);
        if (tagIdsArray.length) {
          console.log("is it happening?");
          results = await DB.tweetsByTagIds(tagIdsArray, limit, offset);
          console.log("tweets with tag/s", results);
          totalTweets = await DB.getTotalTweetsByTagIds(tagIdsArray);
        }
      }
      if (search_term.indexOf("@") === 0) {
        //znaci da je handle
        term = search_term.slice(1);
        results = await DB.tweetsByHandle(term, limit, offset);
        totalTweets = await DB.getTotalTweetsByHandle(term);
      } else if (results.length === 0) {
        //string
        console.log("is else happening?");
        results = await DB.tweetsByTweetContentString(
          search_term,
          limit,
          offset
        );
        totalTweets = await DB.getTotalTweetsByString(search_term);
      }
    }

    if (results) {
      for (var i = 0; i < results.length; i++) {
        if (await DB.checkTweetLikes(results[i].twt_id, req.user.id)) {
          results[i].twt_liked = true;
        } else {
          results[i].twt_liked = false;
        }
      }
    }

    res.setHeader("x-total-count", totalTweets);

    res.status(200).json({
      message: "Successfully completed search",
      data: results,
    });
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.get("/admin/users", requireAuth, async (req, res) => {
  try {
    if (await DB.checkUserAdmin(req.user.id)) {
      let results = await DB.getAllUsers();

      res.status(200).json({
        message: "Successfully loaded all users for Admin Panel",
        data: results,
      });
    } else {
      return res.status(401).json({
        timestamp: Date.now(),
        msg: "Unauthorised user",
        code: 401,
      });
    }
  } catch (err) {
    console.error(new Error(err.message));
  }
});

//searching throughout users
_.get("/admin/search/:term", requireAuth, async (req, res) => {
  try {
    var search_term = req.params.term;
    var term = null;

    if (await DB.checkUserAdmin(req.user.id)) {
      let results = [];

      if (search_term.length) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isEmailValid = emailRegex.test(search_term);
        console.log("is email valid", isEmailValid);

        if (isEmailValid) {
          results = await DB.getAllUsersWhrEmail(search_term);
          console.log(results);
        } else if (search_term.indexOf("@") === 0) {
          term = search_term.slice(1);
          results = await DB.getAllUsersWhrHandle(term);
        } else if (search_term.toLowerCase() === "blocked") {
          results = await DB.getAllUsersWhoBlocked();
        } else if (search_term.toLowerCase() === "admin") {
          results = await DB.getAllUsersWhoAdmin();
        } else {
          results = await DB.getAllUsersWhrName(search_term);
        }
      }

      res.status(200).json({
        message: "Successfully loaded specific user in Admin Panel",
        data: results,
      });
    } else {
      return res.status(401).json({
        timestamp: Date.now(),
        msg: "Unauthorised user",
        code: 401,
      });
    }
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.put("/admin/admin", requireAuth, async (req, res) => {
  try {
    var id = req.body.id;
    let results = null;
    let usr_admin = null;
    console.log("id u admin put: ", id);
    if (await DB.checkUserAdmin(req.user.id)) {
      let isAdmin = await DB.checkUserAdmin(id);
      if (isAdmin) {
        console.log("is happening");
        usr_admin = "0";
        results = await DB.switchAdmin(id, usr_admin);
      } else {
        usr_admin = "1";
        results = await DB.switchAdmin(id, usr_admin);
        console.log("is happening 2", results);
      }

      res.status(200).json({
        message: "Successfully chnaged Admin status",
        data: results,
      });
    } else {
      return res.status(401).json({
        timestamp: Date.now(),
        msg: "Unauthorised user",
        code: 401,
      });
    }
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.put("/admin/block", requireAuth, async (req, res) => {
  try {
    var id = req.body.id;
    let results = null;
    let usr_blocked = null;
    console.log("id u block put: ", id);
    if (await DB.checkUserAdmin(req.user.id)) {
      let isAdmin = await DB.checkUserBlocked(id);
      if (isAdmin) {
        usr_blocked = "0";
      } else {
        usr_blocked = "1";
      }
      results = await DB.switchBlocked(id, usr_blocked);

      res.status(200).json({
        message: "Successfully chnaged Admin status",
        data: results,
      });
    } else {
      return res.status(401).json({
        timestamp: Date.now(),
        msg: "Unauthorised user",
        code: 401,
      });
    }
  } catch (err) {
    console.error(new Error(err.message));
  }
});
//POST /logout

_.post("/logout", async (req, res, next) => {
  console.log("LOGOUT");
  try {
    req.session = null;

    res.redirect("/");
  } catch (e) {
    throw new Error(e);
  }
});

_.post("/uploadProfileImage", requireAuth, async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    console.log(" Check if files are received", req.files); // Check if files are received

    const profileImage = req.files.profileImage;
    const userId = req.body.userId; // Assuming you send userId along with the file
    if (userId !== req.user.id) {
      return res.status(401).send("Unauthorised user.");
    }
    let oldProfilePic = await DB.oldProfilePic(userId);

    if (oldProfilePic !== "default.jpg") {
      const oldProfileImagePath = path.join(
        __dirname,
        "../images",
        oldProfilePic
      );
      fs.unlink(oldProfileImagePath, (err) => {
        if (err) {
          console.error(`Failed to delete old profile image: ${err}`);
        } else {
          console.log("Successfully deleted old profile image");
        }
      });
    }

    let uploadingPic = await DB.uploadPic(userId, profileImage.name);

    const uploadPath = path.join(__dirname, "../images", profileImage.name);
    console.log(`Attempting to save to ${uploadPath}`); // Log the path to check
    profileImage.mv(uploadPath, (err) => {
      if (err) {
        console.log(err); // Log the error
        return res.status(500).send(err);
      }
    });

    res.status(200).json({
      message: "File uploaded and database updated successfully",
      data: profileImage.name,
    });
  } catch (err) {
    console.error(new Error(err.message));
  }
});
//handlujemo sve metode na svim ostali putanjama koje nisu definisane ovde, kako bi neko preko puta mogao da dobije bolji odgovor
_.all("*", async (req, res) => {
  try {
    res.status(404).json({
      timestamp: Date.now(),
      msg: "no route matches your request",
      code: 404,
    });
  } catch (e) {
    throw new Error(e);
  }
});

module.exports = _; //exportovali smo express router server kako bi ga povezali sa index.js
