import axios from "axios";

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
    twt_comments,
    twt_liked
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
    this.twt_liked = twt_liked;
  }
}

function getTweetsSuccess(res) {
  var niz = res.data.data;
  let tweets = [];
  if (niz) {
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
          niz[i].twt_comments,
          niz[i].twt_liked
        )
      );
    }
  }
  return tweets;
}

export default {
  Tweet,
  getTweets(id) {
    //explore & home & profile
    return axios.get("http://localhost:3000/tweets/" + id);
  },
  getTweet(id) {
    //tweetView
    return axios.get("http://localhost:3000/tweet/" + id);
  },
  getTweetsSuccess,
  deleteTweet(id) {
    return axios.delete("http://localhost:3000/api/tweet/" + id, {
      withCredentials: true,
    });
  },
  editTweet(object) {
    return axios.put("http://localhost:3000/api/tweet", object, {
      withCredentials: true,
    });
  },
  publishTweet(object) {
    return axios.post("http://localhost:3000/api/tweet", object, {
      withCredentials: true,
    });
  },
};
