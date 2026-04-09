import express from "express";
import userControllers from "../../Controllers/v1/User_Controllers";
import verifytokenMidd from "./../../Middleware/VerifyToken";
import checkAdminMidd from "./../../Middleware/CheckAdmins";
import validObjectId from "./../../Middleware/validateObjectId";

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
    userControllers.oneUser,
  )
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    userControllers.remove,
  );

users
  .route("/ban/:id")
  .post(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    userControllers.banUser,
  );

users
  .route("/role/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    userControllers.changeRole,
  );

export default users;
