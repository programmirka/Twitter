import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

class Tweet {
  constructor(
    twt_id,
    usr_id,
    twt_content,
    twt_created,
    twt_deleted,
    usr_name,
    usr_handle,
    twt_likes,
    twt_comments
  ) {
    this.twt_id = twt_id;
    this.usr_id = usr_id;
    this.twt_content = twt_content;
    this.twt_created = twt_created;
    this.twt_deleted = twt_deleted;
    this.usr_name = usr_name;
    this.usr_handle = usr_handle;
    this.twt_likes = twt_likes;
    this.twt_comments = twt_comments;
  }
}

function getTweetsSuccess(res) {
  var niz = res.data.data;
  let tweets = [];
  for (var i = 0; i < niz.length; i++) {
    tweets.push(
      new Tweet(
        niz[i].twt_id,
        niz[i].usr_id,
        niz[i].twt_content,
        niz[i].twt_created,
        niz[i].twt_deleted,
        niz[i].usr_name,
        niz[i].usr_handle,
        niz[i].twt_likes,
        niz[i].twt_comments
      )
    );
  }
  return tweets;
}

export default {
  Tweet,
  getTweets() {
    return apiClient.get("/tweets");
  },
  getTweet(id) {
    return apiClient.get("/tweet/" + id);
  },
  getUserTweets(id) {
    return apiClient.get("/user_tweets/" + id);
  },
  getTweetsSuccess,
};
