const Validator = require("fastest-validator");

const valid = new Validator();

const loginSchema = {
  identifier: {
    type: "string",
    empty: false,
    custom(value) {
      const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        value
      );
      const isPhone = /^\+?\d{6,15}$/.test(value);

      if (!isEmail && !isPhone) {
        return "Must be a valid email or mobile number❌";
      }

      return true;
    },
  },
  password: { type: "string", min: 6, empty: false },
};

const ValidRegister = valid.compile(loginSchema);
module.exports = ValidRegister;
