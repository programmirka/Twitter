import axios from "axios";

export default {
  getTags() {
    return axios.get("http://localhost:3000/tag");
  },
};
