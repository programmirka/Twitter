import axios from "axios";

export default {
  likeTweet(object) {
    return axios.post("http://localhost:3000/api/like", object, {
      withCredentials: true,
    });
  },
  getTweetLikes(id) {
    return axios.get("http://localhost:3000/like/" + id);
  },
  likeComment(object) {
    return axios.post("http://localhost:3000/api/comment_like", object, {
      withCredentials: true,
    });
  },
};
