import express, { Request, Response, NextFunction } from "express";
import UserRoute from "./Routes/v1/Routes_Users";
import ProductRoute from "./Routes/v1/Routes_Products";
import OrderRoute from "./Routes/v1/Routes_Orders";
import CommentRoute from "./Routes/v1/Routes_Comments";
import AuthRoute from "./Routes/v1/Routes_Auth";
import categoryRoute from "../src/Routes/v1/Routes_Category";
import paymentsRoute from "./Routes/v1/Routes_Payments";
import errorHandlers from "../src/Middleware/ErrorHandling";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import "../src/Configs/db";
import { config } from "dotenv";
config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Public")));
app.use("/uploads", express.static("uploads"));

app.use(
  morgan(
    ":method :url HTTP/:http-version - :status :res[content-length] :referrer :user-agent :response-time ms",
  ),
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
  const err: any = new Error(`Can't find ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

app.use(errorHandlers);

app.listen(port, () => {
  console.log("NovaStore conected successfully.✅");
});
export default app;
