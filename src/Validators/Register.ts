import validator from "fastest-validator";

const v = new validator();

const schema = {
  name: {
    type: "string",
    min: 3,
    max: 255,
    required: true,
    empty: false,
  },
  email: {
    type: "email",
    min: 8,
    max: 100,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    required: true,
    empty: false,
  },
  phone: {
    type: "string",
    empty: false,
    required: true,
    pattern: /^\+?\d{6,15}$/,
    messages: {
      stringPattern: "Phone number must be valid and contain 6-15 digits.",
    },
  },
  password: {
    type: "string",
    min: 8,
    max: 24,
    required: true,
    empty: false,
  },
  passwordReset: {
    type: "equal",
    field: "password",
    required: true,
    empty: false,
  },
  $$strict: true,
};

const validAuthor = v.compile(schema);
export default validAuthor;
