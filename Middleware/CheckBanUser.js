const banUserModele = require("./../Models/Models_banPhone");

exports.CheckBan = async (req, res, next) => {
  try {
    const input = req.body.phone || req.body.identifier;

    if (!input) {
      return res
        .status(400)
        .json({ message: "Phone or identifier is required !" });
    }

    const bannedUser = await banUserModele.findOne({
      $or: [{ identifier: input }, { phone: input }],
    });
    if (bannedUser) {
      return res.status(403).json({ message: "This user has been banned.❌" });
    }

    return next();
  } catch (err) {
    next(err);
  }
};
