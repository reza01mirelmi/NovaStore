const mongoose = require("mongoose");
require("dotenv").config()
const DataBaseUrl = process.env.MONGO_URL;

mongoose
  .connect(DataBaseUrl)
  .then(console.log("Conected!✅"))
  .catch((err) => console.log(err));
