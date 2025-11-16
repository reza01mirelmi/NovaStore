const Validator = require("fastest-validator");

const valid = new Validator();

const schema = {
  title: {
    type: "string",
    min: 3,
    max: 55,
    required: [true, "title is required!"],
    empty: false,
  },
  description: {
    type: "string",
    min: 10,
    max: 100,
    required: [true, "description is required!"],
    empty: false,
  },
  price: {
    type: "number",
    required: [true, "price is required!"],
    empty: false,
  },
  category: {
    type: "string",
    required: [true, "category is required!"],
    empty: false,
  },
  weight: {
    type: "number",
    required: [true, "weight is required!"],
    empty: false,
  },
  image: {
    type: "string",
  },
};

const ValidProduct = valid.compile(schema);
module.exports = ValidProduct;
