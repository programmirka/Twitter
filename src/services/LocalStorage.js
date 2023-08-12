function setUser(res) {
  try {
    return localStorage.setItem("loggedInUser", JSON.stringify(res)); //res.data.user umesto res
  } catch (e) {
    console.log(e);
  }
}
function getUser() {
  try {
    let storedUser = localStorage.getItem("loggedInUser");
    return JSON.parse(storedUser);
  } catch (e) {
    console.log(e);
  }
}
let id;
function removeUser() {
  try {
    localStorage.removeItem("loggedInUser");
    id = null;
  } catch (e) {
    console.log(e);
  }
}
if (getUser()) {
  id = getUser().usr_id;
}
//localStorage only supports string key-value pairs.
//This means that if you want to store objects, arrays, or any non-string data,
//you have to convert (serialize) it to a string first.

export default {
  setUser,
  getUser,
  removeUser,
  id,
};
