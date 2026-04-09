import express from "express";
import authControllers from "../../Controllers/v1/Auth_Controllers";
import { CheckBan } from "./../../Middleware/CheckBanUser";
import verifytokenMidd from "./../../Middleware/VerifyToken";

const router = express.Router();

router.route("/register").post(CheckBan, authControllers.register);

router.route("/login").post(CheckBan, authControllers.login);

router.route("/me").get(verifytokenMidd, authControllers.getme);

export default router;
