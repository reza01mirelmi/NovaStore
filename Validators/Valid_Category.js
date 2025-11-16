const Validator = require("fastest-validator");

const s = new Validator();

const schema = {
  title: {
    type: "string",
    required: [true, "title is required!"],
    empty: false,
    min: 5,
    max: 55,
  },
  slug: {
    type: "string",
    required: [true, "slug is required!"],
    empty: false,
  },
};

const Valid = s.compile(schema);
module.exports = Valid;
