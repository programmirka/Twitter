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
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;
  //Minimum eight characters, maximum 30 characters, at least one letter, one number and one special character:
  if (re.test(password)) {
    return "";
  } else {
    return "Password must be between 8-30 characters long and must contain at least one letter, one number and one special character ";
  }
}
function name(name) {
  const re = /^[a-zA-Z-' ]+$/;
  //only contains letters, spaces, hyphens, and apostrophes,
  if (re.test(name) && name.length > 3 && name.length < 30) {
    return "";
  } else {
    return "Name should only contain letters, spaces, hyphens, and apostrophes";
  }
}
function handle(handle) {
  const re = /^[a-zA-Z0-9-' ]+$/;
  //only contains letters, numbers, spaces, hyphens, and apostrophes,
  if (re.test(handle) && handle.length > 3 && handle.length < 15) {
    return "";
  } else {
    return "Handle can contain only letters, numbers, spaces, hyphens, and apostrophes and must be between 8-30 characters";
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
};
