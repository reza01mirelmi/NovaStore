const Validator = require("fastest-validator");

const valid = new Validator();

const schema = {
  name: {
    type: "string",
    min: 3,
    max: 255,
    required: [true, "name is required!"],
    empty: false,
  },
  email: {
    type: "email",
    min: 8,
    max: 100,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    required: [true, "email is required!"],
    empty: false,
  },
  phone: {
    type: "string",
    validate: {
      Validator: function (v) {
        return /^\+?\d{6,15}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "phone is required!"],
    empty: false,
  },
  password: {
    type: "string",
    min: 8,
    max: 24,
    required: [true, "password is required!"],
    empty: false,
  },
  passwordReset: {
    type: "equal",
    field: "password",
    required: [true, "passwordReset is required!"],
    empty: false,
  },
  $$strict: true,
};

const ValidRegister = valid.compile(schema);
module.exports = ValidRegister;
