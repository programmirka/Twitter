const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const DB = require("./db");
const bcrypt = require("bcrypt");

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

    // if (emailCheck) {
    //   return res.status(400).json({
    //     error: {
    //       code: 400,
    //       type: "emailUsed",
    //       message: "Email is already in use",
    //     },
    //   });
    // }

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

//primer request-a za kojki user mora biti autentifikovan

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

    // if (req.user.id === id)
    //TODO: check in DB.js or user.js if there are some functions for that, just add missing data
    DB.conn.query(
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
      WHERE user.usr_id = ?;`,
      [id],
      function (err, results, fields) {
        if (err) throw err;
        res.json({ data: results });
      }
    );
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
_.get("/follow", requireAuth, async (req, res) => {
  try {
    var id = req.user.id;

    DB.conn.query(
      `SELECT usr_id, usr_name, usr_handle, COUNT(follower.flw_follower) AS followers_number 
      FROM twitter_baza.user
      LEFT JOIN follower ON (user.usr_id = follower.flw_followee)
      WHERE usr_id != ? 
      GROUP BY user.usr_id
      ORDER BY followers_number DESC`,
      [id],
      async function (err, results, fields) {
        if (err) throw err;
        let newArray = [];
        for (var i = 0; i < results.length; i++) {
          if (!(await DB.findFollowers(req.user.id, results[i].usr_id))) {
            newArray.push(results[i]);
          }
        }
        newArray = newArray.slice(0, 3);
        res.json({ data: newArray });
      }
    );
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
