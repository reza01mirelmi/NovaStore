const Validator = require("fastest-validator");

const valid = new Validator();

const schema = {
  productId: {
    type: "string",
    required: [true, "productId is required!"],
    empty: false,
  },
  body: {
    type: "string",
    max: 500,
    required: [true, "body is required!"],
    empty: false,
  },
};

const ValidComment = valid.compile(schema);
module.exports = ValidComment;
