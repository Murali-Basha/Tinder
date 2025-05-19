const validator = require("validator");

const signUpValidation = (req) => {
  const { firstName, lastName, email, password } = req;
  // Check password strength
  const strongPasswordOptions = {
    minLength: 8,
    maxLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  };
  if (!firstName || !lastName) {
    throw new Error("FirstName and LastName cannot be empty");
  } else if (
    firstName.length > 10 ||
    lastName.length > 10 ||
    firstName.length < 4 ||
    lastName.length < 4
  ) {
    throw new Error("FirstName and LastName should 3-10 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email Format");
  } else if (!validator.isStrongPassword(password, strongPasswordOptions)) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
    );
  } else if (password.length > 12) {
    throw new Error("Password must not exceed 12 characters.");
  }
};

const loginValidation = (req) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Please provide email and password to login");
  }
};
const validateProfileEdit = (req) => {
  const allowedProfileEditFields = [
    "firstName",
    "lastName",
    "age",
    "about",
    "photoUrl",
    "gender",
  ];

  const allowedEdit = Object.keys(req).every((keys) =>
    allowedProfileEditFields.includes(keys)
  );
  return allowedEdit;
};
module.exports = {
  signUpValidation,
  loginValidation,
  validateProfileEdit,
};
