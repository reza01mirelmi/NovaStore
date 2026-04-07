import validator from "fastest-validator";

const v = new validator();

const schema = {
  identifier: {
    type: "string",
    empty: false,
    trim: true,
    custom(value: string) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const phoneRegex = /^\+?\d{6,15}$/;

      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        return "Must be a valid email or mobile number❌";
      }
      return true;
    },
  },
  password: { type: "string", min: 8, empty: false },
  $$strict: true,
};

const validLogin = v.compile(schema);
export default validLogin;
