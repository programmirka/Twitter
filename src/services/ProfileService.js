import axios from "axios";

//iz baze uzima sve sto mi treba za usera: name, handle, about, joined, # following, # followers
//to cemo kmoristiti za deo gde je profile info
//ovde parvimo i api request za to i samu dynamic rutu sa id-em

//zatim mi treba poseban api request za samo njegove twittove

//treci api request ce biti za editovanje profila, za koji treba da napravim i komponentu koja ce se pojaviti kao modal na view profal-u
class User {
  constructor(
    usr_id,
    usr_name,
    usr_handle,
    usr_about,
    usr_joined,
    usr_email,
    usr_admin,
    usr_blocked,
    following,
    followers
  ) {
    this.usr_id = usr_id;
    this.usr_name = usr_name;
    this.usr_handle = usr_handle;
    this.usr_about = usr_about;
    this.usr_joined = usr_joined;
    this.usr_email = usr_email;
    this.usr_admin = usr_admin;
    this.usr_blocked = usr_blocked;
    this.following = following;
    this.followers = followers;
  }
}

//mislim da mi ovo ne treba

// function getUserSuccess(res) {
//   var niz = res.data.data;
//   console.log("u profile service niz", niz);
//   let user = {};
//   for (var i = 0; i < niz.length; i++) {
//     user = new User(
//       niz[0].usr_id,
//       niz[0].usr_name,
//       niz[0].usr_handle,
//       niz[0].usr_about,
//       niz[0].usr_joined,
//       niz[0].usr_email,
//       niz[0].following,
//       niz[0].followers
//     );
//   }
//   console.log("u profile serbice user", user);
//   return user;
// }

export default {
  User,
  getUser(id) {
    return axios.get("http://localhost:3000/profile/" + id);
  },
};
