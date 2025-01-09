import axios from "axios";

class Follow {
  constructor(usr_id, usr_name, usr_handle, usr_profilePic) {
    this.usr_id = usr_id;
    this.usr_name = usr_name;
    this.usr_handle = usr_handle;
    this.usr_profilePic = usr_profilePic;
  }
}

//getFollows : vraca niz od tri usera sa najvise followera

export default {
  Follow,
  getFollows() {
    return axios.get("http://localhost:3000/follow");
  },

  newFollow(object) {
    return axios.post("http://localhost:3000/api/follow", object, {
      withCredentials: true,
    });
  },
};
