import axios from "axios";

class Follow {
  constructor(usr_id, usr_name, usr_handle) {
    this.usr_id = usr_id;
    this.usr_name = usr_name;
    this.usr_handle = usr_handle;
  }
}

//getFollows : vraca niz od tri usera sa najvise followera

export default {
  Follow,
  getFollows() {
    //za neautentifikovane user-e
    return axios.get("http://localhost:3000/follow");
  },
  getAuthFollows() {
    //za neautentifikovane user-e
    return axios.get("http://localhost:3000/api/follow/");
  },
  newFollow(object) {
    return axios.post("http://localhost:3000/api/follow", object, {
      withCredentials: true,
    });
  },
  checkFollowers(object) {
    return axios.put("http://localhost:3000/api/follow", object, {
      withCredentials: true,
    });
  },
};
