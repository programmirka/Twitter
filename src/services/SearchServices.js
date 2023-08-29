import axios from "axios";

export default {
  getTweets(term) {
    return axios.get("http://localhost:3000/api/search/" + term);
  },
  getAllUsers() {
    return axios.get("http://3000:localhost/api/users");
  },
};
