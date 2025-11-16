const express = require("express");
const authControllers = require("../../Controllers/v1/Auth_Controllers");
const { CheckBan } = require("./../../Middleware/CheckBanUser");
const verifytokenMidd = require("./../../Middleware/VerifyToken");
const router = express.Router();

router.route("/register").post(CheckBan, authControllers.register);

router.route("/login").post(CheckBan, authControllers.login);

router.route("/me").get(verifytokenMidd, authControllers.getme);

module.exports = router;
