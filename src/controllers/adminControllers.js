const { errorResponse } = require("../utils/common")
const { OK } = require("../constants/statusCodes")
const {registerUser,
    givePermission,
    fetchUserProfile 
} = require("../services/userServices")

module.exports.createSubAdmin = async (req, res) => {
    try {
        const response = await registerUser(req.body)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};


module.exports.giveReposibility = async (req, res) => {
    try {
        const response = await givePermission(req.params)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

  
