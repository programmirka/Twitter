import axios from "axios";

class User {
  constructor(
    usr_id,
    usr_name,
    usr_handle,
    usr_about,
    usr_birth,
    usr_email,
    usr_pass
  ) {
    this.usr_id = usr_id;
    this.usr_name = usr_name;
    this.usr_handle = usr_handle;
    this.usr_about = usr_about;
    this.usr_birth = usr_birth;
    this.usr_email = usr_email;
    this.usr_pass = usr_pass;
  }
}

function openEditProfileSuccess(res) {
  var niz = res.data.data;
  let user = {};
  for (var i = 0; i < niz.length; i++) {
    user = new User(
      niz[0].usr_id,
      niz[0].usr_name,
      niz[0].usr_handle,
      niz[0].usr_about,
      niz[0].usr_birth,
      niz[0].usr_email,
      niz[0].usr_pass
    );
  }
  return user;
}

export default {
  User,
  openEditProfile(id) {
    return axios.get("http://localhost:3000/api/profile/" + id, {
      withCredentials: true,
    });
  },
  openEditProfileSuccess,
  editProfile(id, user) {
    //napravi route na backend-u za put api
    return axios.put("http://localhost:3000/api/profile/" + id, user, {
      withCredentials: true,
    });
  },
};
