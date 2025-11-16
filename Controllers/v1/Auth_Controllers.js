const userModele = require("../../Models/Models_Users");
const ValidateRegister = require("../../Validators/Register");
const validateLogin = require("../../Validators/Valid_Login");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const isBodyValidated = ValidateRegister(req.body);
    if (isBodyValidated !== true) {
      return res.status(400).json(isBodyValidated);
    }

    const { name, email, password, phone } = req.body;
    const isUserExists = await userModele.findOne({
      $or: [{ email }, { phone }],
    });
    if (isUserExists) {
      return res
        .status(409)
        .json({ message: "This email Or Phone is already registered.❌" });
    }

    const countUsers = await userModele.countDocuments();
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModele.create({
      name,
      email,
      phone,
      password: hashPassword,
      role: countUsers > 0 ? "USER" : "ADMIN",
    });

    const userObject = user.toObject();
    Reflect.deleteProperty(userObject, "password");

    const accsesToken = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
      expiresIn: "30 day",
    });

    return res.status(201).json({
      message: "User created successfully.✅ ",
      user: userObject,
      accsesToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const isBodyValidated = validateLogin(req.body);

    if (isBodyValidated !== true) {
      return res.status(400).json(isBodyValidated);
    }
    const { identifier, password } = req.body;

    const user = await userModele.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(409).json({ message: "User not found.❌" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(401).json({ message: "The password is not correct.❌" });
    }

    const accsesToken = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
      expiresIn: "30 day",
    });

    return res.status(200).json({ accsesToken });
  } catch (err) {
    next(err);
  }
};

exports.getme = async (req, res, next) => {
  try {
    const user = await userModele
      .findById(req.user._id)
      .select("-password -__v")
      .lean();

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
