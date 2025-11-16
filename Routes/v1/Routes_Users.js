const express = require("express");
const userControllers = require("../../Controllers/v1/User_Controllers");
const verifytokenMidd = require("./../../Middleware/VerifyToken");
const checkAdminMidd = require("./../../Middleware/CheckAdmins");
const validObjectId = require("./../../Middleware/validateObjectId");
const users = express.Router();

users
  .route("/")
  .get(verifytokenMidd, checkAdminMidd, userControllers.allUsers)
  .put(verifytokenMidd, userControllers.updateUser);

users
  .route("/:id")
  .get(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    userControllers.oneUser
  )
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    userControllers.remove
  );

users
  .route("/ban/:id")
  .post(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    userControllers.banUser
  );

users
  .route("/role/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    userControllers.changeRole
  );

module.exports = users;
