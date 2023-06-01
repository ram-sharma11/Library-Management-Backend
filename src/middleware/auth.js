const CustomError = require("../utils/customError")
const statusCode = require("../constants/statusCodes")
const { errorResponse } = require("../utils/common")
const { verifyJWT } = require("../utils/common")
const userModel = require("../models/user")

async function validateToken(request) {
  if (!(request.headers.authorization)) {
    throw new CustomError("Authentication token required", statusCode.UNAUTHORIZED);
  }
  const token = request.headers.authorization.split(' ')[1];
  if (!token) {
    throw new CustomError("Invalid Token", statusCode.UNAUTHORIZED);
  }
  const verifyToken = await verifyJWT(token);
  if (!verifyToken) {
    throw new CustomError("Invalid Token", statusCode.UNAUTHORIZED);
  }
  return { verifyToken, token };
}

const authorization = async (req, res, next) => {
  try {
    const { verifyToken } = await validateToken(req);
    const user = await userModel.findById(verifyToken.id)
    if (!user) {
      throw new CustomError("User not exist from this token", statusCode.UNAUTHORIZED);
    }
    if (user.role == "admin" || user.role == "subadmin") {
      if (!user.havePermission)
        throw new CustomError("you do not have permission to do this action.", statusCode.UNAUTHORIZED);
    }
    req.user = user;
    return next();
  } catch (err) {
    return errorResponse(err, res);
  }
};


const permission = (req, res, next) => {
  try {
    if (req.user.role == "user") {
      throw new CustomError("you do not have permission to do this action.", statusCode.UN_PROCESSABLE_ENTITY);
    }
    return next();
  } catch (err) {
    return errorResponse(err, res);
  }
}


module.exports = { authorization, permission }