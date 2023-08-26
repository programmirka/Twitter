import axios from "axios";

export default {
  getTweets(term) {
    return axios.get("http://localhost:3000/api/search/" + term);
  },
};
