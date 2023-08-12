import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

class Comment {
  constructor(
    com_id,
    usr_name,
    usr_handle,
    twt_id,
    com_content,
    com_created,
    com_deleted,
    likes_number
  ) {
    this.com_id = com_id;
    this.usr_name = usr_name;
    this.usr_handle = usr_handle;
    this.twt_id = twt_id;
    this.com_content = com_content;
    this.com_created = com_created;
    this.com_deleted = com_deleted;
    this.likes_number = likes_number;
  }
}

export default {
  Comment,
  getComments(id) {
    return apiClient.get("/comments/" + id);
  },
};
