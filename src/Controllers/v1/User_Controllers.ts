import { Request, Response, NextFunction } from "express";

import {
  allUsersService,
  oneUserService,
  banUserService,
  removeService,
  changeRoleService,
  updateUserService,
} from "../../services/user.services";
import { UsersDTO } from "../../Types/user";

const allUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await allUsersService();

    return res
      .status(result.code)
      .json({ message: result.message, users: result.users });
  } catch (err) {
    next(err);
  }
};

const oneUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string;

    const result = await oneUserService(userId);
    return res.status(result.code).json({
      user: result.users,
    });
  } catch (err) {
    next(err);
  }
};

const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string;

    const result = await banUserService(userId);
    return res.status(result.code).json({ meseage: result.message });
  } catch (err) {
    next(err);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string;

    const result = await removeService(userId);
    return res.status(result.code).json({ message: result.message });
  } catch (err) {
    next(err);
  }
};

const changeRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string;

    const result = await changeRoleService(userId);
    return res
      .status(result.code)
      .json({ message: result.message, user: result.findUsers });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const input: UsersDTO = req.body;
    const pass = req.body.password;

    const result = await updateUserService(userId, input, pass);
    return res.status(result.code).json({
      message: result.message,
      user: result.userToObject,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  allUsers,
  oneUser,
  banUser,
  remove,
  changeRole,
  updateUser,
};
