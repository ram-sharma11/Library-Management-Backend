const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { registerValidations,
  loginValidations } = require("../validations/validations")

exports.JOIValidationRegister = (body)=>{
  return registerValidations.validate(body,{abortEarly : false,});
}


exports.JOIValidationlogin = (body)=>{
  return loginValidations.validate(body,{abortEarly : false,});
}


exports.generatePasswordHash = async (password) => {
  const createSalt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, createSalt);
};

exports.comparePasswordHash = async (password, oldPasswordHash) => {
  return bcryptjs.compare(password, oldPasswordHash);
};

exports.createJWT = async (payload = {}) => {
  return  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });
};

exports.verifyJWT = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};


exports.errorResponse = async (err, res) => {
  const error = {};
  const statusCode = err.status || 500;
  error.status = false;
  if (err.jwt_expired) {
    error.jwt_expired = err.jwt_expired;
  }
  if(err.errors){
    return res.status(statusCode).json({
      error : err,
    })
  }
  error.message = err.message;
  return res.status(statusCode).json(error);
};



