import axios from "axios";
import CreatedService from "@/services/CreatedService.js";

class User {
  constructor(
    usr_id,
    usr_name,
    usr_handle,
    usr_email,
    usr_joined,
    usr_blocked,
    usr_admin
  ) {
    this.usr_id = usr_id;
    this.usr_name = usr_name;
    this.usr_handle = usr_handle;
    this.usr_email = usr_email;
    this.usr_joined = usr_joined;
    this.usr_blocked = usr_blocked;
    this.usr_admin = usr_admin;
  }
}

function joined(date) {
  var day = CreatedService.day(date);
  var month = CreatedService.month(date);
  var year = CreatedService.year(date);

  return day + "-" + month + "-" + year;
}

function getAllUsersSuccess(res) {
  var niz = res.data.data;
  console.log(niz);
  let users = [];

  if (niz) {
    for (var i = 0; i < niz.length; i++) {
      var usr_joined = joined(niz[i].usr_joined);
      users.push(
        new User(
          niz[i].usr_id,
          niz[i].usr_name,
          niz[i].usr_handle,
          niz[i].usr_email,
          usr_joined,
          niz[i].usr_blocked,
          niz[i].usr_admin
        )
      );
    }
  }
  return users;
}

export default {
  getAllUsers() {
    return axios.get("http://localhost:3000/api/admin/users");
  },
  getAllUsersSuccess,
  switchAdmin(id) {
    return axios.put("http://localhost:3000/api/admin/admin", { id: id });
  },
  switchBlock(id) {
    return axios.put("http://localhost:3000/api/admin/block", { id: id });
  },
  searchUsers(term) {
    return axios.get("http://localhost:3000/api/admin/search/" + term);
  },
};
