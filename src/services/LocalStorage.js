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
function deleteAllCookies() {
  console.log("delete All cookies");
  const cookies = document.cookie.split(";");
  console.log(cookies);
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}
function removeUser() {
  try {
    localStorage.removeItem("loggedInUser");
    deleteAllCookies();
  } catch (e) {
    console.log(e);
  }
}
function id() {
  if (getUser()) {
    let user_id_local = getUser().usr_id;
    return user_id_local;
  } else {
    return;
  }
}

function admin() {
  if (getUser()) {
    let userAdmin = getUser().usr_admin ? true : false;
    return userAdmin;
  } else {
    return;
  }
}

//localStorage only supports string key-value pairs.
//This means that if you want to store objects, arrays, or any non-string data,
//you have to convert (serialize) it to a string first.

export default {
  setUser,
  getUser,
  removeUser,
  id,
  admin,
};
