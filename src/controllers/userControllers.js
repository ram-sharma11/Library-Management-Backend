const { errorResponse } = require("../utils/common");
const { OK } = require("../constants/statusCodes")
const {
  fetchUserHistory,
  userIssuedBook
} = require("../services/userServices")


module.exports.userHistory = async (req, res) => {
  try {
    const response = await fetchUserHistory(req.user)
    return res.status(OK).json(response);
  } catch (err) {
    return errorResponse(err, res);
  }
};

module.exports.issuedBook = async (req, res) => {
  try {
    const response = await userIssuedBook(req)
    return res.status(OK).json(response);
  } catch (err) {
    return errorResponse(err, res);
  }
};