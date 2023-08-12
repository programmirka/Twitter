const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const DB = require("./db");

let _ = express.Router();

const requireAuth = (req, res, next) => {
  console.log("headers:", req.headers);

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
    var id = req.params.id;
    // console.group('\n GET /user -request details:');
    //     // console.log('---------------------- \n')
    //     // console.log('req.body', req.body)
    //     // console.log('req.params', req.params)
    //     // console.log('req.headers', req.headers)
    //     console.log('req.isAuthenticated', req.isAuthenticated())
    console.log("req.user", req.user);
    // console.groupEnd();
    const user = await DB.findUserById(req.user.id);

    if (!user)
      return res.status(404).json({
        timestamp: Date.now(),
        msg: "User not found",
        code: 404,
      });

    // if (req.user.id === id)
    DB.conn.query(
      `SELECT 
      user.usr_id, 
      usr_name, 
      usr_handle, 
      usr_about, 
      usr_joined, 
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

//POST /logout

_.post("/logout", async (req, res, next) => {
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
