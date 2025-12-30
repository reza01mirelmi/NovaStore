const validator = require("fastest-validator");

const valid = new validator();

const schema = {
  orderId: {
    type: "string",
    required: [true, "orderId is required!"],
    empty: false,
  },
  method: {
    type: "string",
    required: [true, "method is required!"],
    min: 3,
    max: 20,
    empty: false,
  },
};

const ValidPayment = valid.compile(schema);
module.exports = ValidPayment;
