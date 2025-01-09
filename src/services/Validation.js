function email(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(String(email).toLowerCase())) {
    return "";
  } else {
    return "Please enter a valid email address";
  }
}
function password(password) {
  let re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,30}$/;

  //Minimum eight characters, maximum 30 characters, at least one letter, one number and one special character:
  if (re.test(password)) {
    return "";
  } else {
    return "must contain at least one letter, one number and one special character and must be 8-30 characters long";
  }
}
function name(name) {
  const re = /^[a-zA-Z0-9-' ]+$/;
  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(name) && name.length > 1 && name.length <= 30) {
    return "";
  } else {
    return `can contain a-z, A-Z, 0-9, " ", ' and must be 2-30 characters long`;
  }
}
function handle(handle) {
  const re = /^[a-zA-Z0-9_'\-]{2,15}$/;

  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(handle)) {
    return "";
  } else {
    return `can contain a-z, A-Z, 0-9,', "-", "_" and must be 2-15 characters long`;
  }
}

function about(about) {
  const re = /^[-'A-Za-z0-9 .,:;!@#$%^&*()_+={}[\]|<>/~\\?"'\n]+$/;

  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(about) && about.length < 300) {
    return "";
  } else {
    return "can't contain special characters and must be below 300 characters";
  }
}
function rePassword(password, rePassword) {
  if (password === rePassword) {
    return "";
  } else {
    return "Passwords do not match";
  }
}
export default {
  email,
  password,
  name,
  handle,
  rePassword,
  about,
};
