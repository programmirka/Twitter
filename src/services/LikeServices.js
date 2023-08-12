import axios from "axios";

export default {
  like(object) {
    return axios.post("http://localhost:3000/api/like", object, {
      withCredentials: true,
    });
  },
};
