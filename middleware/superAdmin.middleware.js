const CustomResponse = require("../classes/CustomResponse");

module.exports = (req, res, next) => {
  if (req.userData && req.userData.isSuperAdmin) {
    next();
  } else {
    res
      .status(403)
      .json(
        new CustomResponse(
          CustomResponse.STATUSES.fail,
          "you cant access this api"
        )
      );
  }
};
