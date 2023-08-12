// Dependencies
const { v4: uuidv4 } = require("uuid");
//uuidv4 is a function or method used to generate version 4 universally unique identifiers (UUIDs).
//UUIDs are 128-bit unique identifiers that are often used in various applications and systems to create globally unique references.
//A standard version 4 UUID consists of 36 characters, including hyphens.
const validate = require("validate.js");
// koristimo biblioteku validate za proveru validnosti promenljive ime, email, password
// u odnosu na definisana ograničenja u objektu constraints.ime., constraints.email itd.
const constraints = require("../lib/constraints");
const bcrypt = require("bcrypt");
// The "bcrypt" package is a popular library in Node.js used for hashing passwords securely.
const DB = require("./../lib/db");

let _ = class User {
  constructor() {
    this.id = uuidv4();
    this.email = null;
    this.security = {
      passwordHash: null,
    };
    this.name = null;
    this.birth = null;
    this.handle = null;
    this.about = null;
    this.blocked = false;
    this.admin = false;
  }
  //save the user to the datebase
  save() {
    console.log(`Successfully saved user ${this.id} to the database `);
    DB.registerUser(this);
  }
  //Find the user with the given id
  find(id) {
    return "";
  }
  setName(name) {
    try {
      if (name) {
        //do any sanitisation here
        name = name.trim().replace(/ +/g, " ");
      }

      let msg = validate.single(name, constraints.name);

      if (msg) {
        return msg;
      } else {
        this.name = name;
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  setEmail(email) {
    try {
      let msg = validate.single(email, constraints.email);

      if (msg) {
        return msg;
      } else {
        this.email = email;
        return;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async setPassword(password) {
    //bcrypt is async by documentation

    try {
      let msg = validate.single(password, constraints.password);

      if (msg) {
        return msg;
      } else {
        this.security.passwordHash = await bcrypt.hash(password, 10); // 10 - # of rounds of hashing, salt factor
        return;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  setBirth(birthday) {
    this.birth = birthday;
  }
  setHandle(handle) {
    this.handle = handle;
  }
};

module.exports = _;
