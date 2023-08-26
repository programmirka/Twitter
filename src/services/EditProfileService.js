import axios from "axios";

// class User {
//   constructor(
//     usr_id,
//     usr_name,
//     usr_handle,
//     usr_about,
//     usr_birth,
//     usr_email,
//     usr_pass
//   ) {
//     this.usr_id = usr_id;
//     this.usr_name = usr_name;
//     this.usr_handle = usr_handle;
//     this.usr_about = usr_about;
//     this.usr_birth = usr_birth;
//     this.usr_email = usr_email;
//     this.usr_pass = usr_pass;
//   }
// }

export default {
  openEditProfile(id) {
    return axios.get("http://localhost:3000/api/profile/" + id, {
      withCredentials: true,
    });
  },

  editProfile(id, user) {
    //napravi route na backend-u za put api
    return axios.put("http://localhost:3000/api/profile/" + id, user, {
      withCredentials: true,
    });
  },
};
