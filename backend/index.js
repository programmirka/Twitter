const mysql = require("mysql");
const express = require("express"); //importovali smo express paket
const router = require("./server/lib/router"); //importovali smo router
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieSession = require("cookie-session");
const DB = require("./server/lib/db");
const bcrypt = require("bcrypt");
const { reject } = require("lodash");
var cors = require("cors");

const app = express(); //inicijalizacija  express servera pod const-antom app
const port = 3000; //damo port na kom ce server da slusa

let _ = {}; //inicijalizacija objekta kome mozemo da asajnujemo f-je

_.start = () => {
  try {
    app.listen(port, function () {
      console.log("Server is running");
    });
  } catch (e) {
    throw new Error(e);
  }
};

app.use(
  cookieSession({
    //bitan je redolsed middlewear-a
    name: "app-auth",
    keys: ["secret-new", "secret-old"],
    maxAge: 60 * 60 * 24 * 1000, //for 1 day
    path: "/",
  })
);

app.use(express.json()); //da mozemo da citamo json

const origin = "http://localhost:5173";

app.use(
  cors({
    origin,
    credentials: true,
  })
);

app.use(passport.initialize()); //passport je inicijalizovan i registrovan kao middlewear za nas api
//(koji god request da prodje kroz api proci ce i kroz passport)

app.use(passport.session());

passport.serializeUser((user, done) => {
  //serializeUser f-ja stavlja info u cookie
  console.log(`4. Serialize user: ${JSON.stringify(user.usr_id)}`);
  return done(null, user.usr_id); //storujemo user id u session cookie koji se salje frontend-u pod svojim id-em, jer nam je to dovoljno, a u isto vreme
  //na client strani se ne vide osetljive informacije o user-u koje se mogu zloupotrebiti jer su vidljive svima
});

passport.deserializeUser(async (id, done) => {
  //deserializeUser f-ja uzima info iz cookie-a
  console.log(`Deserializing user: ${id}`);
  const user = await DB.findUserById(id);

  if (user) {
    return done(null, { id: user.usr_id, email: user.usr_email }); //id i email  - dostupno posle pod req.user
  } else {
    return done(new Error("No user with id is found"));
  }
});

//deserializeUser sluzi kao middlwear f-ja kja uzima info o user-u iz cookie-ja (uglavnom id) tj. iz serializeUser f-je,
// (kako ne bismo za svaki api request slali upit u bazu da uradi verifikaciju i autentifikaciju user-a)
//sa tim id-jem, pretrazi DB jednom kako bi povratila user-a, i povuce sve druge info o user-u koje ce biti dostupne daljim
// downstream request Handler f-ma, tako sto ce one da se pozovu na request.user object

passport.use(
  "local",
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      console.log(`2. Local strategy verify cb:  ${JSON.stringify(username)}`);
      //radimo verifikaciju user-a, proveravamo prvo da li postoji email u bazi
      //pa posle poredimo datu lozinku sa lozinkom iz baze
      let user = await DB.findByEmail(username);

      if (!user) {
        return done(null, false);
      }
      //Comparing incoming password to stored password
      //using bcrypt

      const result = await new Promise((resolve, reject) => {
        bcrypt.compare(password, user.usr_pass, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      });

      // console.log(`result:  ${result}`); result vraca true ili false - password-i se poklapaju ili ne

      if (result) {
        return done(null, user);
      } else {
        return done(
          "Password or username is incorrect. Please try again",
          null
        );
      }
    }
  )
);

DB.conn.connect((err) => {
  if (err) throw err;
  console.log("DB Connected!");
});

app.use("/api", router); //svaki request sto bude dosao do /api rute, bice prebacen na router i na relevantni path tamo

app.get("/", (req, res) => {
  res.json({ Message: "Hellooo!", code: 200 });
});

// /tweets
// /tweets

//dovlaci tweet-ove za explore, home i za profile view(ako je poslat id param)

app.get("/tweets/:id?", async function (req, res) {
  //request handler f-ja,  argumenti i telo(body) f-je
  var id = req.params.id;

  var results = null;

  if (id !== "undefined") {
    results = await DB.getProfileTweets(id);
  } else {
    results = await DB.getTweets();
  }

  if (req.isAuthenticated()) {
    if (results) {
      for (var i = 0; i < results.length; i++) {
        if (await DB.checkTweetLikes(results[i].twt_id, req.user.id)) {
          results[i].twt_liked = true;
        } else {
          results[i].twt_liked = false;
        }
      }
    }
  }

  res.status(200).json({
    data: results,
  });
});

app.get("/tweet/:id", async (req, res) => {
  var id = req.params.id;
  console.log("tweet id", id);

  let results = await DB.getTweet(id);
  console.log("results u index get tweet", results);

  if (req.isAuthenticated()) {
    for (var i = 0; i < results.length; i++) {
      if (await DB.checkTweetLikes(results[i].twt_id, req.user.id)) {
        results[i].twt_liked = true;
      } else {
        results[i].twt_liked = false;
      }
    }
  }

  res.status(200).json({
    data: results,
  });
});

//TweetLikes
app.get("/like/:id", async (req, res) => {
  try {
    let twt_id = req.params.id;
    let results = await DB.getTweetLikes(twt_id);
    console.log("tweet data likes", results);
    res.status(200).json({
      data: results,
    });
  } catch (err) {
    console.error(new Error(err.message));
  }
});

app.get("/comments/:id", async (req, res) => {
  var id = req.params.id;

  let results = await DB.getComments(id);

  if (req.isAuthenticated()) {
    if (results) {
      for (var i = 0; i < results.length; i++) {
        console.log("com id u index.js", results[i].com_id);
        console.log("req user id u index.js", req.user.id);
        if (await DB.checkCommentLikes(results[i].com_id, req.user.id)) {
          results[i].com_liked = true;
        } else {
          results[i].com_liked = false;
        }
      }
    }
  }
  console.log(results);
  res.status(200).json({
    data: results,
  });
});

app.get("/profile/:id", async (req, res) => {
  var id = req.params.id;
  let results = null;
  let isAuthenticated = null;
  let isFollowing = null;

  const user = await DB.findUserById(id);

  if (!user)
    return res.status(404).json({
      timestamp: Date.now(),
      msg: "User not found",
      code: 404,
    });

  results = await DB.getUser(id);

  if (req.isAuthenticated()) {
    isAuthenticated = true;
    isFollowing = await DB.findFollowers(req.user.id, id);
  }

  res.status(200).json({
    data: results,
    isAuthenticated: isAuthenticated,
    isFollowing: isFollowing,
  });

  // res.status(500).json({
  //   timestamp: Date.now(),
  //   msg: "Failed to get user, internal server error",
  //   code: 500,
  // });
});

app.get("/follow", async (req, res) => {
  try {
    let results = null;
    if (req.isAuthenticated()) {
      let rawdata = await DB.followeeListForAuth(req.user.id);

      let newArray = [];

      for (var i = 0; i < rawdata.length; i++) {
        if (!(await DB.findFollowers(req.user.id, rawdata[i].usr_id))) {
          newArray.push(rawdata[i]);
        }
      }
      results = newArray.slice(0, 3);
    } else {
      results = await DB.getFollowThreeUsers();
    }

    res.status(200).json({
      data: results,
    });
  } catch (err) {
    console.error(new Error(err.message));
  }
});

app.get("/tag", async (req, res) => {
  try {
    let results = null;
    //treba mi tag name, id, i broj tweet-ova

    results = await DB.getTags();

    res.status(200).json({
      data: results,
    });
  } catch (err) {
    console.error(new Error(err.message));
  }
});

_.start();
