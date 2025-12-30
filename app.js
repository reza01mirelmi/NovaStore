const express = require("express");
const UserRoute = require("./Routes/v1/Routes_Users");
const ProductRoute = require("./Routes/v1/Routes_Products");
const OrderRoute = require("./Routes/v1/Routes_Orders");
const CommentRoute = require("./Routes/v1/Routes_Comments");
const AuthRoute = require("./Routes/v1/Routes_Auth");
const categoryRoute = require("./Routes/v1/Routes_Category");
const paymentsRoute = require("./Routes/v1/Routes_Payments");
const errorHandlers = require("./Middleware/ErrorHandling");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
require("./Configs/db");
require("dotenv").config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Public")));
app.use("/uploads", express.static("uploads"));

app.use(
  morgan(
    ":method :url HTTP/:http-version - :status :res[content-length] :referrer :user-agent :response-time ms"
  )
);
app.use(helmet());
app.use(cors());
app.use("/api/v1/users", UserRoute);
app.use("/api/v1/products", ProductRoute);
app.use("/api/v1/orders", OrderRoute);
app.use("/api/v1/comments", CommentRoute);
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/payments", paymentsRoute);

app.use((req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl}`);
  err.statuscode = 404;
  next(err);
});

app.use(errorHandlers);

app.listen(port, () => {
  console.log("NovaStore conected successfully.✅");
});