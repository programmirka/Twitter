import axios from "axios";

export default {
  getKarma(id) {
    return axios.get("http://localhost:3000/profile/karma/" + id);
  },
};
