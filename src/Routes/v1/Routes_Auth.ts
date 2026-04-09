import express from "express";
import authControllers from "../../Controllers/v1/Auth_Controllers";
import checkBan from "./../../Middleware/CheckBanUser";
import verifytokenMidd from "./../../Middleware/VerifyToken";

const router = express.Router();

router.route("/register").post(checkBan, authControllers.register);

router.route("/login").post(checkBan, authControllers.login);

router.route("/me").get(verifytokenMidd, authControllers.getme);

export default router;
