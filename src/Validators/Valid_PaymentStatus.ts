import validator from "fastest-validator";

const valid = new validator();

const schema = {
  status: {
    type: "string",
    enum: ["success", "failed", "pending"],
    empty: false,
  },
};

const ValidPayment = valid.compile(schema);
export default ValidPayment;
