let _ = {};

_.name = () => {
  const regex = "^[-'A-Za-z0-9 ]{2,30}$"; //we allow: - (hyphen), ' (apostrophe) capital letter, small letters, numbers and whitespace
  const constraints = {
    presence: {
      allowEmpty: false,
    },
    type: "string",
    format: {
      pattern: regex,
      flags: "i",
      message: "name must match the following patern" + regex,
    },
  };
  return constraints;
};
_.email = () => {
  const constraints = {
    presence: {
      allowEmpty: false,
    },
    type: "string",
    email: true,
  };
  return constraints;
};
_.password = () => {
  const constraints = {
    presence: {
      allowEmpty: false,
    },
    type: "string",
    length: {
      minimum: 8,
      maximum: 30,
    },
  };
  return constraints;
};
_.about = () => {
  const regex = /^[-'A-Za-z0-9 .,:;!@#$%^&*()_+={}[\]|<>/~\\?"'\n]{0,300}$/;

  const constraints = {
    presence: {
      allowEmpty: true,
    },
    type: "string",
    format: {
      pattern: regex,
      flags: "i",
      message: "about must match the following patern" + regex,
    },
  };
  return constraints;
};

_.handle = () => {
  const regex = "^[A-Za-z0-9_-']{2,15}$";

  const constraints = {
    presence: {
      allowEmpty: false,
    },
    type: "string",
    format: {
      pattern: regex,
      flags: "i",
      message: "handle must match the following patern" + regex,
    },
  };
  return constraints;
};
module.exports = _;
