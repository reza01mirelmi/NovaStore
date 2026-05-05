import userModele from "./../Models/Models_Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterDTO, loginDTO } from "../Types/auth";
import { UserDocument } from "../Models/Models_Users";

export const registerService = async (input: RegisterDTO) => {
  const isAuthorExists: UserDocument | null = await userModele.findOne({
    $or: [{ email: input.email }, { phone: input.phone }],
  });
  if (isAuthorExists) return null;

  const countUsers = await userModele.countDocuments();
  const hashPassword = await bcrypt.hash(input.password, 10);

  const user = await userModele.create({
    name: input.name,
    email: input.email,
    phone: input.phone,
    password: hashPassword,
    role: countUsers > 0 ? "USER" : "ADMIN",
  });
  const userObject = user.toObject();
  Reflect.deleteProperty(userObject, "password");

  const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_JWT!, {
    expiresIn: "30d",
  });
  return { user: userObject, accessToken };
};

export const loginService = async (input: loginDTO) => {
  const user: UserDocument | null = await userModele.findOne({
    $or: [{ email: input.identifier }, { phone: input.identifier }],
  });
  if (!user) return null;

  const checkPassword = await bcrypt.compare(input.password, user.password);
  if (!checkPassword) return false;

  const accsesToken = jwt.sign({ id: user._id }, process.env.SECRET_JWT!, {
    expiresIn: "30 day",
  });
  const { password, phone, createdAt, updatedAt, id, __v, ...safeUser } =
    user.toObject();

  return { user: safeUser, accsesToken };
};

export const getMeService = async (userId: string) => {
  const user = await userModele
    .findById(userId)
    .select("-password -__v")
    .lean();
  return user;
};

export default { registerService, loginService, getMeService };
