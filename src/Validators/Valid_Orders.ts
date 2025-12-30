const Validator = require("fastest-validator");

const s = new Validator();

const schema = {
  productId: {
    type: "string",
    required: [true, "productId is required!"],
    empty: false,
  },
  quantity: {
    type: "number",
    required: [true, "quantity is required!"],
    empty: false,
  },
  address: {
    type: "string",
    min: 15,
    max: 100,
    required: [true, "address is required!"],
    empty: false,
  },
};

const Valid = s.compile(schema);
module.exports = Valid;
