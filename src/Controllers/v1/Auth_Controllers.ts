import { Request, Response, NextFunction } from "express";
import ValidateRegister from "../../Validators/Register";
import validateLogin from "../../Validators/Valid_Login";
import {
  registerService,
  loginService,
  getMeService,
} from "../../services/auth.services";
import { RegisterDTO, loginDTO } from "../../Types/auth";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: RegisterDTO = req.body;
    const isBodyValidated = ValidateRegister(input);

    if (isBodyValidated !== true) {
      return res.status(400).json(isBodyValidated);
    }
    const result = await registerService(input);

    if (!result) {
      return res
        .status(409)
        .json({ message: "This email Or Phone is already registered.❌" });
    }

    const { user, accessToken } = result;

    return res.status(201).json({
      message: "User created successfully.✅ ",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input: loginDTO = req.body;
    const isBodyValidated = validateLogin(input);

    if (isBodyValidated !== true) {
      return res.status(400).json(isBodyValidated);
    }

    const result = await loginService(input);

    if (result === null) {
      return res.status(404).json({ message: "User not found.❌" });
    }

    if (result === false) {
      return res
        .status(401)
        .json({ message: "The password is not correct.❌" });
    }

    const { user, accsesToken } = result;

    return res.status(200).json({ user, accsesToken });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getMeService(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    return res
      .status(200)
      .json({ message: "User fetched successfully ✅", user });
  } catch (err) {
    next(err);
  }
};

export default {
  register,
  login,
  getMe,
};
