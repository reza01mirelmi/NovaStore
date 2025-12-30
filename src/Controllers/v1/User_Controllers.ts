const modelsUsers = require("../../Models/Models_Users");
const modelsBanUser = require("./../../Models/Models_banPhone");
const { isValidObjectId } = require("mongoose");
const bcrypt = require("bcrypt");

exports.allUsers = async (req, res, next) => {
  try {
    const users = await modelsUsers.find({}).select("-password -__v").lean();

    if (users.length === 0) {
      return res.status(200).json({ message: "User not found.❌", users: [] });
    }
    return res
      .status(200)
      .json({ message: "User list sent successfully.✅", users });
  } catch (err) {
    next(err);
  }
};

exports.oneUser = async (req, res, next) => {
  try {
    const oneUsers = await modelsUsers
      .findOne({ _id: req.params.id })
      .select("-__v -createdAt -password")
      .populate("orders", "-createdAt -updatedAt -__v")
      .lean();

    if (!oneUsers) {
      return res
        .status(404)
        .json({ meseage: "This user does not exist on the site.❌" });
    }

    return res.status(200).json({
      user: oneUsers,
    });
  } catch (err) {
    next(err);
  }
};

exports.banUser = async (req, res, next) => {
  try {
    const findUserBan = await modelsUsers
      .findOne({ _id: req.params.id })
      .lean();

    if (!findUserBan) {
      return res.status(404).json({ message: "User not found.❌" });
    }

    const existingBan = await modelsBanUser.findOne({
      phone: findUserBan.phone,
    });

    if (existingBan) {
      return res.status(409).json({
        message: "This user is already banned or exists.❌",
      });
    }
    const banUser = await modelsBanUser.create({
      phone: findUserBan.phone,
    });

    if (!banUser) {
      return res.status(400).json({ meseage: "The user was not banned.❌" });
    }
    return res.status(200).json({ meseage: "Banned successfully ✅" });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removeUsers = await modelsUsers
      .findByIdAndDelete({ _id: req.params.id })
      .lean();

    if (!removeUsers) {
      return res
        .status(404)
        .json({ meseage: "User with this ID was not found.❌" });
    }

    return res.status(200).json({ message: "User successfully deleted.✅" });
  } catch (err) {
    next(err);
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const findUsers = await modelsUsers.findOne({ _id: req.params.id }).lean();

    if (!findUsers) {
      return res
        .status(404)
        .json({ message: "This user does not exist on the site.❌" });
    }

    if (findUsers.role == "ADMIN") {
      return res.status(409).json({ message: "This user is an admin.!" });
    }

    const changeRoleUsers = await modelsUsers.findByIdAndUpdate(req.params.id, {
      role: "ADMIN",
    });

    if (changeRoleUsers) {
      return res.status(400).json({ message: "Role update failed" });
    }
    return res
      .status(200)
      .json({ message: "Successfully promoted to admin✅", findUsers });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await modelsUsers.findById(req.user._id);
    let isChanged = false;
    const allowedUpdates = ["name", "email", "phone", "password"];

    for (let key of allowedUpdates) {
      if (key != "password" && req.body[key] != undefined) {
        if (req.body[key] != user[key]) {
          user[key] = req.body[key];
          isChanged = true;
        }
      }
    }

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
      user.passwordChangedAt = Date.now();
    }

    if (!isChanged) {
      return res.status(400).json({ message: "No changes detected ❌" });
    }
    await user.save();

    const userToObject = user.toObject();
    Reflect.deleteProperty(userToObject, "password");

    return res.status(200).json({
      message: "User information was successfully updated✅",
      userToObject,
    });
  } catch (err) {
    next(err);
  }
};
