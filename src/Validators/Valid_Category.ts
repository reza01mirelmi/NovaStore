import Validator from "fastest-validator";

const v = new Validator();

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

const Valid = v.compile(schema);
export default Valid;
