const { errorResponse } = require("../utils/common")
const { OK } = require("../constants/statusCodes")
const { loginUser,
    registerUser,
    fetchUserProfile,
    userBlocked,
    allbooks
} = require("../services/userServices")


module.exports.register = async (req, res) => {
    try {
        const response = await registerUser(req.body)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.login = async (req, res) => {
    try {
        const response = await loginUser(req.body);
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.getProfile = async (req, res) => {
    try {
        const response = await fetchUserProfile(req.user)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.blockedUsers = async (req, res) => {
    try {
        const response = await userBlocked()
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.getAllBooks= async (req, res) => {
    try {
        const response = await allbooks()
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};