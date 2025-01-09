import axios from "axios";

export default {
  getTweets(perPage, page, term) {
    return axios.get(
      `http://localhost:3000/api/search/${term}?_limit=${perPage}&_page=${page}`
    );
    //on this way I can also send . and not get error
  },
  getAllUsers() {
    return axios.get("http://3000:localhost/api/users");
  }, //I think I don't use this at all
};
