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
    maxAge: 60 * 60 * 24, //for 1 day
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

app.get("/tweets", function (req, res) {
  //request handler f-ja,  argumenti i telo(body) f-je
  DB.conn.query(
    `SELECT tweet.*, user.usr_name, user.usr_handle,
	COUNT(DISTINCT like_tweet.usr_id) AS twt_likes,
	COUNT(DISTINCT comment.usr_id) AS twt_comments
	FROM twitter_baza.tweet
	INNER JOIN user ON user.usr_id = tweet.usr_id
	LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
	LEFT JOIN comment ON comment.twt_id = tweet.twt_id
	GROUP BY tweet.twt_id
	ORDER BY tweet.twt_created DESC`,
    function (err, results, fields) {
      if (err) throw err;
      res.json({ data: results });
    }
  );
});

//ovo je samo za profile view, od jednog usera
app.get("/user_tweets/:id", function (req, res) {
  //request handler f-ja,  argumenti i telo(body) f-je
  var id = req.params.id;
  DB.conn.query(
    `SELECT 
    tweet.*, 
    user.usr_name, 
    user.usr_handle,
    COUNT(DISTINCT like_tweet.usr_id) AS twt_likes,
    COUNT(DISTINCT comment.usr_id) AS twt_comments
    
    FROM twitter_baza.tweet 

    INNER JOIN user ON user.usr_id = tweet.usr_id
    AND user.usr_id = ?
        
    LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
    LEFT JOIN comment ON comment.twt_id = tweet.twt_id

    GROUP BY tweet.twt_id, user.usr_name, user.usr_handle
    ORDER BY tweet.twt_created DESC;`,
    [id],
    function (err, results, fields) {
      if (err) throw err;
      res.json({ data: results });
    }
  );
});

app.get("/tweet/:id", (req, res) => {
  var id = req.params.id;

  DB.conn.query(
    `SELECT tweet.*, user.usr_name, user.usr_handle,
	COUNT(DISTINCT like_tweet.usr_id) AS twt_likes,
	COUNT(DISTINCT comment.usr_id) AS twt_comments
	FROM twitter_baza.tweet
	INNER JOIN user ON user.usr_id = tweet.usr_id
	LEFT JOIN like_tweet ON like_tweet.twt_id = tweet.twt_id
	LEFT JOIN comment ON comment.twt_id = tweet.twt_id
	WHERE tweet.twt_id = ?
	GROUP BY tweet.twt_id`,
    [id],
    function (err, results, fields) {
      if (err) throw err;
      res.json({ data: results });
    }
  );
});
app.get("/comments/:id", (req, res) => {
  var id = req.params.id;

  DB.conn.query(
    `SELECT comment.com_id, user.usr_name, user.usr_handle, 
    comment.usr_id, comment.twt_id, comment.com_content, comment.com_created, 
    comment.com_deleted, 
    COUNT(like_comment.usr_id) as likes_number 
    FROM twitter_baza.comment 
    LEFT JOIN twitter_baza.like_comment ON (twitter_baza.like_comment.com_id = comment.com_id) 
    LEFT JOIN twitter_baza.user ON ( user.usr_id = comment.usr_id) 
    WHERE comment.twt_id = ? 
    GROUP BY comment.com_id 
    ORDER BY comment.com_created 
    DESC`,
    [id],
    function (err, results, fields) {
      if (err) throw err;
      res.json({ data: results });
    }
  );
});

app.get("/profile/:id", (req, res) => {
  var id = req.params.id;

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
});

app.get("/follow", (req, res) => {
  DB.conn.query(
    `SELECT usr_id, usr_name, usr_handle, COUNT(follower.flw_follower) AS followers_number 
	 FROM twitter_baza.user
	 LEFT JOIN follower ON (user.usr_id = follower.flw_followee)
	 GROUP BY user.usr_id
	 ORDER BY followers_number DESC
	 LIMIT 3`,
    function (err, results, fields) {
      if (err) throw err;
      res.json({ data: results });
    }
  );
});
app.get("/trends", (req, res) => {
  DB.conn.query(
    `SELECT * FROM twitter_baza.tag
	ORDER BY tag.tag_created DESC
	LIMIT 3`,
    function (err, results, fields) {
      if (err) throw err;
      res.json({ data: results });
    }
  );
});

app.post("/test", (req, res) => {
  console.log("radi");
  res.status(200).json({
    msg: "radi",
  });
});

_.start();
