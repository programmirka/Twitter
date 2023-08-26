import axios from "axios";

class Comment {
  constructor(
    com_id,
    usr_name,
    usr_id,
    usr_handle,
    twt_id,
    com_content,
    com_created,
    com_deleted,
    likes_number,
    com_liked
  ) {
    this.com_id = com_id;
    this.usr_name = usr_name;
    this.usr_id = usr_id;
    this.usr_handle = usr_handle;
    this.twt_id = twt_id;
    this.com_content = com_content;
    this.com_created = com_created;
    this.com_deleted = com_deleted;
    this.likes_number = likes_number;
    this.com_liked = com_liked;
  }
}

export default {
  Comment,
  getComments(id) {
    return axios.get("http://localhost:3000/comments/" + id);
  },
  addComment(object) {
    return axios.post("http://localhost:3000/api/comment", object, {
      withCredentials: true,
    });
  },
  deleteComment(id) {
    return axios.delete("http://localhost:3000/api/comment/" + id, {
      withCredentials: true,
    });
  },
  editComment(object) {
    return axios.put("http://localhost:3000/api/comment/", object, {
      withCredentials: true,
    });
  },
};
