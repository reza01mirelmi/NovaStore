import { UsersDTO } from "../Types/user";
import modelsUsers, { UserDocument } from "./../Models/Models_Users";
import modelsBanUser from "./../Models/Models_banPhone";
import bcrypt from "bcrypt";
const allUsersService = async () => {
  const users = await modelsUsers.find({}).select("-password -__v").lean();

  if (users.length === 0) {
    return { ok: true, code: 200, message: "User not found.❌", users: [] };
  }

  return {
    ok: true,
    code: 200,
    message: "User list sent successfully.✅",
    users,
  };
};

const oneUserService = async (userId: string) => {
  const users = await modelsUsers
    .findOne({ _id: userId })
    .select("-__v -createdAt -password")
    .populate("orders", "-createdAt -updatedAt -__v")
    .lean();

  if (!users) {
    return {
      ok: false,
      code: 404,
      meseage: "This user does not exist on the site.❌",
    };
  }

  return {
    ok: true,
    code: 200,
    users,
  };
};

const banUserService = async (userId: string) => {
  const findUserBan = await modelsUsers.findOne({ _id: userId }).lean();

  if (!findUserBan) {
    return { ok: false, code: 404, message: "User not found.❌" };
  }
  const existingBan = await modelsBanUser.findOne({
    phone: findUserBan.phone,
  });

  if (existingBan) {
    return {
      ok: false,
      code: 409,
      message: "This user is already banned or exists.❌",
    };
  }

  const banUser = await modelsBanUser.create({
    phone: findUserBan.phone,
  });

  if (!banUser) {
    return { ok: false, code: 400, meseage: "The user was not banned.❌" };
  }

  return {
    ok: true,
    code: 200,
    message: "Banned successfully ✅",
  };
};

const removeService = async (userId: string) => {
  const removeUsers = await modelsUsers
    .findByIdAndDelete({ _id: userId })
    .lean();

  if (!removeUsers) {
    return {
      ok: false,
      code: 404,
      meseage: "User with this ID was not found.❌",
    };
  }
  return {
    ok: true,
    code: 200,
    message: "User successfully deleted.✅",
  };
};

const changeRoleService = async (userId: string) => {
  const findUsers = await modelsUsers.findOne({ _id: userId }).lean();

  if (!findUsers) {
    return {
      ok: false,
      code: 404,
      message: "This user does not exist on the site.❌",
    };
  }

  if (findUsers.role == "ADMIN") {
    return { ok: false, code: 409, message: "This user is an admin.!" };
  }

  const changeRoleUsers = await modelsUsers.findByIdAndUpdate(userId, {
    role: "ADMIN",
  });

  if (changeRoleUsers) {
    return { ok: false, code: 400, message: "Role update failed" };
  }

  return {
    ok: true,
    code: 200,
    message: "Successfully promoted to admin✅",
    findUsers,
  };
};

const updateUserService = async (
  userId: string,
  input: Partial<UsersDTO>,
  pass: string,
) => {
  const user: any = await modelsUsers.findById(userId);

  let isChanged = false;
  const allowedUpdates: (keyof UsersDTO)[] = [
    "name",
    "email",
    "phone",
    "password",
  ];

  type UpdatAtbleUserFields = Pick<
    UserDocument,
    "name" | "email" | "phone" | "password"
  >;
  for (let key of allowedUpdates) {
    const field = key as keyof UpdatAtbleUserFields;
    if (key != "password" && input[field] != undefined) {
      if (input[field] != user[field]) {
        user[field] = input[field];
        isChanged = true;
      }
    }
  }

  if (pass) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    user.password = hashedPassword;
    user.passwordChangedAt = Date.now();
  }

  if (!isChanged) {
    return { ok: false, code: 400, message: "No changes detected ❌" };
  }
  await user.save();
  const userToObject = user.toObject();
  Reflect.deleteProperty(userToObject, "password");

  return {
    ok: true,
    code: 200,
    message: "User information was successfully updated✅",
    userToObject,
  };
};

export {
  allUsersService,
  oneUserService,
  banUserService,
  removeService,
  changeRoleService,
  updateUserService,
};
